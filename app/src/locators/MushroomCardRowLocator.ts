import { Locator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

export class MushroomCardRowLocator extends Locator {
  getCoordinates(location: Location) {
    return { x: -32.5 + (location.x ?? 0) * 13, y: 5 }
  }
}

export const mushroomCardRowLocator = new MushroomCardRowLocator()
