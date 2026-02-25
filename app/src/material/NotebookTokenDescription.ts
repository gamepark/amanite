import { TokenDescription } from '@gamepark/react-game'
import { NotebookTokenHelp } from './help/NotebookTokenHelp'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'
import FoxBookToken from '../images/tokens/book/FoxBookToken.png'
import JayBookToken from '../images/tokens/book/JayBookToken.png'
import OwlBookToken from '../images/tokens/book/OwlBookToken.png'
import SquirrelBookToken from '../images/tokens/book/SquirrelBookToken.png'

class NotebookTokenDescription extends TokenDescription {
  width = 2.1
  height = 2.9
  borderRadius = 0.3
  transparency = true
  help = NotebookTokenHelp

  images = {
    [PlayerAnimal.Fox]: FoxBookToken,
    [PlayerAnimal.Squirrel]: SquirrelBookToken,
    [PlayerAnimal.Owl]: OwlBookToken,
    [PlayerAnimal.Jay]: JayBookToken
  }
}

export const notebookTokenDescription = new NotebookTokenDescription()
