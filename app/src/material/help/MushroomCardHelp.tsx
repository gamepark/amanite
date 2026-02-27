/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MaterialHelpProps, PlayMoveButton, useLegalMoves } from '@gamepark/react-game'
import { isMoveItemType, MoveItem } from '@gamepark/rules-api'
import { MushroomColor } from '@gamepark/amanite/material/MushroomColor'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import {
  helpContainerCss, helpHeaderCss, helpTitleCss, helpBodyCss,
  helpDescCss, helpInfoPanelCss, helpHeaderBtnCss,
  mushroomHexColors, MushroomDot
} from './HelpUtils'

export const MushroomCardHelp: FC<MaterialHelpProps> = ({ item, itemIndex, closeDialog }) => {
  const { t } = useTranslation()
  const color = item.id as MushroomColor
  const hex = mushroomHexColors[color] ?? '#888'

  const notebookMoves = useLegalMoves<MoveItem>(move =>
    isMoveItemType(MaterialType.NotebookToken)(move as any)
    && move.location.type === LocationType.NotebookSlot
    && move.location.id === itemIndex
  )

  return (
    <div css={helpContainerCss}>
      <div css={[helpHeaderCss, css`
        background: linear-gradient(135deg, ${hex} 0%, ${hex}cc 100%);
        color: ${color <= 4 ? '#f0e8c8' : '#1a1a3a'};
      `]}>
        <MushroomDot color={color} />
        <span css={helpTitleCss}>{t(`mushroom.${color}`)}</span>
        {notebookMoves.length > 0 && (
          <PlayMoveButton move={notebookMoves[0]} onPlay={closeDialog} css={helpHeaderBtnCss}>
            {t('button.place.notebook')}
          </PlayMoveButton>
        )}
      </div>
      <div css={helpBodyCss}>
        <p css={helpDescCss}>{t('help.mushroom.card.desc')}</p>
        <div css={helpInfoPanelCss}>
          {t('help.mushroom.card.notebook')}
        </div>
      </div>
    </div>
  )
}

