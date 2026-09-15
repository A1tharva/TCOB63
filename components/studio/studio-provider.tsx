'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'

import {
  GARMENTS,
  fabricVerdict,
  garmentById,
  predictSize,
  styleMatches,
  stylistReply,
  type FitPreference,
  type Garment,
  type SizeProfile,
} from '@/lib/atelier'

export type StageMode = 'live' | 'photo' | 'model'
export type CameraStatus = 'idle' | 'starting' | 'live' | 'error' | 'denied'

export type Insight = {
  id: string
  tool: string
  title: string
  lines: string[]
  badge?: string
}

export type SavedLook = {
  id: string
  garmentId: string
  layerId: string | null
  savedAt: string
}

type StudioValue = {
  garments: Garment[]
  selected: Garment
  layer: Garment | null
  selectGarment: (id: string) => void
  toggleLayer: (id: string) => void

  mode: StageMode
  setMode: (mode: StageMode) => void
  cameraStatus: CameraStatus
  cameraMessage: string | null
  startCamera: () => Promise<void>
  stopCamera: () => void
  videoRef: RefObject<HTMLVideoElement | null>

  photoUrl: string | null
  uploadPhoto: (file: File) => void

  drape: number
  setDrape: (value: number) => void
  scale: number
  setScale: (value: number) => void

  compareOn: boolean
  compareGarment: Garment | null
  comparePos: number
  setComparePos: (value: number) => void
  toggleCompare: () => void
  setCompareGarment: (id: string) => void

  saved: SavedLook[]
  saveLook: () => void
  applyLook: (look: SavedLook) => void
  removeLook: (id: string) => void
  isSaved: boolean

  insight: Insight | null
  pushInsight: (insight: Omit<Insight, 'id'>) => void
  dismissInsight: () => void

  activeTool: string | null
  setActiveTool: (tool: string | null) => void

  profile: SizeProfile
  updateProfile: (patch: Partial<SizeProfile>) => void
  runSizeFit: () => void
  runFabricInsight: () => void
  runStyleMatch: () => void
  runBundle: () => void

  transcript: string
  setTranscript: (value: string) => void
  askStylist: (query: string) => void
  listening: boolean
  toggleListening: () => void
  voiceSupported: boolean
  speechOn: boolean
  toggleSpeech: () => void
  stylistLine: string

  resetStudio: () => void
}

const StudioContext = createContext<StudioValue | null>(null)

export function useStudio() {
  const ctx = useContext(StudioContext)
  if (!ctx) throw new Error('useStudio must be used inside StudioProvider')
  return ctx
}

const DEFAULT_PROFILE: SizeProfile = {
  heightCm: 170,
  bustCm: 90,
  waistCm: 72,
  hipCm: 96,
  preference: 'True',
}

const uid = () => Math.random().toString(36).slice(2, 9)

export function StudioProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState(GARMENTS[0].id)
  const [layerId, setLayerId] = useState<string | null>(null)

  const [mode, setModeState] = useState<StageMode>('model')
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('idle')
  const [cameraMessage, setCameraMessage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const photoUrlRef = useRef<string | null>(null)

  const [drape, setDrape] = useState(94)
  const [scale, setScale] = useState(100)

  const [compareOn, setCompareOn] = useState(false)
  const [compareId, setCompareId] = useState<string>(GARMENTS[3].id)
  const [comparePos, setComparePos] = useState(50)

  const [saved, setSaved] = useState<SavedLook[]>([])
  const [insight, setInsight] = useState<Insight | null>(null)
  const [activeTool, setActiveTool] = useState<string | null>('stylist')

  const [profile, setProfile] = useState<SizeProfile>(DEFAULT_PROFILE)

  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [speechOn, setSpeechOn] = useState(true)
  const [stylistLine, setStylistLine] = useState(
    'Good afternoon. I am your private stylist — name an occasion and I will dress the frame.',
  )
  const recognitionRef = useRef<any>(null)

  const selected = garmentById(selectedId) ?? GARMENTS[0]
  const layer = layerId ? (garmentById(layerId) ?? null) : null
  const compareGarment = garmentById(compareId) ?? null

  /* ------------------------------- speech ------------------------------- */

  const speak = useCallback(
    (text: string) => {
      if (!speechOn || typeof window === 'undefined' || !('speechSynthesis' in window)) return
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.98
      utterance.pitch = 1.02
      window.speechSynthesis.speak(utterance)
    },
    [speechOn],
  )

  const pushInsight = useCallback((next: Omit<Insight, 'id'>) => {
    setInsight({ ...next, id: uid() })
  }, [])

  /* ------------------------------- camera ------------------------------- */

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraStatus('idle')
  }, [])

  const startCamera = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraStatus('error')
      setCameraMessage('This device does not expose a camera to the browser.')
      return
    }
    setCameraStatus('starting')
    setCameraMessage(null)
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      setModeState('live')
      setCameraStatus('live')
      /* the video element mounts with the live mode, so attach on the next frame */
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          void videoRef.current.play().catch(() => undefined)
        }
      })
    } catch (error) {
      const name = error instanceof Error ? error.name : 'Error'
      const denied = name === 'NotAllowedError' || name === 'SecurityError'
      setCameraStatus(denied ? 'denied' : 'error')
      setCameraMessage(
        denied
          ? 'Camera access was declined. Allow the camera in your browser, then reconnect.'
          : 'No camera stream available. Upload a look or continue on the atelier model.',
      )
      setModeState((prev) => (prev === 'live' ? 'model' : prev))
    }
  }, [])

  const setMode = useCallback(
    (next: StageMode) => {
      if (next === 'live') {
        void startCamera()
        return
      }
      if (cameraStatus === 'live') stopCamera()
      if (next === 'photo' && !photoUrlRef.current) {
        setModeState('model')
        pushInsight({
          tool: 'Upload Look',
          title: 'No image on file',
          lines: ['Upload a portrait to place garments on your own photograph.'],
        })
        return
      }
      setModeState(next)
    },
    [cameraStatus, pushInsight, startCamera, stopCamera],
  )

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current)
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    setVoiceSupported(Boolean(SR))
  }, [])

  const uploadPhoto = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file)
      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current)
      photoUrlRef.current = url
      setPhotoUrl(url)
      if (cameraStatus === 'live') stopCamera()
      setModeState('photo')
      pushInsight({
        tool: 'Upload Look',
        title: 'Portrait received',
        lines: [
          'Your image is now the try-on base. Garment layers are matched to the frame silhouette.',
          'Adjust drape and scale on the stage rail for an accurate placement.',
        ],
        badge: 'Ready',
      })
    },
    [cameraStatus, pushInsight, stopCamera],
  )

  /* -------------------------------- looks -------------------------------- */

  const isSaved = saved.some((l) => l.garmentId === selectedId && l.layerId === layerId)

  const saveLook = useCallback(() => {
    setSaved((prev) => {
      const existing = prev.find((l) => l.garmentId === selectedId && l.layerId === layerId)
      if (existing) return prev.filter((l) => l.id !== existing.id)
      return [
        {
          id: uid(),
          garmentId: selectedId,
          layerId,
          savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
      ].slice(0, 8)
    })
  }, [layerId, selectedId])

  const applyLook = useCallback((look: SavedLook) => {
    setSelectedId(look.garmentId)
    setLayerId(look.layerId)
  }, [])

  const removeLook = useCallback((id: string) => {
    setSaved((prev) => prev.filter((l) => l.id !== id))
  }, [])

  /* -------------------------------- tools -------------------------------- */

  const selectGarment = useCallback(
    (id: string) => {
      setSelectedId((prev) => {
        if (prev !== id) setCompareId(prev)
        return id
      })
      setLayerId((prev) => (prev === id ? null : prev))
    },
    [],
  )

  const toggleLayer = useCallback((id: string) => {
    setLayerId((prev) => (prev === id ? null : id))
  }, [])

  const runSizeFit = useCallback(() => {
    const verdict = predictSize(profile, selected)
    setActiveTool('size')
    pushInsight({
      tool: 'Size Fit',
      title: `Recommended size ${verdict.size}`,
      badge: `${verdict.confidence}% confidence`,
      lines: [...verdict.lines, `Second option: ${verdict.alternate}. ${selected.fitNote}`],
    })
  }, [profile, pushInsight, selected])

  const runFabricInsight = useCallback(() => {
    setActiveTool('fabric')
    pushInsight({
      tool: 'Fabric Insight',
      title: selected.fabric.composition,
      badge: selected.fabric.weight,
      lines: [`Hand feel: ${selected.fabric.hand.toLowerCase()}.`, ...fabricVerdict(selected)],
    })
  }, [pushInsight, selected])

  const runStyleMatch = useCallback(() => {
    const matches = styleMatches(selected)
    setActiveTool('match')
    pushInsight({
      tool: 'Style Match',
      title: `Three pairings for the ${selected.name}`,
      badge: `${matches[0].score}% affinity`,
      lines: matches.map((m) => `${m.garment.name} — ${m.reason}`),
    })
  }, [pushInsight, selected])

  const runBundle = useCallback(() => {
    const total = selected.bundle.reduce((sum, item) => sum + item.price, selected.price)
    setActiveTool('bundle')
    pushInsight({
      tool: 'Bought Together',
      title: 'The complete acquisition',
      badge: `${selected.bundle.length + 1} pieces`,
      lines: [
        `${selected.name} with ${selected.bundle.map((b) => b.name.toLowerCase()).join(' and ')}.`,
        `Clients who acquired this piece completed the set 4 times in 5.`,
        `Set total ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(total)} — atelier fitting included.`,
      ],
    })
  }, [pushInsight, selected])

  const askStylist = useCallback(
    (query: string) => {
      const reply = stylistReply(query, selected)
      setStylistLine(reply.text)
      setActiveTool('stylist')
      if (reply.garment && reply.garment.id !== selectedId) {
        selectGarment(reply.garment.id)
      }
      pushInsight({
        tool: 'Voice Stylist',
        title: query ? `“${query}”` : 'Awaiting your brief',
        badge: reply.garment ? reply.garment.colour : undefined,
        lines: [reply.text],
      })
      speak(reply.text)
    },
    [pushInsight, selectGarment, selected, selectedId, speak],
  )

  const toggleListening = useCallback(() => {
    if (typeof window === 'undefined') return
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition

    if (!SR) {
      setActiveTool('stylist')
      pushInsight({
        tool: 'Voice Stylist',
        title: 'Dictation unavailable in this browser',
        lines: ['Type your brief in the stylist field — the assistant answers either way.'],
      })
      return
    }

    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }

    const recognition = new SR()
    recognition.lang = 'en-US'
    recognition.interimResults = true
    recognition.continuous = false
    recognition.onresult = (event: any) => {
      const text = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join(' ')
        .trim()
      setTranscript(text)
      if (event.results[event.results.length - 1].isFinal) {
        askStylist(text)
      }
    }
    recognition.onerror = () => {
      setListening(false)
      pushInsight({
        tool: 'Voice Stylist',
        title: 'Microphone unavailable',
        lines: ['Allow microphone access, or type your brief in the stylist field.'],
      })
    }
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    setActiveTool('stylist')
    setListening(true)
    recognition.start()
  }, [askStylist, listening, pushInsight])

  const toggleSpeech = useCallback(() => {
    setSpeechOn((prev) => {
      if (prev && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      return !prev
    })
  }, [])

  const toggleCompare = useCallback(() => {
    setCompareOn((prev) => !prev)
  }, [])

  const setCompareGarment = useCallback((id: string) => setCompareId(id), [])

  const updateProfile = useCallback((patch: Partial<SizeProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }))
  }, [])

  const resetStudio = useCallback(() => {
    stopCamera()
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current)
    photoUrlRef.current = null
    setPhotoUrl(null)
    setModeState('model')
    setSelectedId(GARMENTS[0].id)
    setLayerId(null)
    setDrape(94)
    setScale(100)
    setCompareOn(false)
    setComparePos(50)
    setInsight(null)
    setTranscript('')
    setCameraMessage(null)
    setProfile(DEFAULT_PROFILE)
    setStylistLine('Session cleared. The atelier is ready for a new fitting.')
  }, [stopCamera])

  const value = useMemo<StudioValue>(
    () => ({
      garments: GARMENTS,
      selected,
      layer,
      selectGarment,
      toggleLayer,
      mode,
      setMode,
      cameraStatus,
      cameraMessage,
      startCamera,
      stopCamera,
      videoRef,
      photoUrl,
      uploadPhoto,
      drape,
      setDrape,
      scale,
      setScale,
      compareOn,
      compareGarment,
      comparePos,
      setComparePos,
      toggleCompare,
      setCompareGarment,
      saved,
      saveLook,
      applyLook,
      removeLook,
      isSaved,
      insight,
      pushInsight,
      dismissInsight: () => setInsight(null),
      activeTool,
      setActiveTool,
      profile,
      updateProfile,
      runSizeFit,
      runFabricInsight,
      runStyleMatch,
      runBundle,
      transcript,
      setTranscript,
      askStylist,
      listening,
      toggleListening,
      voiceSupported,
      speechOn,
      toggleSpeech,
      stylistLine,
      resetStudio,
    }),
    [
      activeTool,
      askStylist,
      cameraMessage,
      cameraStatus,
      compareGarment,
      compareOn,
      comparePos,
      drape,
      insight,
      isSaved,
      layer,
      listening,
      mode,
      photoUrl,
      profile,
      pushInsight,
      removeLook,
      resetStudio,
      runBundle,
      runFabricInsight,
      runSizeFit,
      runStyleMatch,
      saveLook,
      applyLook,
      saved,
      scale,
      selectGarment,
      selected,
      setCompareGarment,
      setMode,
      speechOn,
      startCamera,
      stopCamera,
      stylistLine,
      toggleCompare,
      toggleLayer,
      toggleListening,
      toggleSpeech,
      transcript,
      updateProfile,
      uploadPhoto,
      voiceSupported,
    ],
  )

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
}

export type { FitPreference }
