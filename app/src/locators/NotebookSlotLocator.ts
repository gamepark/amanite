import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { ListLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem, XYCoordinates } from '@gamepark/rules-api'

export class NotebookSlotLocator extends ListLocator {
  parentItemType = MaterialType.MushroomCard
  gap: Partial<Coordinates> = { y: 2.6 }

  getPositionOnParent(_location: Location, context: MaterialContext): XYCoordinates {
    const has2Slots = context.rules.game.players.length > 2
    return { x: 0, y: has2Slots ? 35 : 50 }
  }

  getParentItem(location: Location, context: MaterialContext): MaterialItem | undefined {
    if (location.id === undefined) return undefined
    return context.material[MaterialType.MushroomCard]
      ?.getStaticItems(context).find(item => item.id === location.id)
  }
}

export const notebookSlotLocator = new NotebookSlotLocator()
