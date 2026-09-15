'use client'

import { Heart, Shirt } from 'lucide-react'

import { GarmentRail } from '@/components/studio/garment-rail'
import { InsightsPanel } from '@/components/studio/insights-panel'
import { ToolsPanel } from '@/components/studio/tools-panel'
import { TryOnStage } from '@/components/studio/tryon-stage'
import { useStudio } from '@/components/studio/studio-provider'

function StudioHeader() {
  const { saved, cameraStatus, mode } = useStudio()

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border/80 px-4 py-2.5">
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-full border border-gold/60 bg-primary text-primary-foreground">
          <Shirt className="size-3.5" />
        </span>
        <span>
          <span className="block font-serif text-xl leading-none tracking-[0.3em] uppercase">
            Aurea
          </span>
          <span className="block text-[8.5px] tracking-editorial text-muted-foreground uppercase">
            Virtual atelier
          </span>
        </span>
      </div>

      <div className="hidden min-w-0 text-center md:block">
        <h1 className="truncate font-serif text-lg leading-tight font-light text-balance">
          Dress the moment before you own it
        </h1>
        <p className="truncate text-[10.5px] text-muted-foreground">
          Try garments live, read the cloth, predict the fit, and take counsel from a private AI
          stylist.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden items-center gap-1.5 text-[9.5px] tracking-widest text-muted-foreground uppercase sm:flex">
          <span className="size-1.5 rounded-full bg-gold" />
          {cameraStatus === 'live' ? 'Mirror live' : mode === 'photo' ? 'Portrait' : 'Model'}
        </span>
        <span className="flex items-center gap-1 rounded-full border border-border/80 px-2 py-0.5 text-[10px]">
          <Heart className="size-2.5 text-gold" />
          <span className="tabular-nums">{saved.length}</span>
        </span>
      </div>
    </header>
  )
}

export function StudioShell() {
  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-background">
      <StudioHeader />

      <div className="grid min-h-0 flex-1 gap-3 overflow-y-auto p-3 lg:grid-cols-[268px_minmax(0,1fr)_308px] lg:overflow-hidden">
        <div className="order-2 flex min-h-[260px] flex-col lg:order-1 lg:min-h-0">
          <ToolsPanel />
        </div>
        <div className="order-1 min-h-[420px] lg:order-2 lg:min-h-0">
          <TryOnStage />
        </div>
        <div className="order-3 flex min-h-[320px] flex-col lg:min-h-0">
          <InsightsPanel />
        </div>
      </div>

      <GarmentRail />
    </main>
  )
}
