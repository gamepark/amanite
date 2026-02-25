import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerAnimal } from '../PlayerAnimal'
import { GameHelper } from './helper/GameHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class EndRoundRule extends PlayerTurnRule {
  helper = new GameHelper(this.game)

  onRuleStart(): MaterialMove[] {
    const round = this.remind<number>(Memory.Round)
    const moves: MaterialMove[] = []

    if (round < 3) {
      // Pass first player token clockwise
      const currentFirst = this.remind<PlayerAnimal>(Memory.FirstPlayer)
      const newFirst = this.helper.getNextPlayer(currentFirst)
      this.memorize(Memory.FirstPlayer, newFirst)

      // Move first player token
      moves.push(
        ...this.material(MaterialType.FirstPlayerToken).moveItems({
          type: LocationType.FirstPlayerArea,
          player: newFirst
        })
      )

      // Increment round
      this.memorize(Memory.Round, round + 1)

      // Start new round
      moves.push(this.startPlayerTurn(RuleId.PlaceNewTokens, newFirst))
      return moves
    }

    // Round 3 done: final scoring
    moves.push(this.startRule(RuleId.FinalScoring))
    return moves
  }

  getPlayerMoves(): MaterialMove[] {
    return []
  }
}
