/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MaterialHelpProps } from '@gamepark/react-game'
import {
  helpContainerCss, helpHeaderCss, helpTitleCss, helpBodyCss,
  helpDescCss, helpInfoPanelCss, helpWarningPanelCss
} from './HelpUtils'

export const ForestTileHelp: FC<MaterialHelpProps> = () => {
  const { t } = useTranslation()
  return (
    <div css={helpContainerCss}>
      <div css={[helpHeaderCss, css`background: linear-gradient(135deg, #2a6e2a 0%, #1e5a1e 100%);`]}>
        <span css={helpTitleCss}>{t('help.forest.tile')}</span>
      </div>
      <div css={helpBodyCss}>
        <p css={helpDescCss}>{t('help.forest.tile.desc')}</p>
        <div css={helpInfoPanelCss}>
          {t('help.forest.tile.meeple')}
        </div>
        <div css={helpWarningPanelCss}>
          {t('help.forest.tile.split')}
        </div>
      </div>
    </div>
  )
}
