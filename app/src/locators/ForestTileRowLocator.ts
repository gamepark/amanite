import { Locator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

export class ForestTileRowLocator extends Locator {
  getCoordinates(location: Location) {
    return { x: -33 + (location.x ?? 0) * 13, y: -8 }
  }
}

export const forestTileRowLocator = new ForestTileRowLocator()
