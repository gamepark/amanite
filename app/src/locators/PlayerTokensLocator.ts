import { ItemContext, Locator } from '@gamepark/react-game'
import { Coordinates, MaterialItem } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { mushroomColors } from '@gamepark/amanite/material/MushroomColor'
import { Pig } from '@gamepark/amanite/material/RoundTokenId'
import { isPlayerViewed } from './ViewHelper'
import { panelLocator } from './PanelLocator'

const colorOrder = [...mushroomColors, Pig]
const baseX = -12
const baseY = 21.5
const columnGap = 3.5
const maxColumnHeight = 6 // em available for stacking

export class PlayerTokensLocator extends Locator {

  getItemCoordinates(item: MaterialItem, context: ItemContext): Partial<Coordinates> {
    const colorIndex = colorOrder.indexOf(item.id)

    // Get all tokens of the same color for this player
    const sameColor = context.rules.material(MaterialType.RoundToken)
      .location(LocationType.PlayerTokens)
      .player(item.location.player)
      .id(item.id)

    const count = sameColor.length
    const myIndex = sameColor.filter(i => (i.location.x ?? 0) < (item.location.x ?? 0)).length

    // Overlap adapts: smaller gap when many tokens, capped to fit
    const overlap = count > 1 ? Math.min(1.5, maxColumnHeight / (count - 1)) : 0

    return {
      x: baseX + colorIndex * columnGap,
      y: baseY + myIndex * overlap
    }
  }

  placeItem(item: MaterialItem, context: ItemContext): string[] {
    if (!isPlayerViewed(item.location.player, context)) {
      return panelLocator.placeItem(item, context)
    }
    return super.placeItem(item, context)
  }
}

export const playerTokensLocator = new PlayerTokensLocator()
