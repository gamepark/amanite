/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MaterialHelpProps } from '@gamepark/react-game'
import { isPig } from '@gamepark/amanite/material/RoundTokenId'
import {
  helpContainerCss, helpHeaderCss, helpTitleCss, helpBodyCss,
  helpDescCss, mushroomHexColors, MushroomDot
} from './HelpUtils'

export const RoundTokenHelp: FC<MaterialHelpProps> = ({ item }) => {
  const { t } = useTranslation()
  const pig = isPig(item.id)
  const color = item.id as number

  if (pig) {
    return (
      <div css={helpContainerCss}>
        <div css={[helpHeaderCss, css`background: linear-gradient(135deg, #c44a2a 0%, #a03520 100%);`]}>
          <span>&#128055;</span>
          <span css={helpTitleCss}>{t('help.pig.token')}</span>
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
      </div>
      <div css={helpBodyCss}>
        <p css={helpDescCss}>{t('help.mushroom.token.desc')}</p>
      </div>
    </div>
  )
}
