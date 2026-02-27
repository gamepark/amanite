import { getEnumValues, OptionsSpec } from '@gamepark/rules-api'
import { PlayerAnimal } from './PlayerAnimal'

type PlayerOptions = { id: PlayerAnimal }

export type AmaniteOptions = {
  players: PlayerOptions[]
  beginner: boolean
}

export const AmaniteOptionsSpec: OptionsSpec<AmaniteOptions> = {
  players: {
    id: {
      label: (t) => t('player.id'),
      values: getEnumValues(PlayerAnimal),
      valueSpec: (id) => ({ label: (t) => t(`player.${id}`) })
    }
  },
  beginner: {
    label: (t) => t('option.beginner'),
    help: (t) => t('option.beginner.help'),
    competitiveDisabled: true
  }
}
