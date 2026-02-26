import { CustomMove, isCustomMoveType, MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { CustomMoveType } from './CustomMoveType'
import { RuleId } from './RuleId'

export class ChooseStartCardSideRule extends SimultaneousRule {

  getActivePlayerLegalMoves(player: number): MaterialMove[] {
    return [
      this.customMove(CustomMoveType.Pass, { player, side: 0 }),
      this.customMove(CustomMoveType.Pass, { player, side: 1 })
    ]
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    if (!isCustomMoveType(CustomMoveType.Pass)(move)) return []
    const { player, side } = move.data as { player: number, side: number }
    const startCard = this.material(MaterialType.StartCard)
      .location(LocationType.PlayerStartCard)
      .player(player)
    const moves: MaterialMove[] = []
    if (startCard.getItem()?.location.rotation !== side) {
      moves.push(...startCard.moveItems({ type: LocationType.PlayerStartCard, player, rotation: side }))
    }
    moves.push(this.endPlayerTurn(player))
    return moves
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    return [this.startRule(RuleId.DealInitialClues)]
  }
}
