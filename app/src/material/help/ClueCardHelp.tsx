/** @jsxImportSource @emotion/react */
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MaterialHelpProps } from '@gamepark/react-game'
import {
  helpContainerCss, helpHeaderCss, helpTitleCss, helpBodyCss,
  helpDescCss, helpInfoPanelCss
} from './HelpUtils'

export const ClueCardHelp: FC<MaterialHelpProps> = () => {
  const { t } = useTranslation()
  return (
    <div css={helpContainerCss}>
      <div css={helpHeaderCss}>
        <span>&#128269;</span>
        <span css={helpTitleCss}>{t('help.clue.card')}</span>
      </div>
      <div css={helpBodyCss}>
        <p css={helpDescCss}>{t('help.clue.card.desc')}</p>
        <div css={helpInfoPanelCss}>
          {t('help.clue.card.secret')}
        </div>
      </div>
    </div>
  )
}
