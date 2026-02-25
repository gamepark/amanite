import { Locator, MaterialContext } from '@gamepark/react-game'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { Location, XYCoordinates } from '@gamepark/rules-api'

export class NotebookSlotLocator extends Locator {
  parentItemType = MaterialType.MushroomCard

  getPositionOnParent(location: Location, context: MaterialContext): XYCoordinates {
    const card = context.rules.material(MaterialType.MushroomCard).getItem(location.parent!)
    const has2Slots = card?.location?.rotation === 1
    const slot = location.x ?? 0

    if (!has2Slots) {
      // Face 1 (2 players): single slot, protruding from left edge
      return { x: 0, y: 50 }
    }
    // Face 2 (3-4 players): two slots stacked vertically, protruding from left edge
    return { x: 0, y: 28 + slot * 40 }
  }
}

export const notebookSlotLocator = new NotebookSlotLocator()
