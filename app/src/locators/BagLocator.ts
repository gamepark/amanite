import { ItemContext, PileLocator } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'

export class BagLocator extends PileLocator {
  coordinates = { x: 0, y: -30 }
  radius = 1.5

  placeItem(item: MaterialItem<number, number>, context: ItemContext<number, number, number, number, number>): string[] {
    return super.placeItem(item, context).concat('scale(0.001)')
  }
}

export const bagLocator = new BagLocator()
