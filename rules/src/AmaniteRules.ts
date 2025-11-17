import { MaterialGame, MaterialMove, MaterialRules, TimeLimit } from '@gamepark/rules-api'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerAnimal } from './PlayerAnimal'
import { TheFirstStepRule } from './rules/TheFirstStepRule'
import { RuleId } from './rules/RuleId'

/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class AmaniteRules
  extends MaterialRules<PlayerAnimal, MaterialType, LocationType>
  implements TimeLimit<MaterialGame<PlayerAnimal, MaterialType, LocationType>, MaterialMove<PlayerAnimal, MaterialType, LocationType>, PlayerAnimal>
{
  rules = {
    [RuleId.TheFirstStep]: TheFirstStepRule
  }

  giveTime(): number {
    return 60
  }
}
