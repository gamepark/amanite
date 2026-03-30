/** @jsxImportSource @emotion/react */
import { css, Interpolation, keyframes, Theme } from '@emotion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { BoardDescription, ItemContext } from '@gamepark/react-game'
import { isMoveItemType, MaterialItem, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { Memory } from '@gamepark/amanite/rules/Memory'
import { RuleId } from '@gamepark/amanite/rules/RuleId'
import { Trans } from 'react-i18next'
import { StampButton, stampIconCss } from '../components/StampButton'
import { ForestTileHelp } from './help/ForestTileHelp'
import ForestTile1 from '../images/tiles/ForestTile1.jpg'
import ForestTile2 from '../images/tiles/ForestTile2.jpg'
import ForestTile3 from '../images/tiles/ForestTile3.jpg'
import ForestTile4 from '../images/tiles/ForestTile4.jpg'
import ForestTile5 from '../images/tiles/ForestTile5.jpg'

const bounceUp = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-0.3em); }
`

const bounceUpCss = css`
  animation: ${bounceUp} 1.5s ease-in-out infinite;
  &:hover { animation-play-state: paused; }
`

const activeTileCss = css`
  box-shadow: 0 0 0.8em 0.2em rgba(255, 255, 255, 0.15);
`

const inactiveTileCss = css`
  filter: brightness(0.5) saturate(0.6);
  opacity: 0.7;
`

class ForestTileDescription extends BoardDescription {
  width = 12
  height = 6
  borderRadius = 0.5
  help = ForestTileHelp
  menuAlwaysVisible = true

  images = {
    1: ForestTile1,
    2: ForestTile2,
    3: ForestTile3,
    4: ForestTile4,
    5: ForestTile5
  }

  getItemMenu(_item: MaterialItem, context: ItemContext, legalMoves: MaterialMove[]) {
    const meepleMoves = legalMoves.filter(move =>
      isMoveItemType(MaterialType.Meeple)(move) && move.location.parent === context.index
    )
    if (meepleMoves.length === 0) return
    const move = meepleMoves[0] as MoveItem
    const spot = move.location.x ?? 0
    return <StampButton move={move} x={spot === 0 ? -3 : 3} y={3.8} extraCss={bounceUpCss} vertical><FontAwesomeIcon icon={faArrowUp} css={stampIconCss} /><Trans i18nKey="button.place" /></StampButton>
  }

  getItemExtraCss(_item: MaterialItem, context: ItemContext): Interpolation<Theme> {
    const ruleId = context.rules.game.rule?.id
    if (ruleId === RuleId.ChooseLot || ruleId === RuleId.ChooseTokens || ruleId === RuleId.DiscardForPig) {
      const currentTile = context.rules.remind(Memory.CurrentForestTile)
      if (currentTile !== undefined) {
        return context.index === currentTile ? activeTileCss : inactiveTileCss
      }
    }
    return
  }
}

export const forestTileDescription = new ForestTileDescription()
