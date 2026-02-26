import { ItemContext, ListLocator } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { isPlayerViewed } from './ViewHelper'
import { panelLocator } from './PanelLocator'

export class PlayerMeepleStockLocator extends ListLocator {
  gap: Partial<Coordinates> = { x: 1.5 }

  getCoordinates(_location: Location) {
    return { x: -24.5, y: 21 }
  }

  placeItem(item: MaterialItem, context: ItemContext): string[] {
    if (!isPlayerViewed(item.location.player, context)) {
      return panelLocator.placeItem(item, context)
    }
    return super.placeItem(item, context)
  }
}

export const playerMeepleStockLocator = new PlayerMeepleStockLocator()
