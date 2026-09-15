'use client'

import {
  AudioLines,
  Camera,
  Mic,
  MicOff,
  Ruler,
  ScanLine,
  Upload,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useRef, useState } from 'react'

import { Eyebrow, Field, Meter, Panel, ToolTile } from '@/components/studio/atoms'
import { useStudio } from '@/components/studio/studio-provider'
import type { FitPreference } from '@/lib/atelier'
import { cn } from '@/lib/utils'

const PREFERENCES: FitPreference[] = ['Sculpted', 'True', 'Relaxed']

export function ToolsPanel() {
  const {
    activeTool,
    setActiveTool,
    startCamera,
    uploadPhoto,
    cameraStatus,
    selected,
    profile,
    updateProfile,
    runSizeFit,
    runFabricInsight,
    listening,
    toggleListening,
    voiceSupported,
    speechOn,
    toggleSpeech,
    askStylist,
    transcript,
    setTranscript,
    stylistLine,
  } = useStudio()

  const fileRef = useRef<HTMLInputElement>(null)
  const [draft, setDraft] = useState('')
  const query = listening ? transcript : draft

  const toggle = (id: string) => setActiveTool(activeTool === id ? null : id)

  return (
    <Panel className="flex min-h-0 flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-border/70 px-3.5 py-2.5">
        <Eyebrow>Styling tools</Eyebrow>
        <span className="text-[9.5px] text-muted-foreground">Aurea Intelligence</span>
      </header>

      <div className="rail-scroll min-h-0 flex-1 space-y-2 overflow-y-auto p-2.5">
        {/* capture */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => void startCamera()}
            className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[11px] tracking-widest text-primary-foreground uppercase transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <Camera className="size-3.5" />
            {cameraStatus === 'live' ? 'Camera connected' : 'Start try-on'}
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border/80 px-2 py-1.5 text-[10px] tracking-widest uppercase transition-colors hover:border-gold/60 hover:bg-secondary/60"
          >
            <Upload className="size-3" />
            Upload
          </button>
          <button
            type="button"
            onClick={() => void startCamera()}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border/80 px-2 py-1.5 text-[10px] tracking-widest uppercase transition-colors hover:border-gold/60 hover:bg-secondary/60"
          >
            <AudioLines className="size-3" />
            Reconnect
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) uploadPhoto(file)
              event.target.value = ''
            }}
          />
        </div>

        <div className="h-px bg-border/70" />

        {/* voice stylist */}
        <ToolTile
          icon={<Mic className="size-3.5" />}
          label="Voice Stylist"
          hint={listening ? 'Listening…' : 'Ask for an occasion'}
          active={activeTool === 'stylist'}
          onClick={() => toggle('stylist')}
        />
        {activeTool === 'stylist' ? (
          <div className="animate-rise space-y-2 rounded-lg bg-secondary/45 p-2.5">
            <p className="font-serif text-[13px] leading-snug text-foreground/90">{stylistLine}</p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleListening}
                aria-pressed={listening}
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors',
                  listening
                    ? 'animate-pulse border-transparent bg-destructive text-primary-foreground'
                    : 'border-border bg-background hover:border-gold/60',
                )}
                aria-label={listening ? 'Stop listening' : 'Speak to the stylist'}
              >
                {listening ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
              </button>
              <form
                className="flex min-w-0 flex-1 items-center rounded-full border border-border bg-background pr-1 pl-2.5 focus-within:border-gold"
                onSubmit={(event) => {
                  event.preventDefault()
                  askStylist(draft)
                  setDraft('')
                }}
              >
                <input
                  value={query}
                  onChange={(event) => {
                    setDraft(event.target.value)
                    setTranscript('')
                  }}
                  placeholder="Dinner in Paris, cold evening…"
                  className="min-w-0 flex-1 bg-transparent py-1.5 text-[12px] outline-none placeholder:text-muted-foreground/70"
                  aria-label="Brief for the AI stylist"
                />
                <button
                  type="submit"
                  className="rounded-full bg-primary px-2.5 py-1 text-[9.5px] tracking-widest text-primary-foreground uppercase"
                >
                  Ask
                </button>
              </form>
              <button
                type="button"
                onClick={toggleSpeech}
                aria-pressed={speechOn}
                aria-label={speechOn ? 'Mute stylist voice' : 'Unmute stylist voice'}
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background transition-colors hover:border-gold/60"
              >
                {speechOn ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
              </button>
            </div>
            {!voiceSupported ? (
              <p className="text-[10px] text-muted-foreground">
                Dictation is unavailable in this browser — typed briefs answer identically.
              </p>
            ) : null}
          </div>
        ) : null}

        {/* size fit */}
        <ToolTile
          icon={<Ruler className="size-3.5" />}
          label="Size Fit"
          hint="Measurement-based prediction"
          active={activeTool === 'size'}
          onClick={() => toggle('size')}
        />
        {activeTool === 'size' ? (
          <div className="animate-rise space-y-2 rounded-lg bg-secondary/45 p-2.5">
            <div className="grid grid-cols-2 gap-1.5">
              <Field
                label="Height"
                value={profile.heightCm}
                suffix="cm"
                onChange={(v) => updateProfile({ heightCm: v })}
              />
              <Field
                label="Bust"
                value={profile.bustCm}
                suffix="cm"
                onChange={(v) => updateProfile({ bustCm: v })}
              />
              <Field
                label="Waist"
                value={profile.waistCm}
                suffix="cm"
                onChange={(v) => updateProfile({ waistCm: v })}
              />
              <Field
                label="Hip"
                value={profile.hipCm}
                suffix="cm"
                onChange={(v) => updateProfile({ hipCm: v })}
              />
            </div>
            <div className="flex gap-1">
              {PREFERENCES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => updateProfile({ preference: p })}
                  className={cn(
                    'flex-1 rounded-md border py-1 text-[9.5px] tracking-widest uppercase transition-colors',
                    profile.preference === p
                      ? 'border-transparent bg-primary text-primary-foreground'
                      : 'border-border/80 bg-background hover:border-gold/60',
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={runSizeFit}
              className="w-full rounded-lg border border-gold/70 bg-gold/15 py-1.5 text-[10px] tracking-widest uppercase transition-colors hover:bg-gold/30"
            >
              Predict my size
            </button>
          </div>
        ) : null}

        {/* fabric */}
        <ToolTile
          icon={<ScanLine className="size-3.5" />}
          label="Fabric Insight"
          hint="Tactile analysis"
          active={activeTool === 'fabric'}
          onClick={() => toggle('fabric')}
        />
        {activeTool === 'fabric' ? (
          <div className="animate-rise space-y-2 rounded-lg bg-secondary/45 p-2.5">
            <p className="text-[11px] leading-snug text-muted-foreground">
              {selected.fabric.composition} · {selected.fabric.weight}
            </p>
            <div className="space-y-1.5">
              <Meter label="Drape" value={selected.fabric.drape} />
              <Meter label="Structure" value={selected.fabric.structure} />
              <Meter label="Stretch" value={selected.fabric.stretch} />
              <Meter label="Breathability" value={selected.fabric.breathability} />
              <Meter label="Sheen" value={selected.fabric.sheen} />
            </div>
            <button
              type="button"
              onClick={runFabricInsight}
              className="w-full rounded-lg border border-gold/70 bg-gold/15 py-1.5 text-[10px] tracking-widest uppercase transition-colors hover:bg-gold/30"
            >
              Classify this cloth
            </button>
          </div>
        ) : null}
      </div>
    </Panel>
  )
}
