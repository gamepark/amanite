import { DeckLocator } from '@gamepark/react-game'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { Coordinates, Location, XYCoordinates } from '@gamepark/rules-api'

export class ClueDeckLocator extends DeckLocator {
  parentItemType = MaterialType.MushroomCard
  gap: Partial<Coordinates> = { x: -0.03, y: -0.03 }

  getPositionOnParent(_location: Location): XYCoordinates {
    return { x: 28, y: 48 }
  }

  limit = 10
}

export const clueDeckLocator = new ClueDeckLocator()
