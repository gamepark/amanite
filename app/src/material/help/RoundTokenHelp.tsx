/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MaterialHelpProps, PlayMoveButton, useLegalMoves } from '@gamepark/react-game'
import { isMoveItemType, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { LotZone } from '@gamepark/amanite/material/LotZone'
import { isPig } from '@gamepark/amanite/material/RoundTokenId'
import {
  helpContainerCss, helpHeaderCss, helpTitleCss, helpBodyCss,
  helpDescCss, helpHeaderBtnCss, mushroomHexColors, MushroomDot
} from './HelpUtils'

const isTokenMove = (move: MaterialMove): move is MoveItem =>
  isMoveItemType(MaterialType.RoundToken)(move as any)

export const RoundTokenHelp: FC<MaterialHelpProps> = ({ item, itemIndex, closeDialog }) => {
  const { t } = useTranslation()
  const pig = isPig(item.id)
  const color = item.id as number

  const moveDown = useLegalMoves<MoveItem>(move =>
    isTokenMove(move) && move.itemIndex === itemIndex
    && move.location.type === LocationType.ForestTileTokens && move.location.id === LotZone.Bottom
  )
  const moveUp = useLegalMoves<MoveItem>(move =>
    isTokenMove(move) && move.itemIndex === itemIndex
    && move.location.type === LocationType.ForestTileTokens && move.location.id === LotZone.Top
  )
  const takeMove = useLegalMoves<MoveItem>(move =>
    isTokenMove(move) && move.itemIndex === itemIndex
    && move.location.type === LocationType.PlayerTokens
  )
  const discardMove = useLegalMoves<MoveItem>(move =>
    isTokenMove(move) && move.itemIndex === itemIndex
    && move.location.type === LocationType.TokenDiscard
  )

  const allMoves = [...moveDown, ...moveUp, ...takeMove, ...discardMove]
  const moveLabels = [
    ...moveDown.map(m => ({ move: m, label: t('button.move.down') })),
    ...moveUp.map(m => ({ move: m, label: t('button.move.up') })),
    ...takeMove.map(m => ({ move: m, label: t('button.take.token') })),
    ...discardMove.map(m => ({ move: m, label: t('button.discard.token') }))
  ]

  if (pig) {
    return (
      <div css={helpContainerCss}>
        <div css={[helpHeaderCss, css`background: linear-gradient(135deg, #c44a2a 0%, #a03520 100%);`]}>
          <span>&#128055;</span>
          <span css={helpTitleCss}>{t('help.pig.token')}</span>
          {allMoves.length > 0 && moveLabels.map(({ move, label }, i) => (
            <PlayMoveButton key={i} move={move} onPlay={closeDialog} css={helpHeaderBtnCss}>
              {label}
            </PlayMoveButton>
          ))}
        </div>
        <div css={helpBodyCss}>
          <p css={helpDescCss}>{t('help.pig.token.desc')}</p>
        </div>
      </div>
    )
  }

  const hex = mushroomHexColors[color] ?? '#888'
  return (
    <div css={helpContainerCss}>
      <div css={[helpHeaderCss, css`
        background: linear-gradient(135deg, ${hex} 0%, ${hex}cc 100%);
        color: ${color <= 4 ? '#f0e8c8' : '#1a1a3a'};
      `]}>
        <MushroomDot color={color} />
        <span css={helpTitleCss}>{t(`mushroom.${color}`)}</span>
        {allMoves.length > 0 && moveLabels.map(({ move, label }, i) => (
          <PlayMoveButton key={i} move={move} onPlay={closeDialog} css={helpHeaderBtnCss}>
            {label}
          </PlayMoveButton>
        ))}
      </div>
      <div css={helpBodyCss}>
        <p css={helpDescCss}>{t('help.mushroom.token.desc')}</p>
      </div>
    </div>
  )
}

