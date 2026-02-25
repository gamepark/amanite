/** @jsxImportSource @emotion/react */
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MaterialHelpProps } from '@gamepark/react-game'
import {
  helpContainerCss, helpHeaderCss, helpTitleCss, helpBodyCss,
  helpDescCss, helpInfoPanelCss
} from './HelpUtils'

export const FirstPlayerTokenHelp: FC<MaterialHelpProps> = () => {
  const { t } = useTranslation()
  return (
    <div css={helpContainerCss}>
      <div css={helpHeaderCss}>
        <span css={helpTitleCss}>{t('help.first.player')}</span>
      </div>
      <div css={helpBodyCss}>
        <p css={helpDescCss}>{t('help.first.player.desc')}</p>
        <div css={helpInfoPanelCss}>
          {t('help.first.player.rotation')}
        </div>
      </div>
    </div>
  )
}
