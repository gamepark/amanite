import { CustomMove, isCustomMoveType, isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType } from './CustomMoveType'
import { Memory } from './Memory'
import { RuleId } from './RuleId'
import { GameHelper } from './helper/GameHelper'
import { PlayerAnimal } from '../PlayerAnimal'

export class SplitTokensRule extends PlayerTurnRule {
  helper = new GameHelper(this.game)

  get tileIndex(): number {
    return this.remind<number>(Memory.CurrentForestTile)
  }

  getPlayerMoves(): MaterialMove[] {
    const moves: MaterialMove[] = []
    const tileIndex = this.tileIndex

    // Move tokens from main pile to right lot
    const mainTokens = this.helper.getForestTileTokens(tileIndex)
    moves.push(
      ...mainTokens.moveItems({
        type: LocationType.ForestTileLotRight,
        parent: tileIndex
      })
    )

    // Move tokens back from right lot to main pile
    const rightLot = this.helper.getLotRight(tileIndex)
    moves.push(
      ...rightLot.moveItems({
        type: LocationType.ForestTileTokens,
        parent: tileIndex
      })
    )

    // Confirm split button (only if both lots have at least 1)
    const mainCount = mainTokens.length
    const rightCount = rightLot.length
    if (mainCount >= 1 && rightCount >= 1) {
      moves.push(this.customMove(CustomMoveType.ConfirmSplit))
    }

    return moves
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (isMoveItemType(MaterialType.RoundToken)(move)) {
      // Token moved, stay in split mode
    }
    return []
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    if (isCustomMoveType(CustomMoveType.ConfirmSplit)(move)) {
      const tileIndex = this.tileIndex
      const moves: MaterialMove[] = []

      // Move remaining main pile tokens to left lot
      const mainTokens = this.helper.getForestTileTokens(tileIndex)
      moves.push(
        ...mainTokens.moveItems({
          type: LocationType.ForestTileLotLeft,
          parent: tileIndex
        })
      )

      // Return to meeple placement (next player)
      moves.push(...this.getNextPlayerMoves())
      return moves
    }
    return []
  }

  private getNextPlayerMoves(): MaterialMove[] {
    const currentPlayer = this.player as PlayerAnimal
    const helper = this.helper
    const nextPlayer = helper.getNextPlayer(currentPlayer)
    const placementRound = this.remind<number>(Memory.MeeplePlacementRound)

    // Check if all players have placed this round
    const expectedInStock = 2 - placementRound
    const allPlaced = this.game.players.every(player => {
      return helper.getPlayerMeeples(player).length <= expectedInStock
    })

    if (!allPlaced) {
      return [this.startPlayerTurn(RuleId.PlaceMeeple, nextPlayer)]
    }

    if (placementRound === 1) {
      this.memorize(Memory.MeeplePlacementRound, 2)
      const firstPlayer = this.remind<PlayerAnimal>(Memory.FirstPlayer)
      return [this.startPlayerTurn(RuleId.PlaceMeeple, firstPlayer)]
    }

    this.memorize(Memory.CurrentForestTile, 0)
    return [this.startRule(RuleId.Harvest)]
  }
}
