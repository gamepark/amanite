import { Locator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

export class ValueCardSlotLocator extends Locator {
  getCoordinates(location: Location) {
    const i = location.x ?? 0
    const col = i % 3
    const row = Math.floor(i / 3)
    return { x: 10 + col * 5.5, y: 3 + row * 9 }
  }
}

export const valueCardSlotLocator = new ValueCardSlotLocator()
