import { Locator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

export class ValueCardSlotLocator extends Locator {
  getCoordinates(location: Location) {
    // Grouped together as a reference line, not aligned with individual mushroom cards
    return { x: -15 + (location.x ?? 0) * 6, y: 13 }
  }
}

export const valueCardSlotLocator = new ValueCardSlotLocator()
