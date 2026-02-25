import { ItemContext, Locator } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { isPlayerViewed } from './ViewHelper'
import { panelLocator } from './PanelLocator'

export class FirstPlayerAreaLocator extends Locator {
  getCoordinates(_location: Location) {
    return { x: -39, y: 21 }
  }

  placeItem(item: MaterialItem, context: ItemContext): string[] {
    if (!isPlayerViewed(item.location.player, context)) {
      return panelLocator.placeItem(item, context)
    }
    return super.placeItem(item, context)
  }
}

export const firstPlayerAreaLocator = new FirstPlayerAreaLocator()
