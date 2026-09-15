'use client'

import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        'text-[10px] font-medium tracking-editorial text-muted-foreground uppercase',
        className,
      )}
    >
      {children}
    </p>
  )
}

export function Panel({
  children,
  className,
  ...props
}: ComponentProps<'section'>) {
  return (
    <section
      className={cn(
        'rounded-xl border border-border/80 bg-card shadow-[0_1px_2px_rgba(43,38,30,0.04),0_12px_32px_-24px_rgba(43,38,30,0.35)]',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}

export function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-[11px] text-muted-foreground">{label}</span>
      <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-secondary">
        <span
          className="block h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
          style={{ width: `${value}%` }}
        />
      </span>
      <span className="w-7 shrink-0 text-right font-mono text-[10px] text-muted-foreground tabular-nums">
        {value}
      </span>
    </div>
  )
}

export function ToolTile({
  icon,
  label,
  hint,
  active,
  onClick,
}: {
  icon: ReactNode
  label: string
  hint?: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-all duration-300',
        'hover:border-gold/60 hover:bg-secondary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
        active
          ? 'border-gold/70 bg-secondary/70 shadow-[inset_2px_0_0_var(--gold)]'
          : 'border-border/70 bg-transparent',
      )}
    >
      <span
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-md border transition-colors',
          active
            ? 'border-transparent bg-primary text-primary-foreground'
            : 'border-border/70 bg-background text-foreground group-hover:border-gold/50',
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] leading-tight font-medium">{label}</span>
        {hint ? (
          <span className="block truncate text-[10.5px] leading-tight text-muted-foreground">
            {hint}
          </span>
        ) : null}
      </span>
    </button>
  )
}

export function Slider({
  label,
  value,
  min = 0,
  max = 100,
  suffix = '%',
  onChange,
}: {
  label: string
  value: number
  min?: number
  max?: number
  suffix?: string
  onChange: (value: number) => void
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="w-14 shrink-0 text-[10px] tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-border accent-[var(--gold)] outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
        aria-label={label}
      />
      <span className="w-9 shrink-0 text-right font-mono text-[10px] text-muted-foreground tabular-nums">
        {value}
        {suffix}
      </span>
    </label>
  )
}

export function Field({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  suffix?: string
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[9.5px] tracking-widest text-muted-foreground uppercase">{label}</span>
      <span className="flex items-center rounded-md border border-border/80 bg-background px-2 focus-within:border-gold">
        <input
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full bg-transparent py-1 text-[12.5px] tabular-nums outline-none"
        />
        {suffix ? (
          <span className="pl-1 text-[10px] text-muted-foreground">{suffix}</span>
        ) : null}
      </span>
    </label>
  )
}
