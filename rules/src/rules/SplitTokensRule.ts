import { CustomMove, isCustomMoveType, isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { LotZone } from '../material/LotZone'
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

    // Move tokens from top lot to bottom lot
    const topLot = this.helper.getLotTop(tileIndex)
    moves.push(
      ...topLot.moveItems({
        type: LocationType.ForestTileTokens,
        parent: tileIndex,
        id: LotZone.Bottom
      })
    )

    // Move tokens back from bottom lot to top lot
    const bottomLot = this.helper.getLotBottom(tileIndex)
    moves.push(
      ...bottomLot.moveItems({
        type: LocationType.ForestTileTokens,
        parent: tileIndex,
        id: LotZone.Top
      })
    )

    // Confirm split button (only if both lots have at least 1)
    const topCount = topLot.length
    const bottomCount = bottomLot.length
    if (topCount >= 1 && bottomCount >= 1) {
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
      // Tokens are already split: top lot (id=LotZone.Top) and bottom lot (id=LotZone.Bottom)
      // No move needed — return to meeple placement (next player)
      return this.getNextPlayerMoves()
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
