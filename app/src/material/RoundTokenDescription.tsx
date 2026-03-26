/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { ItemContext, TokenDescription } from '@gamepark/react-game'
import { isCustomMoveType, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { MushroomColor } from '@gamepark/amanite/material/MushroomColor'
import { Pig } from '@gamepark/amanite/material/RoundTokenId'
import { CustomMoveType } from '@gamepark/amanite/rules/CustomMoveType'
import { Memory } from '@gamepark/amanite/rules/Memory'
import { Trans } from 'react-i18next'
import { StampButton, stampIconCss } from '../components/StampButton'
import { RoundTokenHelp } from './help/RoundTokenHelp'
import BlueMushroomToken from '../images/tokens/round/BlueMushroomToken.jpg'
import GreenMushroomToken from '../images/tokens/round/GreenMushroomToken.jpg'
import PurpleMushroomToken from '../images/tokens/round/PurpleMushroomToken.jpg'
import RedMushroomToken from '../images/tokens/round/RedMushroomToken.jpg'
import WhiteMushroomToken from '../images/tokens/round/WhiteMushroomToken.jpg'
import YellowMushroomToken from '../images/tokens/round/YellowMushroomToken.jpg'
import PigToken from '../images/tokens/round/PigToken.jpg'
import { LotZone } from '@gamepark/amanite/material/LotZone'

const slide = keyframes`
  0%, 100% { transform: translateX(calc(50% - 0.15em)); }
  50% { transform: translateX(calc(50% + 0.15em)); }
`

const chooseSlideCss = css`
  animation: ${slide} 1.5s ease-in-out infinite;
  &:hover { animation-play-state: paused; }
`

class RoundTokenDescription extends TokenDescription {
  width = 3
  height = 3
  borderRadius = 1.5
  help = RoundTokenHelp
  menuAlwaysVisible = true

  images = {
    [MushroomColor.Blue]: BlueMushroomToken,
    [MushroomColor.Green]: GreenMushroomToken,
    [MushroomColor.Purple]: PurpleMushroomToken,
    [MushroomColor.Red]: RedMushroomToken,
    [MushroomColor.White]: WhiteMushroomToken,
    [MushroomColor.Yellow]: YellowMushroomToken,
    [Pig]: PigToken
  }

  getItemMenu(item: MaterialItem, context: ItemContext, legalMoves: MaterialMove[]) {
    if (item.location.type !== LocationType.ForestTileTokens) return
    const currentTile = context.rules.remind(Memory.CurrentForestTile)
    if (item.location.parent !== currentTile) return
    const lotId = item.location.id
    const tokensInLot = context.rules.material(MaterialType.RoundToken)
      .location(LocationType.ForestTileTokens)
      .parent(item.location.parent!)
      .filter(t => t.location.id === lotId)
    const maxX = Math.max(...tokensInLot.getItems().map(t => t.location.x ?? 0))
    if ((item.location.x ?? 0) !== maxX) return

    const data = lotId === LotZone.Top ? 'top' : 'bottom'
    const move = legalMoves.find(m => isCustomMoveType(CustomMoveType.Pass)(m) && m.data === data)
    if (!move) return
    return <StampButton move={move} x={4} y={0} extraCss={chooseSlideCss} align="left"><FontAwesomeIcon icon={faArrowLeft} css={stampIconCss} /> <Trans i18nKey="button.choose" defaults="Choose" /></StampButton>
  }
}

export const roundTokenDescription = new RoundTokenDescription()
