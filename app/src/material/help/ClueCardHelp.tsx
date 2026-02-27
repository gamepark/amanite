/** @jsxImportSource @emotion/react */
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MaterialHelpProps, PlayMoveButton, useLegalMoves } from '@gamepark/react-game'
import { isMoveItemType, MoveItem } from '@gamepark/rules-api'
import { ValueType } from '@gamepark/amanite/material/ValueType'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import {
  helpContainerCss, helpHeaderCss, helpTitleCss, helpBodyCss,
  helpDescCss, helpHeaderBtnCss
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

export const ClueCardHelp: FC<MaterialHelpProps> = ({ item, closeDialog }) => {
  const { t } = useTranslation()
  const value = item.id as ValueType | undefined
  const mushroomIndex = item.location?.parent

  const notebookMoves = useLegalMoves<MoveItem>(move =>
    isMoveItemType(MaterialType.NotebookToken)(move as any)
    && move.location.type === LocationType.NotebookSlot
    && move.location.id === mushroomIndex
  )

  const investigateBtn = mushroomIndex !== undefined && notebookMoves.length > 0 && (
    <PlayMoveButton move={notebookMoves[0]} onPlay={closeDialog} css={helpHeaderBtnCss}>
      {t('button.place.notebook')}
    </PlayMoveButton>
  )

  if (!value) {
    return (
      <div css={helpContainerCss}>
        <div css={helpHeaderCss}>
          <span>{'\u{1F50D}'}</span>
          <span css={helpTitleCss}>{t('help.clue.card')}</span>
          {investigateBtn}
        </div>
        <div css={helpBodyCss}>
          <p css={helpDescCss}>{t('help.clue.card.desc')}</p>
        </div>
      </div>
    )
  }

  return (
    <div css={helpContainerCss}>
      <div css={helpHeaderCss}>
        <span>{'\u{1F50D}'}</span>
        <span css={helpTitleCss}>{t('help.clue.card')} — {t(getValueName(value))}</span>
        {investigateBtn}
      </div>
      <div css={helpBodyCss}>
        <p css={helpDescCss}>{t('help.clue.card.value.desc')}</p>
        <ValueScoringDisplay value={value} />
      </div>
    </div>
  )
}

