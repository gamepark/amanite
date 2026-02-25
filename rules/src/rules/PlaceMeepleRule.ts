import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerAnimal } from '../PlayerAnimal'
import { GameHelper } from './helper/GameHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PlaceMeepleRule extends PlayerTurnRule {
  helper = new GameHelper(this.game)

  getPlayerMoves(): MaterialMove[] {
    const moves: MaterialMove[] = []
    const playerMeeples = this.helper.getPlayerMeeples(this.player as PlayerAnimal)

    if (playerMeeples.length === 0) return moves

    // For each forest tile, determine if and where the player can place
    const forestTiles = this.helper.forestTiles

    for (const tileIndex of forestTiles.getIndexes()) {
      const meeplesOnTile = this.helper.getForestTileMeeples(tileIndex)
      const playerAlreadyOnTile = meeplesOnTile.id(this.player).length > 0

      // Can't place on a tile where you already have a meeple
      if (playerAlreadyOnTile) continue

      const meepleCount = meeplesOnTile.length

      if (meepleCount === 0) {
        // Empty tile: must place on first spot (x=0)
        moves.push(
          ...playerMeeples.limit(1).moveItems({
            type: LocationType.ForestTileMeepleSpot,
            parent: tileIndex,
            x: 0
          })
        )
      } else if (meepleCount === 1) {
        // One meeple already: must place on second spot (x=1)
        moves.push(
          ...playerMeeples.limit(1).moveItems({
            type: LocationType.ForestTileMeepleSpot,
            parent: tileIndex,
            x: 1
          })
        )
      }
      // 2 meeples: tile is full, can't place
    }

    return moves
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isMoveItemType(MaterialType.Meeple)(move)) return []

    // If placed on second spot (x=1), trigger split
    if (move.location.x === 1) {
      this.memorize(Memory.CurrentForestTile, move.location.parent)
      return [this.startRule(RuleId.SplitTokens)]
    }

    return this.nextPlayerOrPhase()
  }

  nextPlayerOrPhase(): MaterialMove[] {
    const currentPlayer = this.player as PlayerAnimal
    const nextPlayer = this.helper.getNextPlayer(currentPlayer)
    const placementRound = this.remind<number>(Memory.MeeplePlacementRound)

    // Check if all players have placed in this round
    // A player has placed if they have fewer meeples in stock than expected
    const expectedInStock = 2 - placementRound
    const allPlaced = this.game.players.every(player => {
      return this.helper.getPlayerMeeples(player).length <= expectedInStock
    })

    if (!allPlaced) {
      // Next player's turn
      return [this.startPlayerTurn(RuleId.PlaceMeeple, nextPlayer)]
    }

    if (placementRound === 1) {
      // Start second placement round
      this.memorize(Memory.MeeplePlacementRound, 2)
      const firstPlayer = this.remind<PlayerAnimal>(Memory.FirstPlayer)
      return [this.startPlayerTurn(RuleId.PlaceMeeple, firstPlayer)]
    }

    // Both rounds done: start harvest
    this.memorize(Memory.CurrentForestTile, 0)
    return [this.startRule(RuleId.Harvest)]
  }
}
