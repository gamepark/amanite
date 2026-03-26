import { ItemContext, ListLocator } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { isPlayerViewed } from './ViewHelper'

export class PlayerMeepleStockLocator extends ListLocator {
  gap: Partial<Coordinates> = { x: 1.5 }
  navigationSorts = []

  getCoordinates(_location: Location) {
    return { x: -24.5, y: 21 }
  }

  hide(item: MaterialItem, context: ItemContext): boolean {
    return !isPlayerViewed(item.location.player, context)
  }
}

export const playerMeepleStockLocator = new PlayerMeepleStockLocator()
