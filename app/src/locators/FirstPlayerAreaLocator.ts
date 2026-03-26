import { ItemContext, Locator } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { isPlayerViewed } from './ViewHelper'

export class FirstPlayerAreaLocator extends Locator {
  getCoordinates(_location: Location) {
    return { x: -39, y: 21 }
  }

  hide(item: MaterialItem, context: ItemContext): boolean {
    return !isPlayerViewed(item.location.player, context)
  }
}

export const firstPlayerAreaLocator = new FirstPlayerAreaLocator()
