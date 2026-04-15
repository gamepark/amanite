import { css } from '@emotion/react'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'

const playerLogColors: Record<number, { accent: string, bg: string, name: string }> = {
  [PlayerAnimal.Fox]: { accent: '#A8C46A', bg: 'rgba(168,196,106,0.15)', name: '#7A9A40' },
  [PlayerAnimal.Squirrel]: { accent: '#D4722A', bg: 'rgba(230,160,50,0.15)', name: '#b05510' },
  [PlayerAnimal.Owl]: { accent: '#2A2A2A', bg: 'rgba(42,42,42,0.12)', name: '#1A1A1A' },
  [PlayerAnimal.Jay]: { accent: '#8B6040', bg: 'rgba(139,96,64,0.15)', name: '#6B4830' }
}

const fallback = { accent: '#888', bg: 'rgba(85,85,85,0.06)', name: '#555' }

export const getPlayerColor = (player?: number) =>
  (player ? playerLogColors[player] ?? fallback : fallback).name

export const logCss = (player?: number) => {
  const c = player ? playerLogColors[player] ?? fallback : fallback
  return css`
    background: ${c.bg};
    border-left: 4px solid ${c.accent};
    border-radius: 0 0.3em 0.3em 0;
    color: #2a2a3e;
    margin: 0.4em 0;
    padding: 0.4em 0.6em;
    align-items: center;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  `
}

export const depthLogCss = css`
  background: rgba(240, 232, 200, 0.35);
  border-left: 3px solid rgba(200, 191, 160, 0.5);
  border-radius: 0 0.3em 0.3em 0;
  color: #4a4a5e;
  margin: 0.15em 0;
  padding: 0.35em 0.5em;
  align-items: center;
`

export const gameOverCss = css`
  background: none !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0.3em 0.6em;
  margin: 0.5em 0;
  width: 100%;
  max-width: 100%;
  display: block;
  & > * {
    width: 100%;
  }
`

export const systemLogCss = css`
  background: linear-gradient(135deg, #f0e8c8 0%, #e8deb8 100%);
  border-left: 4px solid #2d2d7a;
  border-radius: 0 0.3em 0.3em 0;
  padding: 0.4em 0.6em;
  font-style: italic;
  color: #2d2d7a;
  margin: 0.6em 0;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
`

export const separatorCss = css`
  display: flex;
  align-items: center;
  background: none !important;
  color: #5a6e4a;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 0.25em 0.5em;
  margin: 0.6em 0 0.15em;
  white-space: nowrap;
  box-shadow: none;
  border: none;

  &::before, &::after {
    content: '';
    flex: 1;
    border-top: 1px solid rgba(90, 110, 62, 0.35);
  }
  &::before {
    margin-right: 0.6em;
  }
  &::after {
    margin-left: 0.6em;
  }
`