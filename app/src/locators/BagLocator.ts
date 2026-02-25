import { PileLocator } from '@gamepark/react-game'

export class BagLocator extends PileLocator {
  coordinates = { x: 38, y: -8 }
  radius = 1.5
}

export const bagLocator = new BagLocator()
