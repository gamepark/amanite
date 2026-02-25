import { ListLocator } from '@gamepark/react-game'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { Location, XYCoordinates } from '@gamepark/rules-api'

export class ForestTileLotRightLocator extends ListLocator {
  parentItemType = MaterialType.ForestTile
  gap = { x: 3.05 }

  getPositionOnParent(_location: Location): XYCoordinates {
    return { x: 50, y: 130 }
  }
}

export const forestTileLotRightLocator = new ForestTileLotRightLocator()
