import { css } from '@emotion/react'
import { TokenDescription } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'
import { MeepleHelp } from './help/MeepleHelp'

const playerColors: Record<number, string> = {
  [PlayerAnimal.Fox]: '#D4722A',
  [PlayerAnimal.Squirrel]: '#B84032',
  [PlayerAnimal.Owl]: '#7B7D7E',
  [PlayerAnimal.Jay]: '#3B7BB5'
}

class MeepleDescription extends TokenDescription {
  width = 1.5
  height = 2.2
  borderRadius = 0
  help = MeepleHelp

  getItemExtraCss(item: MaterialItem) {
    const color = playerColors[item.id as number] ?? '#888'
    return css`
      background-color: ${color};
      clip-path: polygon(50% 0%, 30% 35%, 0% 40%, 15% 60%, 0% 100%, 35% 85%, 50% 100%, 65% 85%, 100% 100%, 85% 60%, 100% 40%, 70% 35%);
    `
  }
}

export const meepleDescription = new MeepleDescription()
