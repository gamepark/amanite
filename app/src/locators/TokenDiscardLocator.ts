import { PileLocator } from '@gamepark/react-game'

export class TokenDiscardLocator extends PileLocator {
  coordinates = { x: 0, y: -30 }
  radius = 1.5
}

export const tokenDiscardLocator = new TokenDiscardLocator()
