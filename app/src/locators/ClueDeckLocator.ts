import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { Coordinates, Location, MaterialItem, XYCoordinates } from '@gamepark/rules-api'

export class ClueDeckLocator extends DeckLocator {
  parentItemType = MaterialType.MushroomCard
  gap: Partial<Coordinates> = { x: -0.03, y: -0.03 }

  getPositionOnParent(_location: Location): XYCoordinates {
    return { x: 28, y: 48 }
  }

  getParentItem(location: Location, context: MaterialContext): MaterialItem | undefined {
    if (location.id === undefined) return undefined
    return context.material[MaterialType.MushroomCard]
      ?.getStaticItems(context).find(item => item.id === location.id)
  }

  limit = 10
  navigationSorts = []
}

export const clueDeckLocator = new ClueDeckLocator()
