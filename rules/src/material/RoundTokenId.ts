import { MushroomColor } from './MushroomColor'

/** Round tokens: 6 mushroom colors + pig */
export const Pig = 7 as const

export type RoundTokenId = MushroomColor | typeof Pig

export function isPig(id: any): boolean {
  return id === Pig
}

export function isMushroomToken(id: any): boolean {
  return typeof id === 'number' && id !== Pig && id >= 1 && id <= 6
}

/** 10 tokens per mushroom color + 4 pigs = 64 total */
export const MUSHROOM_TOKENS_PER_COLOR = 10
export const PIG_TOKEN_COUNT = 4
export const TOTAL_TOKEN_COUNT = MUSHROOM_TOKENS_PER_COLOR * 6 + PIG_TOKEN_COUNT

/** Tokens per forest tile per round */
export const TOKENS_PER_TILE_PER_ROUND: Record<number, number> = {
  1: 4,
  2: 5,
  3: 6
}
