import { CardDescription } from '@gamepark/react-game'
import { ClueCardHelp } from './help/ClueCardHelp'
import { ValueType } from '@gamepark/amanite/material/ValueType'
import Minus1ClueCard from '../images/cards/clue/Minus1ClueCard.jpg'
import Clue1Card from '../images/cards/clue/Clue1Card.jpg'
import Clue2Card from '../images/cards/clue/Clue2Card.jpg'
import Clue3Card from '../images/cards/clue/Clue3Card.jpg'
import AntidoteClueCard from '../images/cards/clue/AntidoteClueCard.jpg'
import PoisonClueCard from '../images/cards/clue/PoisonClueCard.jpg'
import PotionClueCard from '../images/cards/clue/PotionClueCard.jpg'
import MushroomLimitClueCard from '../images/cards/clue/MushroomLimitClueCard.jpg'
import MushroomMajorityClueCard from '../images/cards/clue/MushroomMajorityClueCard.jpg'
import MushroomPairClueCard from '../images/cards/clue/MushroomPairClueCard.jpg'
import ClueCardBack from '../images/cards/clue/ClueCardBack.jpg'

class ClueCardDescription extends CardDescription {
  width = 4.5
  height = 6.8
  borderRadius = 0.2
  help = ClueCardHelp

  images = {
    [ValueType.Minus1]: Minus1ClueCard,
    [ValueType.Value1]: Clue1Card,
    [ValueType.Value2]: Clue2Card,
    [ValueType.Value3]: Clue3Card,
    [ValueType.Antidote]: AntidoteClueCard,
    [ValueType.Poison]: PoisonClueCard,
    [ValueType.Potion]: PotionClueCard,
    [ValueType.MushroomLimit]: MushroomLimitClueCard,
    [ValueType.MushroomMajority]: MushroomMajorityClueCard,
    [ValueType.MushroomPair]: MushroomPairClueCard
  }

  backImage = ClueCardBack
}

export const clueCardDescription = new ClueCardDescription()
