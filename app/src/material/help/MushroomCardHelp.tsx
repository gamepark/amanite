/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MaterialHelpProps } from '@gamepark/react-game'
import { MushroomColor } from '@gamepark/amanite/material/MushroomColor'
import {
  helpContainerCss, helpHeaderCss, helpTitleCss, helpBodyCss,
  helpDescCss, helpInfoPanelCss,
  mushroomHexColors, MushroomDot
} from './HelpUtils'

export const MushroomCardHelp: FC<MaterialHelpProps> = ({ item }) => {
  const { t } = useTranslation()
  const color = item.id as MushroomColor
  const hex = mushroomHexColors[color] ?? '#888'

  return (
    <div css={helpContainerCss}>
      <div css={[helpHeaderCss, css`
        background: linear-gradient(135deg, ${hex} 0%, ${hex}cc 100%);
        color: ${color <= 4 ? '#f0e8c8' : '#1a1a3a'};
      `]}>
        <MushroomDot color={color} />
        <span css={helpTitleCss}>{t(`mushroom.${color}`)}</span>
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
