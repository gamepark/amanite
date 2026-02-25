import { CardDescription } from '@gamepark/react-game'
import { MushroomCardHelp } from './help/MushroomCardHelp'
import { MaterialItem } from '@gamepark/rules-api'
import { MushroomColor } from '@gamepark/amanite/material/MushroomColor'
import BlueMushroomCard1 from '../images/cards/mushroom/BlueMushroomCard1.jpg'
import BlueMushroomCard2 from '../images/cards/mushroom/BlueMushroomCard2.jpg'
import GreenMushroomCard1 from '../images/cards/mushroom/GreenMushroomCard1.jpg'
import GreenMushroomCard2 from '../images/cards/mushroom/GreenMushroomCard2.jpg'
import PurpleMushroomCard1 from '../images/cards/mushroom/PurpleMushroomCard1.jpg'
import PurpleMushroomCard2 from '../images/cards/mushroom/PurpleMushroomCard2.jpg'
import RedMushroomCard1 from '../images/cards/mushroom/RedMushroomCard1.jpg'
import RedMushroomCard2 from '../images/cards/mushroom/RedMushroomCard2.jpg'
import WhiteMushroomCard1 from '../images/cards/mushroom/WhiteMushroomCard1.jpg'
import WhiteMushroomCard2 from '../images/cards/mushroom/WhiteMushroomCard2.jpg'
import YellowMushroomCard1 from '../images/cards/mushroom/YellowMushroomCard1.jpg'
import YellowMushroomCard2 from '../images/cards/mushroom/YellowMushroomCard2.jpg'

class MushroomCardDescription extends CardDescription {
  width = 12
  height = 8
  borderRadius = 0.3
  help = MushroomCardHelp

  images = {
    [MushroomColor.Blue]: BlueMushroomCard1,
    [MushroomColor.Green]: GreenMushroomCard1,
    [MushroomColor.Purple]: PurpleMushroomCard1,
    [MushroomColor.Red]: RedMushroomCard1,
    [MushroomColor.White]: WhiteMushroomCard1,
    [MushroomColor.Yellow]: YellowMushroomCard1
  }

  backImages = {
    [MushroomColor.Blue]: BlueMushroomCard2,
    [MushroomColor.Green]: GreenMushroomCard2,
    [MushroomColor.Purple]: PurpleMushroomCard2,
    [MushroomColor.Red]: RedMushroomCard2,
    [MushroomColor.White]: WhiteMushroomCard2,
    [MushroomColor.Yellow]: YellowMushroomCard2
  }

  isFlippedOnTable(item: Partial<MaterialItem>) {
    return item.location?.rotation === 1
  }
}

export const mushroomCardDescription = new MushroomCardDescription()
