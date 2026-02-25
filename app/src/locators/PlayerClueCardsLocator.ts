import { HandLocator, ItemContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { isPlayerViewed } from './ViewHelper'
import { panelLocator } from './PanelLocator'

export class PlayerClueCardsLocator extends HandLocator {
  getCoordinates(_location: Location) {
    return { x: 20, y: 23 }
  }

  maxAngle = 14
  gapMaxAngle = 3.5

  placeItem(item: MaterialItem, context: ItemContext): string[] {
    if (!isPlayerViewed(item.location.player, context)) {
      return panelLocator.placeItem(item, context)
    }
    return super.placeItem(item, context)
  }
}

export const playerClueCardsLocator = new PlayerClueCardsLocator()
