import { ItemContext, Locator } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { isPlayerViewed } from './ViewHelper'

export class PlayerStartCardLocator extends Locator {
  getCoordinates(_location: Location) {
    return { x: -32, y: 22 }
  }

  hide(item: MaterialItem, context: ItemContext): boolean {
    return !isPlayerViewed(item.location.player, context)
  }
}

export const playerStartCardLocator = new PlayerStartCardLocator()
