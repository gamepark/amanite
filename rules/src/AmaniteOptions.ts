import { OptionsSpec } from '@gamepark/rules-api'

export type AmaniteOptions = {
  players: {}[]
  beginner: boolean
}

export const AmaniteOptionsSpec: OptionsSpec<AmaniteOptions> = {
  players: {},
  beginner: {
    label: (t) => t('option.beginner'),
    help: (t) => t('option.beginner.help'),
    competitiveDisabled: true
  }
}
