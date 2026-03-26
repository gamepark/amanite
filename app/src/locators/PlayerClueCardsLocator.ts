import { HandLocator, ItemContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { isPlayerViewed } from './ViewHelper'

export class PlayerClueCardsLocator extends HandLocator {
  maxAngle = 12
  gapMaxAngle = 2

  getCoordinates(_location: Location) {
    return { x: 20, y: 21 }
  }

  getHoverTransform(item: MaterialItem, context: ItemContext): string[] {
    return ['translateY(-3em)', 'translateZ(10em)', `rotateZ(${-this.getItemRotateZ(item, context)}deg)`, 'scale(2)']
  }

  placeItem(item: MaterialItem, context: ItemContext): string[] {
    if (!isPlayerViewed(item.location.player, context)) {
      return [...super.placeItem(item, context), 'scale(0.0001)']
    }
    return super.placeItem(item, context)
  }
}

export const playerClueCardsLocator = new PlayerClueCardsLocator()
