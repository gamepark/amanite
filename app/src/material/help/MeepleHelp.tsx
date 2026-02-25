/** @jsxImportSource @emotion/react */
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MaterialHelpProps } from '@gamepark/react-game'
import {
  helpContainerCss, helpHeaderCss, helpTitleCss, helpBodyCss,
  helpDescCss, helpInfoPanelCss, helpWarningPanelCss
} from './HelpUtils'

export const MeepleHelp: FC<MaterialHelpProps> = () => {
  const { t } = useTranslation()
  return (
    <div css={helpContainerCss}>
      <div css={helpHeaderCss}>
        <span css={helpTitleCss}>{t('help.meeple')}</span>
      </div>
      <div css={helpBodyCss}>
        <p css={helpDescCss}>{t('help.meeple.desc')}</p>
        <div css={helpInfoPanelCss}>
          {t('help.meeple.alone')}
        </div>
        <div css={helpWarningPanelCss}>
          {t('help.meeple.split')}
        </div>
      </div>
    </div>
  )
}
