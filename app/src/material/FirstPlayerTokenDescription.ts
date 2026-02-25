import { TokenDescription } from '@gamepark/react-game'
import { FirstPlayerTokenHelp } from './help/FirstPlayerTokenHelp'
import FirstPlayerToken from '../images/tokens/FirstPlayerToken.png'

class FirstPlayerTokenDescription extends TokenDescription {
  width = 3.5
  height = 3
  borderRadius = 0.3
  help = FirstPlayerTokenHelp

  images = {
    1: FirstPlayerToken
  }
}

export const firstPlayerTokenDescription = new FirstPlayerTokenDescription()
