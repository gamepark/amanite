import { CustomMove, isCustomMoveType, MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerAnimal } from '../PlayerAnimal'
import { CustomMoveType } from './CustomMoveType'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class AcknowledgeCluesRule extends SimultaneousRule {

  getActivePlayerLegalMoves(player: number): MaterialMove[] {
    return [this.customMove(CustomMoveType.Pass, { player })]
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    if (!isCustomMoveType(CustomMoveType.Pass)(move)) return []
    const player = move.data.player as PlayerAnimal
    const moves: MaterialMove[] = []

    // Clear mushroom origin (location.id) from all clue cards in this player's hand
    const clueCards = this.material(MaterialType.ClueCard)
      .location(LocationType.PlayerClueCards)
      .player(player)

    for (const index of clueCards.getIndexes()) {
      const item = clueCards.getItem(index)!
      if (item.location.id !== undefined) {
        moves.push(
          ...this.material(MaterialType.ClueCard).index(index).moveItems({
            type: LocationType.PlayerClueCards,
            player
          })
        )
      }
    }

    moves.push(this.endPlayerTurn(player))
    return moves
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    const firstPlayer = this.remind<PlayerAnimal>(Memory.FirstPlayer)
    return [this.startPlayerTurn(RuleId.PlaceNewTokens, firstPlayer)]
  }
}
