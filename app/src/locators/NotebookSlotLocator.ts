import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { ListLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'

export class NotebookSlotLocator extends ListLocator {
  gap = { y: 2.6 }

  getCoordinates(location: Location, context: MaterialContext): Partial<Coordinates> {
    const mushroom = context.rules.material(MaterialType.MushroomCard).getItem(location.id!)
    const i = mushroom?.location?.x ?? 0
    const has2Slots = context.rules.game.players.length > 2

    const col = i % 3
    const row = Math.floor(i / 3)
    const cardCenterX = -33 + col * 13
    const cardCenterY = 3 + row * 9
    return {
      x: cardCenterX - 6,
      y: cardCenterY + (has2Slots ? -1.2 : 0)
    }
  }
}

export const notebookSlotLocator = new NotebookSlotLocator()
