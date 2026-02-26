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

const meepleCss = (color: string) => css`
  background-color: ${color};
  clip-path: polygon(50% 0%, 68% 3%, 78% 14%, 80% 28%, 76% 42%, 65% 52%, 85% 60%, 97% 70%, 100% 85%, 100% 100%, 0% 100%, 0% 85%, 3% 70%, 15% 60%, 35% 52%, 24% 42%, 20% 28%, 22% 14%, 32% 3%);
  filter: drop-shadow(1px 2px 2px rgba(0,0,0,0.5));
`

class MeepleDescription extends TokenDescription {
  width = 1.5
  height = 2.2
  borderRadius = 0
  help = MeepleHelp

  getItemExtraCss(item: MaterialItem) {
    return meepleCss(playerColors[item.id as number] ?? '#888')
  }

  getHelpDisplayExtraCss(item: Partial<MaterialItem>) {
    return meepleCss(playerColors[item.id as number] ?? '#888')
  }
}

export const meepleDescription = new MeepleDescription()
