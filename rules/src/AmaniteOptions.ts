import { OptionsSpec } from '@gamepark/rules-api'

export type AmaniteOptions = {
  players: number
  beginner: boolean
}

export const AmaniteOptionsSpec: OptionsSpec<AmaniteOptions> = {
  beginner: {
    label: (t) => t('option.beginner'),
    help: (t) => t('option.beginner.help'),
    competitiveDisabled: true
  }
}
