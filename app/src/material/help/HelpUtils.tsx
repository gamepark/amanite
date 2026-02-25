/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC, HTMLAttributes } from 'react'

// ─── Color Palette (matched to game art) ────────────────────────
// The game art uses dark indigo/navy as THE dominant color
// and cream/pale yellow for card backgrounds
const indigo = '#2d2d7a'
const indigoLight = '#4a4a9a'
const cream = '#f0e8c8'

export const mushroomHexColors: Record<number, string> = {
  1: '#38B0E0', // Blue - cyan vif (token outer ring)
  2: '#2D7A3E', // Green - vert forêt profond
  3: '#CC5A9E', // Purple - rose/magenta
  4: '#E63E2D', // Red - rouge-orangé vif
  5: '#EEEAE4', // White - blanc cassé
  6: '#E8B830'  // Yellow - or chaud
}

export const mushroomColorNames: Record<number, string> = {
  1: 'Blue', 2: 'Green', 3: 'Purple', 4: 'Red', 5: 'White', 6: 'Yellow'
}

// ─── Container ───────────────────────────────────────────────────
export const helpContainerCss = css`
  padding: 0;
  width: 100%;
  background: ${cream};
  border-radius: 8px;
  overflow: hidden;
  color: #1a1a2e;
  line-height: 1.5;
  font-size: 1em;
`

// ─── Header Bar ──────────────────────────────────────────────────
export const helpHeaderCss = css`
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.6em 0.8em;
  background: ${indigo};
  color: ${cream};
  font-size: 1em;
  font-weight: 700;
`

export const helpTitleCss = css`
  flex: 1;
  font-size: 1em;
`

// ─── Body ────────────────────────────────────────────────────────
export const helpBodyCss = css`
  padding: 0.6em 0.8em;
`

// ─── Description Text ────────────────────────────────────────────
export const helpDescCss = css`
  margin: 0 0 0.5em;
  color: #2a2a4a;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`

// ─── Info Panel (indigo-tinted, matches game's navy motif) ──────
export const helpInfoPanelCss = css`
  margin: 0.5em 0;
  padding: 0.5em 0.6em;
  background: ${indigo}15;
  border-left: 3px solid ${indigoLight};
  border-radius: 0 4px 4px 0;
  color: #1a1a3a;
  line-height: 1.45;
`

// ─── Warning/Important Panel (warm, matches cream cards) ────────
export const helpWarningPanelCss = css`
  margin: 0.5em 0;
  padding: 0.5em 0.6em;
  background: #e8624422;
  border-left: 3px solid #c44a2a;
  border-radius: 0 4px 4px 0;
  color: #3a1a10;
  line-height: 1.45;
`

// ─── Scoring Panel (indigo accent) ──────────────────────────────
export const helpScoringPanelCss = css`
  margin: 0.5em 0;
  padding: 0.5em 0.6em;
  background: ${indigo}18;
  border-left: 3px solid ${indigo};
  border-radius: 0 4px 4px 0;
  color: #1a1a3a;
  line-height: 1.45;
`

// ─── Divider Ornament ────────────────────────────────────────────
export const helpDividerCss = css`
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin: 0.6em 0;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${indigo}30, transparent);
  }
`

// ─── Mushroom Cap Indicator ──────────────────────────────────────
export const MushroomDot: FC<{ color: number } & Omit<HTMLAttributes<HTMLSpanElement>, 'color'>> = ({ color, ...props }) => (
  <span
    css={css`
      display: inline-block;
      width: 1.1em;
      height: 0.9em;
      border-radius: 50% 50% 35% 35%;
      background: radial-gradient(ellipse at 40% 30%, ${lighten(mushroomHexColors[color] ?? '#888')}, ${mushroomHexColors[color] ?? '#888'});
      box-shadow: inset 0 -2px 3px rgba(0,0,0,0.25);
      vertical-align: -0.1em;
      margin: 0 0.1em;
      border: 1.5px solid ${indigo}60;
    `}
    {...props}
  />
)

// ─── Mushroom Row (3 dots with label) ────────────────────────────
export const MushroomRow: FC<{ colors: number[], t: (key: string) => string }> = ({ colors, t }) => (
  <span css={css`display: inline-flex; align-items: center; gap: 0.25em;`}>
    {colors.map((c, i) => (
      <span key={i} css={css`display: inline-flex; align-items: center; gap: 0.15em;`}>
        <MushroomDot color={c} />
        <span css={css`font-size: 0.8em; color: ${indigo};`}>{t(`mushroom.${c}`)}</span>
        {i < colors.length - 1 && <span css={css`opacity: 0.35; margin: 0 0.1em;`}>&middot;</span>}
      </span>
    ))}
  </span>
)

// ─── Section Label ───────────────────────────────────────────────
export const helpLabelCss = css`
  display: block;
  font-size: 0.8em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${indigoLight};
  margin-bottom: 0.3em;
`

// ─── Utilities ───────────────────────────────────────────────────
function lighten(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)})`
}
