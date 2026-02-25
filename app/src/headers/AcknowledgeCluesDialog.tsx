/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { Dialog, PlayMoveButton, useLegalMoves, usePlayerId, useRules } from '@gamepark/react-game'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'
import { isCustomMoveType } from '@gamepark/rules-api'
import { CustomMoveType } from '@gamepark/amanite/rules/CustomMoveType'
import { RuleId } from '@gamepark/amanite/rules/RuleId'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'
import { ValueType } from '@gamepark/amanite/material/ValueType'
import { useTranslation } from 'react-i18next'
import { MushroomDot, mushroomHexColors } from '../material/help/HelpUtils'
import BlueToken from '../images/tokens/round/BlueMushroomToken.jpg'
import GreenToken from '../images/tokens/round/GreenMushroomToken.jpg'
import PurpleToken from '../images/tokens/round/PurpleMushroomToken.jpg'
import RedToken from '../images/tokens/round/RedMushroomToken.jpg'
import WhiteToken from '../images/tokens/round/WhiteMushroomToken.jpg'
import YellowToken from '../images/tokens/round/YellowMushroomToken.jpg'
import Minus1ClueCard from '../images/cards/clue/Minus1ClueCard.jpg'
import Clue1Card from '../images/cards/clue/Clue1Card.jpg'
import Clue2Card from '../images/cards/clue/Clue2Card.jpg'
import Clue3Card from '../images/cards/clue/Clue3Card.jpg'
import AntidoteClueCard from '../images/cards/clue/AntidoteClueCard.jpg'
import PoisonClueCard from '../images/cards/clue/PoisonClueCard.jpg'
import PotionClueCard from '../images/cards/clue/PotionClueCard.jpg'
import MushroomLimitClueCard from '../images/cards/clue/MushroomLimitClueCard.jpg'
import MushroomMajorityClueCard from '../images/cards/clue/MushroomMajorityClueCard.jpg'
import MushroomPairClueCard from '../images/cards/clue/MushroomPairClueCard.jpg'

const tokenImages: Record<number, string> = {
  1: BlueToken, 2: GreenToken, 3: PurpleToken,
  4: RedToken, 5: WhiteToken, 6: YellowToken
}

const clueCardImages: Record<number, string> = {
  [ValueType.Minus1]: Minus1ClueCard,
  [ValueType.Value1]: Clue1Card,
  [ValueType.Value2]: Clue2Card,
  [ValueType.Value3]: Clue3Card,
  [ValueType.Antidote]: AntidoteClueCard,
  [ValueType.Poison]: PoisonClueCard,
  [ValueType.Potion]: PotionClueCard,
  [ValueType.MushroomLimit]: MushroomLimitClueCard,
  [ValueType.MushroomMajority]: MushroomMajorityClueCard,
  [ValueType.MushroomPair]: MushroomPairClueCard
}

export const AcknowledgeCluesDialog: FC = () => {
  const { t } = useTranslation()
  const player = usePlayerId<PlayerAnimal>()
  const rules = useRules<AmaniteRules>()
  const legalMoves = useLegalMoves()

  if (!rules || player === undefined) return null
  if (rules.game.rule?.id !== RuleId.AcknowledgeClues) return null
  if (!rules.isTurnToPlay(player)) return null

  const confirmMove = legalMoves.find(move => isCustomMoveType(CustomMoveType.Pass)(move))

  // Read clue cards with their mushroom origin (location.id)
  const clueCards = rules.material(MaterialType.ClueCard)
    .location(LocationType.PlayerClueCards)
    .player(player)
    .sort(item => item.location.x!)
    .getItems()

  const clues = clueCards
    .filter(item => item.location.id !== undefined)
    .map(item => ({
      mushroomColor: item.location.id as number,
      value: item.id as number
    }))

  if (clues.length === 0) return null

  return (
    <Dialog open={true} css={dialogCss}>
      <div css={dialogContentCss}>
        <h2 css={dialogTitleCss}>{t('dialog.clues.title')}</h2>
        <p css={dialogDescCss}>{t('dialog.clues.desc')}</p>

        <div css={cluesRowCss}>
          {clues.map((clue, i) => (
            <div key={i} css={clueItemCss}>
              <img src={clueCardImages[clue.value]} alt="" css={clueCardImageCss} />
              <div css={mushroomBadgeCss(clue.mushroomColor)}>
                <img src={tokenImages[clue.mushroomColor]} alt="" css={tokenImageCss} />
                <MushroomDot color={clue.mushroomColor} />
                <span>{t(`mushroom.${clue.mushroomColor}`)}</span>
              </div>
            </div>
          ))}
        </div>

        <p css={dialogHintCss}>{t('dialog.clues.hint')}</p>

        <PlayMoveButton move={confirmMove} css={confirmButtonCss}>
          {t('dialog.clues.confirm')}
        </PlayMoveButton>
      </div>
    </Dialog>
  )
}

const dialogCss = css`
  font-size: 3vh;
`

const dialogContentCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8em;
  padding: 0.5em 1.5em 1em;
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

const cluesRowCss = css`
  display: flex;
  gap: 2em;
  align-items: stretch;
  flex-wrap: wrap;
  justify-content: center;
`

const clueItemCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
`

const clueCardImageCss = css`
  width: 10em;
  height: auto;
  border-radius: 0.3em;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
`

const mushroomBadgeCss = (color: number) => css`
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.3em 0.6em;
  border-radius: 12px;
  background: ${mushroomHexColors[color]}30;
  border: 2px solid ${mushroomHexColors[color]}88;
  font-size: 0.85em;
  font-weight: 600;
`

const tokenImageCss = css`
  width: 1.8em;
  height: 1.8em;
  border-radius: 50%;
`

const dialogHintCss = css`
  margin: 0;
  font-size: 0.7em;
  color: #888;
  font-style: italic;
  text-align: center;
`

const confirmButtonCss = css`
  padding: 0.5em 2em;
  font-size: 1em;
  font-weight: 700;
  background: #2d2d7a;
  color: #f0e8c8;
  border: none;
  border-radius: 0.5em;
  cursor: pointer;

  &:hover {
    background: #3d3d9a;
  }
`
