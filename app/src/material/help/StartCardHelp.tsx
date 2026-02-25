/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MaterialHelpProps } from '@gamepark/react-game'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'
import { getStartCardMushrooms } from '@gamepark/amanite/material/StartCard'
import {
  helpContainerCss, helpHeaderCss, helpTitleCss, helpBodyCss,
  helpDescCss, helpInfoPanelCss, helpLabelCss,
  MushroomDot
} from './HelpUtils'

const playerColors: Record<number, string> = {
  [PlayerAnimal.Fox]: '#D4722A',
  [PlayerAnimal.Squirrel]: '#B84032',
  [PlayerAnimal.Owl]: '#7B7D7E',
  [PlayerAnimal.Jay]: '#3B7BB5'
}

export const StartCardHelp: FC<MaterialHelpProps> = ({ item }) => {
  const { t } = useTranslation()
  const animal = item.id as PlayerAnimal
  const hex = playerColors[animal] ?? '#888'
  const side = item.location?.rotation ?? 0
  const mushrooms = getStartCardMushrooms(animal, side)

  return (
    <div css={helpContainerCss}>
      <div css={[helpHeaderCss, css`background: linear-gradient(135deg, ${hex} 0%, ${hex}cc 100%);`]}>
        <span css={helpTitleCss}>{t('help.start.card')}</span>
      </div>
      <div css={helpBodyCss}>
        <p css={helpDescCss}>{t('help.start.card.desc')}</p>
        <div css={helpInfoPanelCss}>
          <span css={helpLabelCss}>{t('help.start.card.clues')}</span>
          <div css={css`display: flex; gap: 0.5em; align-items: center; margin-top: 0.3em;`}>
            {mushrooms.map((c, i) => (
              <span key={i} css={css`display: inline-flex; align-items: center; gap: 0.2em;`}>
                <MushroomDot color={c} />
                <span css={css`font-size: 0.85em;`}>{t(`mushroom.${c}`)}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
