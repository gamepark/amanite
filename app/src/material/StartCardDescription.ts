import { CardDescription } from '@gamepark/react-game'
import { StartCardHelp } from './help/StartCardHelp'
import { MaterialItem } from '@gamepark/rules-api'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'
import FoxCard1 from '../images/cards/start/FoxCard1.jpg'
import FoxCard2 from '../images/cards/start/FoxCard2.jpg'
import JayCard1 from '../images/cards/start/JayCard1.jpg'
import JayCard2 from '../images/cards/start/JayCard2.jpg'
import OwlCard1 from '../images/cards/start/OwlCard1.jpg'
import OwlCard2 from '../images/cards/start/OwlCard2.jpg'
import SquirrelCard1 from '../images/cards/start/SquirrelCard1.jpg'
import SquirrelCard2 from '../images/cards/start/SquirrelCard2.jpg'

class StartCardDescription extends CardDescription {
  width = 12
  height = 8
  borderRadius = 0.3
  help = StartCardHelp

  images = {
    [PlayerAnimal.Fox]: FoxCard1,
    [PlayerAnimal.Squirrel]: SquirrelCard1,
    [PlayerAnimal.Owl]: OwlCard1,
    [PlayerAnimal.Jay]: JayCard1
  }

  backImages = {
    [PlayerAnimal.Fox]: FoxCard2,
    [PlayerAnimal.Squirrel]: SquirrelCard2,
    [PlayerAnimal.Owl]: OwlCard2,
    [PlayerAnimal.Jay]: JayCard2
  }

  isFlippedOnTable(item: Partial<MaterialItem>) {
    return item.location?.rotation === 1
  }
}

export const startCardDescription = new StartCardDescription()
