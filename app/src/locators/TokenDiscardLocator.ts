import { PileLocator } from '@gamepark/react-game'

export class TokenDiscardLocator extends PileLocator {
  coordinates = { x: 38, y: -13 }
  radius = 1.5
}

export const tokenDiscardLocator = new TokenDiscardLocator()
