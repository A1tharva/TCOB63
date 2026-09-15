'use client'

import {
  Camera,
  CameraOff,
  Columns2,
  Heart,
  RotateCcw,
  Upload,
  UserRound,
} from 'lucide-react'
import { useRef, type PointerEvent as ReactPointerEvent } from 'react'

import { Slider } from '@/components/studio/atoms'
import { useStudio, type StageMode } from '@/components/studio/studio-provider'
import { formatPrice, type Garment } from '@/lib/atelier'
import { cn } from '@/lib/utils'

const MODES: { id: StageMode; label: string }[] = [
  { id: 'live', label: 'Live' },
  { id: 'photo', label: 'Photo' },
  { id: 'model', label: 'Model' },
]

function StageAction({
  label,
  active,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'flex size-8 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
        active
          ? 'border-gold/70 bg-gold/90 text-primary'
          : 'border-stage-foreground/20 bg-stage/50 text-stage-foreground hover:border-gold/60 hover:bg-stage/70',
      )}
    >
      {children}
    </button>
  )
}

function GarmentLayer({
  garment,
  opacity,
  scale,
  clip,
  offset = 0,
}: {
  garment: Garment
  opacity: number
  scale: number
  clip?: string
  offset?: number
}) {
  const { h, y } = garment.fit
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ clipPath: clip }}
    >
      <img
        src={garment.image || '/placeholder.svg'}
        alt=""
        draggable={false}
        className="absolute top-1/2 left-1/2 w-auto max-w-none object-contain mix-blend-multiply transition-[opacity,transform] duration-700 ease-out"
        style={{
          height: `${h}%`,
          opacity: opacity / 100,
          transform: `translate(-50%, calc(-50% + ${y + offset}%)) scale(${scale / 100})`,
          filter: 'brightness(1.08) contrast(1.04)',
        }}
      />
    </div>
  )
}

export function TryOnStage() {
  const {
    selected,
    layer,
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
    saveLook,
    isSaved,
    resetStudio,
  } = useStudio()

  const fileRef = useRef<HTMLInputElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const live = mode === 'live' && cameraStatus === 'live'

  const movePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !frameRef.current) return
    const rect = frameRef.current.getBoundingClientRect()
    const next = ((event.clientX - rect.left) / rect.width) * 100
    setComparePos(Math.min(92, Math.max(8, Math.round(next))))
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'size-1.5 rounded-full',
              live ? 'animate-pulse bg-destructive' : 'bg-muted-foreground/60',
            )}
          />
          <p className="text-[10px] tracking-editorial text-muted-foreground uppercase">
            {live
              ? 'Camera live'
              : mode === 'photo'
                ? 'Uploaded portrait'
                : 'Atelier model'}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Try-on source"
          className="flex items-center gap-0.5 rounded-full border border-border/80 bg-card p-0.5"
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              role="tab"
              type="button"
              aria-selected={mode === m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                'rounded-full px-3 py-1 text-[10px] tracking-widest uppercase transition-colors',
                mode === m.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={frameRef}
        onPointerMove={movePointer}
        onPointerUp={() => (dragging.current = false)}
        onPointerLeave={() => (dragging.current = false)}
        className="relative min-h-[320px] flex-1 overflow-hidden rounded-2xl border border-border bg-stage shadow-[0_40px_80px_-60px_rgba(43,38,30,0.9)]"
      >
        {/* base layer */}
        {mode === 'live' ? (
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="size-full scale-x-[-1] object-cover"
          />
        ) : mode === 'photo' && photoUrl ? (
          <img src={photoUrl} alt="Your uploaded try-on portrait" className="size-full object-cover" />
        ) : (
          <img
            src="/atelier-model.png"
            alt="Atelier reference model for virtual try-on"
            className="size-full object-cover object-top"
          />
        )}

        {/* garment layers */}
        <GarmentLayer
          garment={selected}
          opacity={drape}
          scale={scale}
          clip={compareOn ? `inset(0 ${100 - comparePos}% 0 0)` : undefined}
        />
        {layer && !compareOn ? (
          <GarmentLayer garment={layer} opacity={drape * 0.82} scale={scale * 0.94} offset={-3} />
        ) : null}
        {compareOn && compareGarment ? (
          <GarmentLayer
            garment={compareGarment}
            opacity={drape}
            scale={scale}
            clip={`inset(0 0 0 ${comparePos}%)`}
          />
        ) : null}

        {/* compare divider */}
        {compareOn ? (
          <div
            className="absolute inset-y-0 z-20 w-px bg-gold/80"
            style={{ left: `${comparePos}%` }}
          >
            <button
              type="button"
              aria-label="Drag to compare outfits"
              onPointerDown={() => (dragging.current = true)}
              className="absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-gold/70 bg-stage/80 text-gold backdrop-blur-md"
            >
              <Columns2 className="size-3.5" />
            </button>
            <span className="absolute top-3 left-2 text-[9px] tracking-widest text-stage-foreground/80 uppercase">
              {compareGarment?.colour}
            </span>
          </div>
        ) : null}

        {/* editorial corner marks */}
        <span className="pointer-events-none absolute top-4 left-4 size-6 border-t border-l border-gold/40" />
        <span className="pointer-events-none absolute top-4 right-4 size-6 border-t border-r border-gold/40" />
        <span className="pointer-events-none absolute bottom-4 left-4 size-6 border-b border-l border-gold/40" />
        <span className="pointer-events-none absolute right-4 bottom-4 size-6 border-r border-b border-gold/40" />

        {/* stage actions */}
        <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5">
          <StageAction
            label={live ? 'Camera off' : 'Start try-on'}
            active={live}
            onClick={() => (live ? stopCamera() : void startCamera())}
          >
            {live ? <CameraOff className="size-3.5" /> : <Camera className="size-3.5" />}
          </StageAction>
          <StageAction label="Upload look" onClick={() => fileRef.current?.click()}>
            <Upload className="size-3.5" />
          </StageAction>
          <StageAction label="Compare outfit" active={compareOn} onClick={toggleCompare}>
            <Columns2 className="size-3.5" />
          </StageAction>
          <StageAction label="Save outfit" active={isSaved} onClick={saveLook}>
            <Heart className={cn('size-3.5', isSaved && 'fill-current')} />
          </StageAction>
          <StageAction label="Reset session" onClick={resetStudio}>
            <RotateCcw className="size-3.5" />
          </StageAction>
        </div>

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

        {/* camera notice */}
        {mode === 'live' && cameraStatus !== 'live' ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-stage/85 px-8 text-center backdrop-blur-sm">
            <UserRound className="size-6 text-gold" />
            <p className="max-w-xs font-serif text-lg leading-snug text-stage-foreground">
              {cameraStatus === 'starting'
                ? 'Opening the mirror…'
                : (cameraMessage ?? 'Grant camera access to begin the live fitting.')}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void startCamera()}
                className="rounded-full bg-gold px-4 py-1.5 text-[10px] tracking-widest text-primary uppercase transition-opacity hover:opacity-90"
              >
                Reconnect camera
              </button>
              <button
                type="button"
                onClick={() => setMode('model')}
                className="rounded-full border border-stage-foreground/30 px-4 py-1.5 text-[10px] tracking-widest text-stage-foreground uppercase transition-colors hover:border-gold/60"
              >
                Use model
              </button>
            </div>
          </div>
        ) : null}

        {/* garment caption */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 bg-gradient-to-t from-stage via-stage/70 to-transparent px-5 pt-12 pb-4">
          <div className="min-w-0">
            <p className="text-[9.5px] tracking-editorial text-gold uppercase">{selected.house}</p>
            <h2 className="truncate font-serif text-2xl leading-tight font-light text-stage-foreground">
              {selected.name}
            </h2>
            <p className="text-[11px] text-stage-foreground/65">
              {selected.colour} · {formatPrice(selected.price)}
              {layer ? ` · layered with ${layer.name}` : ''}
            </p>
          </div>
          <div className="hidden w-52 shrink-0 flex-col gap-1.5 sm:flex [&_span]:text-stage-foreground/60">
            <Slider label="Drape" value={drape} onChange={setDrape} min={20} max={100} />
            <Slider label="Scale" value={scale} onChange={setScale} min={70} max={130} />
            {compareOn ? (
              <Slider label="Split" value={comparePos} onChange={setComparePos} min={8} max={92} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
