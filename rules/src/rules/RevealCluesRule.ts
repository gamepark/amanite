import { MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerAnimal } from '../PlayerAnimal'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class RevealCluesRule extends MaterialRulesPart {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []

    for (const player of this.game.players) {
      const playerClues = this.material(MaterialType.ClueCard)
        .location(LocationType.PlayerClueCards)
        .player(player)

      // Shuffle so the player doesn't know which clue came from which mushroom
      moves.push(playerClues.shuffle())

      // Flip all cards face-up at once (visible to owner only)
      moves.push(playerClues.moveItemsAtOnce({ rotation: true }))
    }

    const firstPlayer = this.remind<PlayerAnimal>(Memory.FirstPlayer)
    moves.push(this.startPlayerTurn(RuleId.PlaceNewTokens, firstPlayer))
    return moves
  }
}
