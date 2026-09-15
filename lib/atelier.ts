export type Fabric = {
  composition: string
  weight: string
  hand: string
  care: string
  drape: number
  stretch: number
  breathability: number
  sheen: number
  structure: number
}

export type BundleItem = {
  name: string
  price: number
}

export type Garment = {
  id: string
  name: string
  house: string
  category: 'Outerwear' | 'Dress' | 'Knitwear' | 'Tailoring' | 'Skirt'
  price: number
  image: string
  colour: string
  swatch: string
  family: 'warm-neutral' | 'deep-neutral'
  /* wearing ease in cm, drives size prediction */
  ease: number
  lengthCm: number
  /* stage geometry: h = overlay height as % of frame, y = vertical nudge in % */
  fit: { h: number; y: number }
  stylistNote: string
  fitNote: string
  fabric: Fabric
  bundle: BundleItem[]
  keywords: string[]
}

export const GARMENTS: Garment[] = [
  {
    id: 'slip-dress',
    name: 'Bias Slip Dress',
    house: 'Atelier Aurea',
    category: 'Dress',
    price: 1290,
    image: '/garments/silk-slip-dress.png',
    colour: 'Champagne',
    swatch: '#E4D6BE',
    family: 'warm-neutral',
    ease: 2,
    lengthCm: 132,
    fit: { h: 86, y: 0 },
    stylistNote:
      'Cut on the true bias, so it reads as a second skin. Wear with bare shoulders for evening, or layered beneath tailoring by day.',
    fitNote: 'Runs close through the hip — the bias gives, the shoulder does not.',
    fabric: {
      composition: '100% mulberry silk charmeuse',
      weight: '19 momme · 92 g/m²',
      hand: 'Cool, liquid, slips over the hand',
      care: 'Dry clean · steam on low',
      drape: 96,
      stretch: 24,
      breathability: 82,
      sheen: 88,
      structure: 14,
    },
    bundle: [
      { name: 'Silk slip petticoat', price: 210 },
      { name: 'Gilt vermeil chain belt', price: 340 },
    ],
    keywords: ['dress', 'evening', 'dinner', 'silk', 'gala', 'party', 'wedding', 'date'],
  },
  {
    id: 'wool-trench',
    name: 'Double-Faced Trench',
    house: 'Maison Lume',
    category: 'Outerwear',
    price: 2480,
    image: '/garments/wool-trench.png',
    colour: 'Camel',
    swatch: '#C8A57A',
    family: 'warm-neutral',
    ease: 12,
    lengthCm: 118,
    fit: { h: 78, y: -4 },
    stylistNote:
      'A architectural camel line that finishes every look. Belt it for waist definition, leave it open for column height.',
    fitNote: 'Generous by design — take your true size, the volume is intentional.',
    fabric: {
      composition: '78% virgin wool · 22% cashmere',
      weight: 'Heavy · 480 g/m²',
      hand: 'Dense, dry, faintly brushed',
      care: 'Dry clean · brush with the nap',
      drape: 58,
      stretch: 12,
      breathability: 64,
      sheen: 18,
      structure: 88,
    },
    bundle: [
      { name: 'Cashmere-silk stole', price: 460 },
      { name: 'Bridle leather belt', price: 290 },
    ],
    keywords: ['coat', 'trench', 'outerwear', 'winter', 'cold', 'travel', 'camel'],
  },
  {
    id: 'cashmere-knit',
    name: 'Ribbed Cashmere Roll-Neck',
    house: 'Atelier Aurea',
    category: 'Knitwear',
    price: 690,
    image: '/garments/cashmere-knit.png',
    colour: 'Oatmeal',
    swatch: '#D8C9AF',
    family: 'warm-neutral',
    ease: 4,
    lengthCm: 64,
    fit: { h: 44, y: -21 },
    stylistNote:
      'The quiet anchor of the wardrobe. Tuck into pleats for proportion, or wear beneath the slip dress for a layered day look.',
    fitNote: 'The 2×2 rib recovers well; size down for a sculpted line.',
    fabric: {
      composition: '100% grade-A Mongolian cashmere',
      weight: 'Mid · 260 g/m²',
      hand: 'Warm, downy, low prickle',
      care: 'Hand wash cool · dry flat',
      drape: 72,
      stretch: 78,
      breathability: 76,
      sheen: 12,
      structure: 42,
    },
    bundle: [
      { name: 'Cedar knitwear box', price: 120 },
      { name: 'Cashmere comb', price: 45 },
    ],
    keywords: ['knit', 'sweater', 'cashmere', 'warm', 'cosy', 'weekend', 'layer'],
  },
  {
    id: 'tailored-blazer',
    name: 'Sculpted Wool Blazer',
    house: 'Maison Lume',
    category: 'Tailoring',
    price: 1680,
    image: '/garments/tailored-blazer.png',
    colour: 'Charcoal Black',
    swatch: '#2C2A28',
    family: 'deep-neutral',
    ease: 8,
    lengthCm: 76,
    fit: { h: 52, y: -17 },
    stylistNote:
      'Half-canvassed with a softened shoulder — sharp enough for the boardroom, fluid enough for evening over silk.',
    fitNote: 'Shoulder is the fixed point; the waist can be taken in one size.',
    fabric: {
      composition: '96% Super 130s wool · 4% elastane',
      weight: 'Mid · 310 g/m²',
      hand: 'Smooth, crisp, cool to touch',
      care: 'Dry clean · hang on a broad hanger',
      drape: 46,
      stretch: 34,
      breathability: 68,
      sheen: 26,
      structure: 92,
    },
    bundle: [
      { name: 'Silk pocket square', price: 150 },
      { name: 'Horn button upgrade', price: 95 },
    ],
    keywords: ['blazer', 'tailoring', 'work', 'meeting', 'office', 'suit', 'interview', 'black'],
  },
  {
    id: 'pleated-skirt',
    name: 'Knife-Pleat Midi Skirt',
    house: 'Studio Vela',
    category: 'Skirt',
    price: 840,
    image: '/garments/pleated-skirt.png',
    colour: 'Warm Sand',
    swatch: '#CDBDA0',
    family: 'warm-neutral',
    ease: 6,
    lengthCm: 88,
    fit: { h: 58, y: 9 },
    stylistNote:
      'Heat-set pleats that move a half-beat behind you. Pair with the roll-neck for a monochrome sand column.',
    fitNote: 'Sits at the natural waist — measure the smallest point, not the hip.',
    fabric: {
      composition: '68% triacetate · 32% polyester crepe',
      weight: 'Light · 140 g/m²',
      hand: 'Dry, papery, springs back',
      care: 'Machine cool · never press pleats flat',
      drape: 84,
      stretch: 18,
      breathability: 58,
      sheen: 34,
      structure: 56,
    },
    bundle: [
      { name: 'Grosgrain waist ribbon', price: 85 },
      { name: 'Pleat travel sleeve', price: 130 },
    ],
    keywords: ['skirt', 'pleat', 'midi', 'day', 'lunch', 'sand', 'movement'],
  },
  {
    id: 'leather-jacket',
    name: 'Nappa Cropped Jacket',
    house: 'Studio Vela',
    category: 'Outerwear',
    price: 2150,
    image: '/garments/leather-jacket.png',
    colour: 'Espresso',
    swatch: '#4A3527',
    family: 'deep-neutral',
    ease: 5,
    lengthCm: 54,
    fit: { h: 40, y: -24 },
    stylistNote:
      'Vegetable-tanned nappa that will map to your posture within a season. Crop it over the pleated midi for waist lift.',
    fitNote: 'Leather relaxes but never grows in the shoulder — trust the shoulder seam.',
    fabric: {
      composition: '100% lamb nappa leather',
      weight: '0.7 mm · supple',
      hand: 'Buttery, faint grain, warms fast',
      care: 'Specialist clean · condition twice yearly',
      drape: 62,
      stretch: 30,
      breathability: 34,
      sheen: 44,
      structure: 74,
    },
    bundle: [
      { name: 'Leather balm ritual set', price: 180 },
      { name: 'Padded shoulder hanger', price: 70 },
    ],
    keywords: ['leather', 'jacket', 'evening', 'city', 'edge', 'brown', 'crop'],
  },
]

export const garmentById = (id: string | null) =>
  (id ? GARMENTS.find((g) => g.id === id) : undefined) ?? undefined

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

/* ---------------------------------- sizing --------------------------------- */

export type FitPreference = 'Sculpted' | 'True' | 'Relaxed'

export type SizeProfile = {
  heightCm: number
  bustCm: number
  waistCm: number
  hipCm: number
  preference: FitPreference
}

export type SizeVerdict = {
  size: string
  alternate: string
  confidence: number
  lines: string[]
}

const BANDS: { size: string; bust: number }[] = [
  { size: 'XS', bust: 82 },
  { size: 'S', bust: 87 },
  { size: 'M', bust: 92 },
  { size: 'L', bust: 98 },
  { size: 'XL', bust: 105 },
]

const PREFERENCE_SHIFT: Record<FitPreference, number> = {
  Sculpted: -2.5,
  True: 0,
  Relaxed: 3,
}

export function predictSize(profile: SizeProfile, garment: Garment): SizeVerdict {
  const effective =
    profile.bustCm + PREFERENCE_SHIFT[profile.preference] - (garment.ease - 6) * 0.35

  const ranked = [...BANDS].sort(
    (a, b) => Math.abs(a.bust - effective) - Math.abs(b.bust - effective),
  )
  const best = ranked[0]
  const second = ranked[1]

  const delta = Math.abs(best.bust - effective)
  const stretchGrace = garment.fabric.stretch / 100
  const confidence = Math.round(
    Math.min(98, Math.max(62, 97 - delta * 4.5 + stretchGrace * 6)),
  )

  const dropRatio = profile.hipCm - profile.waistCm
  const lines: string[] = []

  lines.push(
    `${garment.name} in ${best.size} sits with ${(
      best.bust + garment.ease - profile.bustCm
    ).toFixed(1)} cm of ease through the chest.`,
  )

  if (dropRatio >= 26) {
    lines.push('Pronounced hip curve — expect a close read at the seat; the seam allowance permits a half-size let-out.')
  } else if (dropRatio <= 16) {
    lines.push('Straight waist-to-hip line — the garment will fall clean without hip pull.')
  } else {
    lines.push('Balanced waist-to-hip ratio — no adjustment anticipated.')
  }

  if (garment.fabric.stretch < 25) {
    lines.push('Low-recovery cloth: we advise the larger option if you are between bands.')
  } else {
    lines.push(`Recovery at ${garment.fabric.stretch}% means ${best.size} will hold its line through the day.`)
  }

  const hem = Math.round(garment.lengthCm * (profile.heightCm / 170))
  lines.push(`Predicted hem drop on your frame: ${hem} cm — ${hem > 110 ? 'floor-grazing' : hem > 80 ? 'mid-calf' : 'above knee'}.`)

  return { size: best.size, alternate: second.size, confidence, lines }
}

/* ------------------------------ recommendation ----------------------------- */

export type Match = {
  garment: Garment
  score: number
  reason: string
}

export function styleMatches(garment: Garment, limit = 3): Match[] {
  return GARMENTS.filter((g) => g.id !== garment.id)
    .map((g) => {
      let score = 52
      let reason = 'A considered counterpoint in the same neutral register.'

      if (g.family === garment.family) {
        score += 18
        reason = `Tonal continuity — ${g.colour.toLowerCase()} sits beside ${garment.colour.toLowerCase()} without a break.`
      } else {
        score += 9
        reason = `Deliberate contrast — ${g.colour.toLowerCase()} grounds the ${garment.colour.toLowerCase()}.`
      }

      if (g.category !== garment.category) score += 14
      if (
        (garment.category === 'Dress' && g.category === 'Outerwear') ||
        (garment.category === 'Knitwear' && g.category === 'Skirt') ||
        (garment.category === 'Skirt' && g.category === 'Outerwear') ||
        (garment.category === 'Tailoring' && g.category === 'Dress')
      ) {
        score += 12
        reason = `Layering pair — ${g.category.toLowerCase()} over ${garment.category.toLowerCase()} is the house silhouette.`
      }

      const structureGap = Math.abs(g.fabric.structure - garment.fabric.structure)
      if (structureGap > 30) {
        score += 8
        reason += ' Structure against fluidity keeps the proportion alive.'
      }

      return { garment: g, score: Math.min(98, score), reason }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function fabricVerdict(garment: Garment): string[] {
  const f = garment.fabric
  const out: string[] = []
  out.push(
    f.drape > 80
      ? 'Tactile read: fluid, high-drape cloth that follows the body rather than framing it.'
      : f.structure > 80
        ? 'Tactile read: structured cloth with standing memory — it builds silhouette on its own.'
        : 'Tactile read: balanced cloth, softly structured with a gentle fall.',
  )
  out.push(
    f.breathability > 70
      ? `Breathability at ${f.breathability}% — comfortable across seasons and indoor heat.`
      : `Breathability at ${f.breathability}% — best in cool air or short wear.`,
  )
  out.push(
    f.sheen > 60
      ? 'Surface returns light; expect a lit, evening-facing finish under warm lamps.'
      : 'Matte surface absorbs light — quiet and daylight-honest on camera.',
  )
  out.push(`Care: ${f.care.toLowerCase()}.`)
  return out
}

/* -------------------------------- stylist --------------------------------- */

export type StylistReply = {
  text: string
  garment?: Garment
}

const OCCASION_HINTS: { test: RegExp; ids: string[]; lead: string }[] = [
  { test: /(work|office|meeting|interview|boardroom|business)/i, ids: ['tailored-blazer', 'pleated-skirt'], lead: 'For the working day I would lead with tailoring.' },
  { test: /(dinner|evening|party|gala|date|wedding|cocktail)/i, ids: ['slip-dress', 'leather-jacket'], lead: 'For evening, silk first — then something with a harder edge over it.' },
  { test: /(cold|winter|snow|travel|rain|warm)/i, ids: ['wool-trench', 'cashmere-knit'], lead: 'For weather, we build outward from cashmere.' },
  { test: /(weekend|casual|relax|day|lunch|brunch)/i, ids: ['cashmere-knit', 'pleated-skirt'], lead: 'For an unhurried day, softness with a little movement.' },
  { test: /(black|dark|monochrome)/i, ids: ['tailored-blazer', 'leather-jacket'], lead: 'Staying in the deep neutrals.' },
  { test: /(beige|neutral|cream|ivory|camel|sand)/i, ids: ['wool-trench', 'pleated-skirt'], lead: 'Warm neutrals, tonally layered.' },
]

export function stylistReply(input: string, current?: Garment): StylistReply {
  const query = input.trim()
  if (!query) {
    return {
      text: 'Tell me the occasion, the weather, or a colour you are drawn to and I will pull the piece.',
    }
  }

  const direct = GARMENTS.find((g) =>
    g.keywords.some((k) => query.toLowerCase().includes(k)) ||
    query.toLowerCase().includes(g.name.toLowerCase()),
  )

  const hint = OCCASION_HINTS.find((h) => h.test.test(query))
  const chosen =
    direct ??
    (hint ? GARMENTS.find((g) => hint.ids.includes(g.id)) : undefined) ??
    (current ? styleMatches(current, 1)[0]?.garment : GARMENTS[0])

  if (!chosen) {
    return { text: 'I did not catch that. Try naming an occasion — dinner, the office, cold weather.' }
  }

  const lead = hint ? hint.lead : 'Here is what I would put on you.'
  return {
    text: `${lead} The ${chosen.name} in ${chosen.colour}. ${chosen.stylistNote}`,
    garment: chosen,
  }
}
