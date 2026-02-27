/** @jsxImportSource @emotion/react */
import { css, Interpolation, Theme } from '@emotion/react'
import { BoardDescription, ItemContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { Memory } from '@gamepark/amanite/rules/Memory'
import { RuleId } from '@gamepark/amanite/rules/RuleId'
import { ForestTileHelp } from './help/ForestTileHelp'
import ForestTile1 from '../images/tiles/ForestTile1.jpg'
import ForestTile2 from '../images/tiles/ForestTile2.jpg'
import ForestTile3 from '../images/tiles/ForestTile3.jpg'
import ForestTile4 from '../images/tiles/ForestTile4.jpg'
import ForestTile5 from '../images/tiles/ForestTile5.jpg'

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

  images = {
    1: ForestTile1,
    2: ForestTile2,
    3: ForestTile3,
    4: ForestTile4,
    5: ForestTile5
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
