/** @jsxImportSource @emotion/react */
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MaterialHelpProps } from '@gamepark/react-game'
import {
  helpContainerCss, helpHeaderCss, helpTitleCss, helpBodyCss,
  helpDescCss, helpInfoPanelCss
} from './HelpUtils'

export const NotebookTokenHelp: FC<MaterialHelpProps> = () => {
  const { t } = useTranslation()
  return (
    <div css={helpContainerCss}>
      <div css={helpHeaderCss}>
        <span>&#128214;</span>
        <span css={helpTitleCss}>{t('help.notebook.token')}</span>
      </div>
      <div css={helpBodyCss}>
        <p css={helpDescCss}>{t('help.notebook.token.desc')}</p>
        <div css={helpInfoPanelCss}>
          {t('help.notebook.token.clue')}
        </div>
      </div>
    </div>
  )
}
