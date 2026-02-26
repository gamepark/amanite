/** @jsxImportSource @emotion/react */
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MaterialHelpProps } from '@gamepark/react-game'
import { ValueType } from '@gamepark/amanite/material/ValueType'
import {
  helpContainerCss, helpHeaderCss, helpTitleCss, helpBodyCss,
  helpDescCss
} from './HelpUtils'
import { ValueScoringDisplay } from './ValueScoringDisplay'

function getValueName(value: ValueType): string {
  switch (value) {
    case ValueType.Minus1: return 'value.minus1'
    case ValueType.Value1: return 'value.1'
    case ValueType.Value2: return 'value.2'
    case ValueType.Value3: return 'value.3'
    case ValueType.Antidote: return 'value.antidote'
    case ValueType.Poison: return 'value.poison'
    case ValueType.Potion: return 'value.potion'
    case ValueType.MushroomLimit: return 'value.limit'
    case ValueType.MushroomMajority: return 'value.majority'
    case ValueType.MushroomPair: return 'value.pair'
    default: return 'value.unknown'
  }
}

export const ValueCardHelp: FC<MaterialHelpProps> = ({ item }) => {
  const { t } = useTranslation()
  const value = item.id as ValueType

  return (
    <div css={helpContainerCss}>
      <div css={helpHeaderCss}>
        <span css={helpTitleCss}>{t(getValueName(value))}</span>
      </div>
      <div css={helpBodyCss}>
        <p css={helpDescCss}>{t('help.value.card.desc')}</p>
        <ValueScoringDisplay value={value} />
      </div>
    </div>
  )
}
