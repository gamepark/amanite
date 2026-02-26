/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { Dialog, PlayMoveButton, useLegalMoves, usePlayerId, useRules } from '@gamepark/react-game'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'
import { isCustomMoveType } from '@gamepark/rules-api'
import { CustomMoveType } from '@gamepark/amanite/rules/CustomMoveType'
import { RuleId } from '@gamepark/amanite/rules/RuleId'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'
import { getStartCardMushrooms } from '@gamepark/amanite/material/StartCard'
import { useTranslation } from 'react-i18next'
import { MushroomDot, mushroomHexColors } from '../material/help/HelpUtils'
import FoxCard1 from '../images/cards/start/FoxCard1.jpg'
import FoxCard2 from '../images/cards/start/FoxCard2.jpg'
import SquirrelCard1 from '../images/cards/start/SquirrelCard1.jpg'
import SquirrelCard2 from '../images/cards/start/SquirrelCard2.jpg'
import OwlCard1 from '../images/cards/start/OwlCard1.jpg'
import OwlCard2 from '../images/cards/start/OwlCard2.jpg'
import JayCard1 from '../images/cards/start/JayCard1.jpg'
import JayCard2 from '../images/cards/start/JayCard2.jpg'

const cardImages: Record<number, [string, string]> = {
  [PlayerAnimal.Fox]: [FoxCard1, FoxCard2],
  [PlayerAnimal.Squirrel]: [SquirrelCard1, SquirrelCard2],
  [PlayerAnimal.Owl]: [OwlCard1, OwlCard2],
  [PlayerAnimal.Jay]: [JayCard1, JayCard2]
}

export const ChooseStartCardSideDialog = () => {
  const { t } = useTranslation()
  const player = usePlayerId<PlayerAnimal>()
  const rules = useRules<AmaniteRules>()
  const legalMoves = useLegalMoves()
  const [minimized, setMinimized] = useState(false)
  const [chosen, setChosen] = useState(false)
  const isActive = rules && player !== undefined
    && rules.game.rule?.id === RuleId.ChooseStartCardSide
    && rules.isTurnToPlay(player)

  useEffect(() => {
    if (isActive) setChosen(false)
  }, [isActive])

  if (!isActive || chosen) return null

  const side0Move = legalMoves.find(move => isCustomMoveType(CustomMoveType.Pass)(move) && move.data?.side === 0)
  const side1Move = legalMoves.find(move => isCustomMoveType(CustomMoveType.Pass)(move) && move.data?.side === 1)
  const side0Mushrooms = getStartCardMushrooms(player, 0)
  const side1Mushrooms = getStartCardMushrooms(player, 1)
  const images = cardImages[player]

  if (minimized) {
    return (
      <button css={reopenButtonCss} onClick={() => setMinimized(false)}>
        {t('dialog.start.title')}
      </button>
    )
  }

  return (
    <Dialog open={true} css={dialogCss}>
      <div css={dialogContentCss}>
        <button css={minimizeButtonCss} onClick={() => setMinimized(true)}>&minus;</button>
        <h2 css={dialogTitleCss}>{t('dialog.start.title')}</h2>
        <p css={dialogDescCss}>{t('dialog.start.desc')}</p>

        <div css={sidesRowCss}>
          <PlayMoveButton move={side0Move} css={sideCardCss} onPlay={() => setChosen(true)}>
            <img src={images[0]} alt="Side A" css={cardImageCss} />
            <div css={sideInfoCss}>
              <span css={sideTitleCss}>{t('button.side1')}</span>
              <div css={mushroomListCss}>
                {side0Mushrooms.map((c, i) => (
                  <span key={i} css={chipCss(c)}>
                    <MushroomDot color={c} />
                    <span>{t(`mushroom.${c}`)}</span>
                  </span>
                ))}
              </div>
            </div>
          </PlayMoveButton>

          <PlayMoveButton move={side1Move} css={sideCardCss} onPlay={() => setChosen(true)}>
            <img src={images[1]} alt="Side B" css={cardImageCss} />
            <div css={sideInfoCss}>
              <span css={sideTitleCss}>{t('button.side2')}</span>
              <div css={mushroomListCss}>
                {side1Mushrooms.map((c, i) => (
                  <span key={i} css={chipCss(c)}>
                    <MushroomDot color={c} />
                    <span>{t(`mushroom.${c}`)}</span>
                  </span>
                ))}
              </div>
            </div>
          </PlayMoveButton>
        </div>

        <p css={dialogHintCss}>{t('dialog.start.hint')}</p>
      </div>
    </Dialog>
  )
}

const dialogCss = css`
  font-size: 3vh;
`

const dialogContentCss = css`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8em;
  padding: 0.5em 1em;
`

const dialogTitleCss = css`
  margin: 0;
  font-size: 1.4em;
  font-weight: 700;
  color: #2d2d7a;
`

const dialogDescCss = css`
  margin: 0;
  font-size: 0.85em;
  color: #444;
  text-align: center;
  max-width: 40em;
  line-height: 1.4;
`

const sidesRowCss = css`
  display: flex;
  gap: 2em;
  align-items: stretch;
  flex-wrap: wrap;
  justify-content: center;
`

const sideCardCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6em;
  padding: 0.8em;
  border-radius: 0.6em;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #2d2d7a;
    box-shadow: 0 0 16px rgba(45, 45, 122, 0.3);
  }
`

const cardImageCss = css`
  width: 22em;
  height: auto;
  border-radius: 0.5em;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
`

const sideInfoCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3em;
`

const sideTitleCss = css`
  font-size: 0.85em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #2d2d7a;
`

const mushroomListCss = css`
  display: flex;
  gap: 0.4em;
  flex-wrap: wrap;
  justify-content: center;
`

const chipCss = (color: number) => css`
  display: inline-flex;
  align-items: center;
  gap: 0.25em;
  padding: 0.2em 0.5em;
  border-radius: 12px;
  background: ${mushroomHexColors[color]}30;
  border: 1.5px solid ${mushroomHexColors[color]}88;
  font-size: 0.75em;
  white-space: nowrap;
`

const dialogHintCss = css`
  margin: 0;
  font-size: 0.7em;
  color: #888;
  font-style: italic;
  text-align: center;
`

const minimizeButtonCss = css`
  position: absolute;
  top: 0.3em;
  right: 0.3em;
  background: none;
  border: none;
  font-size: 1.4em;
  color: #999;
  cursor: pointer;
  padding: 0.1em 0.3em;
  line-height: 1;
  border-radius: 4px;

  &:hover {
    color: #2d2d7a;
    background: rgba(45, 45, 122, 0.1);
  }
`

const reopenButtonCss = css`
  position: fixed;
  bottom: 2em;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  font-size: 3vh;
  padding: 0.5em 1.2em;
  background: #2d2d7a;
  color: #f0e8c8;
  border: none;
  border-radius: 0.5em;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    background: #3d3d9a;
  }
`
