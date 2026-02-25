import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { TOKENS_PER_TILE_PER_ROUND } from '../material/RoundTokenId'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PlaceNewTokensRule extends PlayerTurnRule {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []
    const round = this.remind<number>(Memory.Round)
    const tokensPerTile = TOKENS_PER_TILE_PER_ROUND[round] ?? 4

    // Get all forest tiles
    const forestTiles = this.material(MaterialType.ForestTile)
      .location(LocationType.ForestTileRow)
      .sort(item => item.location.x!)

    // deck() tracks dealt items internally so successive deal() calls pick different tokens
    const bagDeck = this.material(MaterialType.RoundToken).location(LocationType.Bag).deck()

    for (const tile of forestTiles.getIndexes()) {
      moves.push(
        ...bagDeck.deal({
          type: LocationType.ForestTileTokens,
          parent: tile
        }, tokensPerTile)
      )
    }

    this.memorize(Memory.MeeplePlacementRound, 1)
    moves.push(this.startPlayerTurn(RuleId.PlaceMeeple, this.remind(Memory.FirstPlayer)))
    return moves
  }

  getPlayerMoves(): MaterialMove[] {
    return []
  }
}
