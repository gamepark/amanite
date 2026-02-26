import { DropAreaDescription, ItemContext, Locator } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { mushroomColors } from '@gamepark/amanite/material/MushroomColor'
import { Pig } from '@gamepark/amanite/material/RoundTokenId'
import { isPlayerViewed } from './ViewHelper'
import { panelLocator } from './PanelLocator'

const colorOrder = [...mushroomColors, Pig]
const baseX = -15
const baseY = 19
const columnGap = 3.5

export class PlayerTokensLocator extends Locator {
  locationDescription = new DropAreaDescription({ width: 25, height: 10, borderRadius: 1 })

  getLocationCoordinates(location: Location, context: ItemContext): Partial<Coordinates> {
    if (!isPlayerViewed(location.player, context)) return { x: -100, y: -100 }
    return { x: -4.5, y: 22 }
  }

  getItemCoordinates(item: MaterialItem, context: ItemContext): Partial<Coordinates> {
    const colorIndex = colorOrder.indexOf(item.id)

    // Get all tokens of the same color for this player
    const sameColor = context.rules.material(MaterialType.RoundToken)
      .location(LocationType.PlayerTokens)
      .player(item.location.player)
      .id(item.id)

    const myIndex = sameColor.filter(i => (i.location.x ?? 0) < (item.location.x ?? 0)).length

    return {
      x: baseX + colorIndex * columnGap,
      y: baseY + myIndex * 1,
      z: myIndex
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
