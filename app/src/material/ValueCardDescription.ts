import { CardDescription } from '@gamepark/react-game'
import { ValueCardHelp } from './help/ValueCardHelp'
import { ValueType } from '@gamepark/amanite/material/ValueType'
import Minus1ValueCard from '../images/cards/value/Minus1ValueCard.jpg'
import Value1Card from '../images/cards/value/Value1Card.jpg'
import Value2Card from '../images/cards/value/Value2Card.jpg'
import Value3Card from '../images/cards/value/Value3Card.jpg'
import AntidoteValueCard from '../images/cards/value/AntidoteValueCard.jpg'
import PoisonValueCard from '../images/cards/value/PoisonValueCard.jpg'
import PotionValueCard from '../images/cards/value/PotionValueCard.jpg'
import MushroomLimitValueCard from '../images/cards/value/MushroomLimitValueCard.jpg'
import MushroomMajorityValueCard from '../images/cards/value/MushroomMajorityValueCard.jpg'
import MushroomPairValueCard from '../images/cards/value/MushroomPairValueCard.jpg'
import ClueCardBack from '../images/cards/clue/ClueCardBack.jpg'

class ValueCardDescription extends CardDescription {
  width = 4.5
  height = 6.8
  borderRadius = 0.2
  help = ValueCardHelp

  backImage = ClueCardBack

  images = {
    [ValueType.Minus1]: Minus1ValueCard,
    [ValueType.Value1]: Value1Card,
    [ValueType.Value2]: Value2Card,
    [ValueType.Value3]: Value3Card,
    [ValueType.Antidote]: AntidoteValueCard,
    [ValueType.Poison]: PoisonValueCard,
    [ValueType.Potion]: PotionValueCard,
    [ValueType.MushroomLimit]: MushroomLimitValueCard,
    [ValueType.MushroomMajority]: MushroomMajorityValueCard,
    [ValueType.MushroomPair]: MushroomPairValueCard
  }

}

export const valueCardDescription = new ValueCardDescription()
