import { TokenDescription } from '@gamepark/react-game'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'
import { MeepleHelp } from './help/MeepleHelp'
import FoxMeeple from '../images/tokens/meeple/FoxMeeple.png'
import SquirrelMeeple from '../images/tokens/meeple/SquirrelMeeple.png'
import OwlMeeple from '../images/tokens/meeple/OwlMeeple.png'
import JayMeeple from '../images/tokens/meeple/JayMeeple.png'

class MeepleDescription extends TokenDescription {
  width = 1.6
  height = 2.4
  borderRadius = 0
  transparency = true
  help = MeepleHelp

  images = {
    [PlayerAnimal.Fox]: FoxMeeple,
    [PlayerAnimal.Squirrel]: SquirrelMeeple,
    [PlayerAnimal.Owl]: OwlMeeple,
    [PlayerAnimal.Jay]: JayMeeple
  }
}

export const meepleDescription = new MeepleDescription()
