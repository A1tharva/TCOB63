'use client'

import { ArrowLeftRight, Layers } from 'lucide-react'

import { Eyebrow } from '@/components/studio/atoms'
import { useStudio } from '@/components/studio/studio-provider'
import { formatPrice } from '@/lib/atelier'
import { cn } from '@/lib/utils'

export function GarmentRail() {
  const {
    garments,
    selected,
    layer,
    selectGarment,
    toggleLayer,
    compareGarment,
    setCompareGarment,
    compareOn,
  } = useStudio()

  return (
    <section className="border-t border-border/80 bg-card/60 px-3 py-2 backdrop-blur-sm">
      <div className="mb-1.5 flex items-baseline justify-between">
        <Eyebrow>The rail · Autumn edit</Eyebrow>
        <p className="text-[9.5px] text-muted-foreground">
          {garments.length} pieces ready for the mirror
        </p>
      </div>
      <ul className="rail-scroll flex gap-2 overflow-x-auto pb-1">
        {garments.map((garment) => {
          const active = garment.id === selected.id
          const layered = layer?.id === garment.id
          const comparing = compareOn && compareGarment?.id === garment.id
          return (
            <li key={garment.id} className="shrink-0">
              <div
                className={cn(
                  'group relative flex w-[178px] items-center gap-2 rounded-lg border p-1.5 transition-all duration-300',
                  active
                    ? 'border-gold bg-secondary/70 shadow-[0_0_0_1px_var(--gold)]'
                    : 'border-border/70 bg-background hover:border-gold/50 hover:bg-secondary/40',
                )}
              >
                <button
                  type="button"
                  onClick={() => selectGarment(garment.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  aria-pressed={active}
                >
                  <img
                    src={garment.image || '/placeholder.svg'}
                    alt={garment.name}
                    className="size-12 shrink-0 rounded-md bg-secondary/60 object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[11.5px] leading-tight font-medium">
                      {garment.name}
                    </span>
                    <span className="block truncate text-[9.5px] text-muted-foreground">
                      {garment.colour}
                    </span>
                    <span className="block font-mono text-[9.5px] text-muted-foreground tabular-nums">
                      {formatPrice(garment.price)}
                    </span>
                  </span>
                </button>
                <span className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => toggleLayer(garment.id)}
                    aria-label={`Layer ${garment.name} onto the look`}
                    aria-pressed={layered}
                    title="Add as layer"
                    className={cn(
                      'flex size-5 items-center justify-center rounded border transition-colors',
                      layered
                        ? 'border-transparent bg-primary text-primary-foreground'
                        : 'border-border/80 hover:border-gold/60',
                    )}
                  >
                    <Layers className="size-2.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompareGarment(garment.id)}
                    aria-label={`Compare against ${garment.name}`}
                    aria-pressed={comparing}
                    title="Set as compare"
                    className={cn(
                      'flex size-5 items-center justify-center rounded border transition-colors',
                      comparing
                        ? 'border-transparent bg-gold text-primary'
                        : 'border-border/80 hover:border-gold/60',
                    )}
                  >
                    <ArrowLeftRight className="size-2.5" />
                  </button>
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
