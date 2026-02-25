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
    const forestTiles = this.helper.forestTiles
      .sort(item => item.location.x!)

    for (const tileIndex of forestTiles.getIndexes()) {
      const tile = this.material(MaterialType.ForestTile).index(tileIndex).getItem()!
      const tileX = tile.location.x!

      // Check if this tile has already been resolved (no tokens and no meeples)
      const meeples = this.helper.getForestTileMeeples(tileIndex)
      const tokensMain = this.helper.getForestTileTokens(tileIndex)
      const lotLeft = this.helper.getLotLeft(tileIndex)
      const lotRight = this.helper.getLotRight(tileIndex)
      const totalTokens = tokensMain.length + lotLeft.length + lotRight.length

      if (meeples.length === 0 && totalTokens === 0) continue

      if (meeples.length === 0 && totalTokens > 0) {
        // No meeples: return all tokens to bag
        const moves: MaterialMove[] = []
        moves.push(...tokensMain.moveItems({ type: LocationType.Bag }))
        moves.push(...lotLeft.moveItems({ type: LocationType.Bag }))
        moves.push(...lotRight.moveItems({ type: LocationType.Bag }))
        // Continue to next tile
        return [...moves, ...this.resolveNextTileAfter(tileX)]
      }

      if (meeples.length === 2) {
        // 2 meeples: first player (spot x=0) chooses lot
        const firstMeeple = meeples.filter(item => item.location.x === 0)
        const firstPlayer = firstMeeple.getItem()?.id as PlayerAnimal
        this.memorize(Memory.CurrentForestTile, tileIndex)
        return [this.startPlayerTurn(RuleId.ChooseLot, firstPlayer)]
      }

      if (meeples.length === 1) {
        // 1 meeple: player picks 2 tokens
        const meeplePlayer = meeples.getItem()?.id as PlayerAnimal
        this.memorize(Memory.CurrentForestTile, tileIndex)
        return [this.startPlayerTurn(RuleId.ChooseTokens, meeplePlayer)]
      }
    }

    // All tiles resolved: go to notebook phase
    return this.startNotebookPhase()
  }

  resolveNextTileAfter(_tileX: number): MaterialMove[] {
    // Recursively check next tile
    return this.resolveNextTile()
  }

  startNotebookPhase(): MaterialMove[] {
    // Start from last player, counter-clockwise
    const firstPlayer = this.remind<PlayerAnimal>(Memory.FirstPlayer)
    const lastPlayer = this.helper.getPreviousPlayer(firstPlayer)
    return [this.startPlayerTurn(RuleId.PlaceNotebook, lastPlayer)]
  }
}
