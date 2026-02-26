import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerAnimal } from '../PlayerAnimal'
import { GameHelper } from './helper/GameHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class HarvestRule extends PlayerTurnRule {
  helper = new GameHelper(this.game)

  onRuleStart(): MaterialMove[] {
    return this.resolveNextTile()
  }

  getPlayerMoves(): MaterialMove[] {
    return []
  }

  resolveNextTile(): MaterialMove[] {
    const moves: MaterialMove[] = []
    const forestTiles = this.helper.forestTiles
      .sort(item => item.location.x!)

    for (const tileIndex of forestTiles.getIndexes()) {
      // Check if this tile has already been resolved (no tokens and no meeples)
      const meeples = this.helper.getForestTileMeeples(tileIndex)
      const allTokens = this.helper.getAllForestTileTokens(tileIndex)

      if (meeples.length === 0 && allTokens.length === 0) continue

      if (meeples.length === 0 && allTokens.length > 0) {
        // No meeples: return all tokens to bag at once, then continue loop
        moves.push(allTokens.moveItemsAtOnce({ type: LocationType.Bag }))
        continue
      }

      if (meeples.length === 2) {
        // 2 meeples: first player (spot x=0) chooses lot
        const firstMeeple = meeples.filter(item => item.location.x === 0)
        const firstPlayer = firstMeeple.getItem()?.id as PlayerAnimal
        this.memorize(Memory.CurrentForestTile, tileIndex)
        moves.push(this.startPlayerTurn(RuleId.ChooseLot, firstPlayer))
        return moves
      }

      if (meeples.length === 1) {
        // 1 meeple: player picks 2 tokens
        const meeplePlayer = meeples.getItem()?.id as PlayerAnimal
        this.memorize(Memory.CurrentForestTile, tileIndex)
        moves.push(this.startPlayerTurn(RuleId.ChooseTokens, meeplePlayer))
        return moves
      }
    }

    // All tiles resolved: go to notebook phase
    moves.push(...this.startNotebookPhase())
    return moves
  }

  startNotebookPhase(): MaterialMove[] {
    // Start from last player, counter-clockwise
    const firstPlayer = this.remind<PlayerAnimal>(Memory.FirstPlayer)
    const lastPlayer = this.helper.getPreviousPlayer(firstPlayer)
    return [this.startPlayerTurn(RuleId.PlaceNotebook, lastPlayer)]
  }
}
