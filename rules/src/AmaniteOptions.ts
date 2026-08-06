import { getEnumValues, OptionsSpecV2 } from '@gamepark/rules-api'
import { PlayerAnimal } from './PlayerAnimal'

type PlayerOptions = { id: PlayerAnimal }

export type AmaniteOptions = {
  players: PlayerOptions[]
  beginner: boolean
}

/**
 * The option space of amanite: structure only.
 *
 * Labels live in the game's presentation document, published beside its translations at
 * `/options/<locale>.json` and keyed by convention. Subscription and competitive gates live in
 * the platform database, so they can change without releasing the game again.
 *
 * That is where the competitive settings went.
 */
export const AmaniteOptionsSpecV2: OptionsSpecV2 = {
  specVersion: 2,
  players: { min: 2, max: 4 },
  identities: { values: getEnumValues(PlayerAnimal) },
  options: {
    beginner: { kind: 'boolean' }
  }
}
