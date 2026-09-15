'use client'

import { Heart, Layers, ShoppingBag, Sparkles, X } from 'lucide-react'

import { Eyebrow, Panel } from '@/components/studio/atoms'
import { useStudio } from '@/components/studio/studio-provider'
import { formatPrice, garmentById, styleMatches } from '@/lib/atelier'
import { cn } from '@/lib/utils'

export function InsightsPanel() {
  const {
    selected,
    layer,
    toggleLayer,
    selectGarment,
    insight,
    dismissInsight,
    runStyleMatch,
    runBundle,
    saved,
    applyLook,
    removeLook,
    saveLook,
    isSaved,
    setCompareGarment,
    compareOn,
    toggleCompare,
  } = useStudio()

  const matches = styleMatches(selected)
  const bundleTotal = selected.bundle.reduce((sum, item) => sum + item.price, selected.price)

  return (
    <Panel className="flex min-h-0 flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-border/70 px-3.5 py-2.5">
        <Eyebrow>Selection &amp; insight</Eyebrow>
        <button
          type="button"
          onClick={saveLook}
          className={cn(
            'flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9.5px] tracking-widest uppercase transition-colors',
            isSaved
              ? 'border-gold/70 bg-gold/20 text-foreground'
              : 'border-border/80 hover:border-gold/60',
          )}
        >
          <Heart className={cn('size-2.5', isSaved && 'fill-current')} />
          {isSaved ? 'Saved' : 'Save look'}
        </button>
      </header>

      <div className="rail-scroll min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {/* selected garment */}
        <div className="flex gap-2.5">
          <img
            src={selected.image || '/placeholder.svg'}
            alt={selected.name}
            className="size-16 shrink-0 rounded-md border border-border/70 bg-secondary/50 object-cover"
          />
          <div className="min-w-0">
            <p className="text-[9.5px] tracking-editorial text-muted-foreground uppercase">
              {selected.category}
            </p>
            <p className="truncate font-serif text-lg leading-tight">{selected.name}</p>
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span
                className="size-2.5 rounded-full border border-border"
                style={{ background: selected.swatch }}
                aria-hidden
              />
              {selected.colour} · {formatPrice(selected.price)}
            </p>
          </div>
        </div>
        <p className="text-[11.5px] leading-relaxed text-muted-foreground">{selected.fitNote}</p>

        {/* live insight */}
        <div
          key={insight?.id ?? 'idle'}
          className="animate-rise rounded-lg border border-gold/40 bg-gold/8 p-2.5"
        >
          <div className="mb-1 flex items-start justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[9.5px] tracking-editorial text-foreground uppercase">
              <Sparkles className="size-3 text-gold" />
              {insight ? insight.tool : 'AI insight'}
            </span>
            {insight ? (
              <button
                type="button"
                onClick={dismissInsight}
                aria-label="Dismiss insight"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            ) : null}
          </div>
          {insight ? (
            <>
              <p className="font-serif text-[15px] leading-snug">{insight.title}</p>
              {insight.badge ? (
                <p className="mt-0.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                  {insight.badge}
                </p>
              ) : null}
              <ul className="mt-1.5 space-y-1">
                {insight.lines.map((line, index) => (
                  <li
                    key={index}
                    className="text-[11.5px] leading-relaxed text-muted-foreground before:mr-1.5 before:text-gold before:content-['—']"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-[11.5px] leading-relaxed text-muted-foreground">
              Run a styling tool and the reading appears here — fit, cloth, pairings and provenance.
            </p>
          )}
        </div>

        {/* style match */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Eyebrow>Style match</Eyebrow>
            <button
              type="button"
              onClick={runStyleMatch}
              className="text-[9.5px] tracking-widest text-muted-foreground uppercase underline decoration-gold/60 underline-offset-4 transition-colors hover:text-foreground"
            >
              Analyse
            </button>
          </div>
          {matches.map((match) => (
            <div
              key={match.garment.id}
              className="flex items-center gap-2 rounded-lg border border-border/70 p-1.5 transition-colors hover:border-gold/50"
            >
              <img
                src={match.garment.image || '/placeholder.svg'}
                alt={match.garment.name}
                className="size-10 shrink-0 rounded-md bg-secondary/50 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] leading-tight font-medium">
                  {match.garment.name}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {match.score}% affinity · {match.garment.colour}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => selectGarment(match.garment.id)}
                  className="rounded-md border border-border/80 px-1.5 py-0.5 text-[9px] tracking-widest uppercase transition-colors hover:border-gold/60"
                >
                  Try
                </button>
                <button
                  type="button"
                  onClick={() => toggleLayer(match.garment.id)}
                  aria-label={`Layer ${match.garment.name}`}
                  aria-pressed={layer?.id === match.garment.id}
                  className={cn(
                    'flex size-5 items-center justify-center rounded-md border transition-colors',
                    layer?.id === match.garment.id
                      ? 'border-transparent bg-primary text-primary-foreground'
                      : 'border-border/80 hover:border-gold/60',
                  )}
                >
                  <Layers className="size-2.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* bought together */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Eyebrow>Frequently bought together</Eyebrow>
            <button
              type="button"
              onClick={runBundle}
              className="text-[9.5px] tracking-widest text-muted-foreground uppercase underline decoration-gold/60 underline-offset-4 transition-colors hover:text-foreground"
            >
              Review
            </button>
          </div>
          <div className="rounded-lg bg-secondary/45 p-2">
            <ul className="space-y-1">
              <li className="flex items-baseline justify-between gap-2 text-[11.5px]">
                <span className="truncate">{selected.name}</span>
                <span className="font-mono text-[10.5px] text-muted-foreground tabular-nums">
                  {formatPrice(selected.price)}
                </span>
              </li>
              {selected.bundle.map((item) => (
                <li
                  key={item.name}
                  className="flex items-baseline justify-between gap-2 text-[11.5px] text-muted-foreground"
                >
                  <span className="truncate">{item.name}</span>
                  <span className="font-mono text-[10.5px] tabular-nums">
                    {formatPrice(item.price)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-1.5 flex items-center justify-between border-t border-border/70 pt-1.5">
              <span className="flex items-center gap-1 text-[9.5px] tracking-widest uppercase">
                <ShoppingBag className="size-2.5 text-gold" /> Set total
              </span>
              <span className="font-mono text-[11px] tabular-nums">
                {formatPrice(bundleTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* saved looks */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Eyebrow>Saved looks</Eyebrow>
            <button
              type="button"
              onClick={toggleCompare}
              className={cn(
                'text-[9.5px] tracking-widest uppercase underline decoration-gold/60 underline-offset-4 transition-colors',
                compareOn ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {compareOn ? 'Exit compare' : 'Compare'}
            </button>
          </div>
          {saved.length === 0 ? (
            <p className="text-[11px] text-muted-foreground">
              Nothing archived yet. Save a look to build the fitting record.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-1.5">
              {saved.map((look) => {
                const garment = garmentById(look.garmentId)
                if (!garment) return null
                return (
                  <li key={look.id}>
                    <span className="flex items-center gap-1 rounded-full border border-border/80 bg-background py-0.5 pr-1 pl-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          applyLook(look)
                          setCompareGarment(garment.id)
                        }}
                        className="flex items-center gap-1 text-[10px]"
                      >
                        <span
                          className="size-2 rounded-full"
                          style={{ background: garment.swatch }}
                          aria-hidden
                        />
                        {garment.name}
                        <span className="text-muted-foreground">{look.savedAt}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeLook(look.id)}
                        aria-label={`Remove ${garment.name} from saved looks`}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <X className="size-2.5" />
                      </button>
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </Panel>
  )
}
