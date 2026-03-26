import { ItemContext, ListLocator } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { isPlayerViewed } from './ViewHelper'

export class PlayerNotebookStockLocator extends ListLocator {
  gap: Partial<Coordinates> = { x: 2.5 }
  navigationSorts = []

  getCoordinates(_location: Location) {
    return { x: -24.5, y: 24.5 }
  }

  hide(item: MaterialItem, context: ItemContext): boolean {
    return !isPlayerViewed(item.location.player, context)
  }
}

export const playerNotebookStockLocator = new PlayerNotebookStockLocator()
