/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowLeft, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { ItemContext, TokenDescription } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType, MaterialItem, MaterialMove, MoveItem } from '@gamepark/rules-api'
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

const bounceDown = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(0.3em); }
`

const bounceDownCss = css`
  animation: ${bounceDown} 1.5s ease-in-out infinite;
  &:hover { animation-play-state: paused; }
`

const bounceUp = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-0.3em); }
`

const bounceUpCss = css`
  animation: ${bounceUp} 1.5s ease-in-out infinite;
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

    const takeMoves = legalMoves.filter(isMoveItemType(MaterialType.RoundToken))
      .filter(m => m.location.type === LocationType.PlayerTokens) as MoveItem[]
    if (takeMoves.length > 0) {
      const takeMove = takeMoves.find(m => m.itemIndex === context.index)
      if (!takeMove) return
      const tokens = context.rules.material(MaterialType.RoundToken)
      const rightmost = takeMoves.reduce((a, b) => {
        const ax = tokens.index(a.itemIndex).getItem()?.location.x ?? 0
        const bx = tokens.index(b.itemIndex).getItem()?.location.x ?? 0
        return bx > ax ? b : a
      })
      const isRightmost = rightmost.itemIndex === context.index
      const isSecondRow = (item.location.x ?? 0) >= 4
      const y = isSecondRow ? 2.5 : -2.5
      const animationCss = isSecondRow ? bounceUpCss : bounceDownCss
      return <StampButton move={takeMove} x={-1.17} y={y} extraCss={animationCss} xOrigin="start">
        <FontAwesomeIcon icon={faArrowDown} css={stampIconCss} />
        {isRightmost && <Trans i18nKey="button.take.token" />}
      </StampButton>
    }

    const splitMoves = legalMoves.filter(isMoveItemType(MaterialType.RoundToken))
      .filter(m => m.location.type === LocationType.ForestTileTokens) as MoveItem[]
    if (splitMoves.length > 0) {
      const splitMove = splitMoves.find(m => m.itemIndex === context.index)
      if (splitMove) {
        const isFromTop = item.location.id === LotZone.Top
        const isSecondRow = (item.location.x ?? 0) >= 4
        const y = isSecondRow ? 2.5 : -2.5
        const arrowIcon = isFromTop ? faArrowDown : faArrowUp
        const animationCss = isSecondRow ? bounceUpCss : bounceDownCss
        const tokens = context.rules.material(MaterialType.RoundToken)
        const sameLotMoves = splitMoves.filter(m => {
          const t = tokens.index(m.itemIndex).getItem()
          return t?.location.id === item.location.id
        })
        const rightmost = sameLotMoves.reduce((a, b) => {
          const ax = tokens.index(a.itemIndex).getItem()?.location.x ?? 0
          const bx = tokens.index(b.itemIndex).getItem()?.location.x ?? 0
          return bx > ax ? b : a
        })
        const isRightmost = rightmost.itemIndex === context.index
        return <StampButton move={splitMove} x={-1.17} y={y} extraCss={animationCss} xOrigin="start">
          <FontAwesomeIcon icon={arrowIcon} css={stampIconCss} />
          {isRightmost && <Trans i18nKey={isFromTop ? 'button.move.down' : 'button.move.up'} />}
        </StampButton>
      }
    }

    const lotId = item.location.id
    const tokensInLot = context.rules.material(MaterialType.RoundToken)
      .location(LocationType.ForestTileTokens)
      .parent(item.location.parent!)
      .filter(t => t.location.id === lotId)
    const maxX = Math.max(...tokensInLot.getItems().map(t => t.location.x ?? 0))
    if ((item.location.x ?? 0) !== maxX) return

    const data = lotId === LotZone.Top ? 'top' : 'bottom'
    const move = legalMoves.find(m => isCustomMoveType(CustomMoveType.ChooseLot)(m) && m.data === data)
    if (!move) return
    return <StampButton move={move} x={4} y={0} extraCss={chooseSlideCss} align="left"><FontAwesomeIcon icon={faArrowLeft} css={stampIconCss} /> <Trans i18nKey="button.choose" /></StampButton>
  }
}

export const roundTokenDescription = new RoundTokenDescription()
