import { MaterialGameSetup } from '@gamepark/rules-api'
import { AmaniteOptions } from './AmaniteOptions'
import { AmaniteRules } from './AmaniteRules'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerColor } from './PlayerColor'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class AmaniteSetup extends MaterialGameSetup<PlayerColor, MaterialType, LocationType, AmaniteOptions> {
  Rules = AmaniteRules

  setupMaterial(_options: AmaniteOptions) {
    // TODO
  }

  start() {
    this.startPlayerTurn(RuleId.TheFirstStep, this.players[0])
  }
}
