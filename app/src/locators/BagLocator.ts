import { PileLocator } from '@gamepark/react-game'

export class BagLocator extends PileLocator {
  coordinates = { x: 0, y: -30 }
  radius = 1.5
}

export const bagLocator = new BagLocator()
