import { TokenDescription } from '@gamepark/react-game'
import { RoundTokenHelp } from './help/RoundTokenHelp'
import { MushroomColor } from '@gamepark/amanite/material/MushroomColor'
import { Pig } from '@gamepark/amanite/material/RoundTokenId'
import BlueMushroomToken from '../images/tokens/round/BlueMushroomToken.jpg'
import GreenMushroomToken from '../images/tokens/round/GreenMushroomToken.jpg'
import PurpleMushroomToken from '../images/tokens/round/PurpleMushroomToken.jpg'
import RedMushroomToken from '../images/tokens/round/RedMushroomToken.jpg'
import WhiteMushroomToken from '../images/tokens/round/WhiteMushroomToken.jpg'
import YellowMushroomToken from '../images/tokens/round/YellowMushroomToken.jpg'
import PigToken from '../images/tokens/round/PigToken.jpg'

class RoundTokenDescription extends TokenDescription {
  width = 3
  height = 3
  borderRadius = 1.5
  help = RoundTokenHelp

  images = {
    [MushroomColor.Blue]: BlueMushroomToken,
    [MushroomColor.Green]: GreenMushroomToken,
    [MushroomColor.Purple]: PurpleMushroomToken,
    [MushroomColor.Red]: RedMushroomToken,
    [MushroomColor.White]: WhiteMushroomToken,
    [MushroomColor.Yellow]: YellowMushroomToken,
    [Pig]: PigToken
  }
}

export const roundTokenDescription = new RoundTokenDescription()
