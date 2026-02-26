import { isCustomMoveType, isMoveItemType, MaterialGame, MaterialMove, RandomBot } from '@gamepark/rules-api'
import { AmaniteRules } from './AmaniteRules'
import { LocationType } from './material/LocationType'
import { LotZone } from './material/LotZone'
import { MaterialType } from './material/MaterialType'
import { getStartCardMushrooms } from './material/StartCard'
import { PlayerAnimal } from './PlayerAnimal'
import { CustomMoveType } from './rules/CustomMoveType'
import { Memory } from './rules/Memory'
import { RuleId } from './rules/RuleId'

export class AmaniteBot extends RandomBot<MaterialGame<PlayerAnimal, MaterialType, LocationType>, MaterialMove<PlayerAnimal, MaterialType, LocationType>, PlayerAnimal> {
  constructor(playerId: PlayerAnimal) {
    super(AmaniteRules, playerId)
  }

  override getLegalMoves(game: MaterialGame<PlayerAnimal, MaterialType, LocationType>): MaterialMove<PlayerAnimal, MaterialType, LocationType>[] {
    const legalMoves = super.getLegalMoves(game)
    if (game.rule?.id === RuleId.SplitTokens) {
      return this.getSplitMoves(legalMoves, game)
    }
    return legalMoves
  }

  private getSplitMoves(legalMoves: MaterialMove[], game: MaterialGame): MaterialMove[] {
    // Get current tile from memory (not all tiles!)
    const currentTile = game.memory?.[Memory.CurrentForestTile] ?? 0

    const tokens = game.items[MaterialType.RoundToken]?.filter(
      item => item?.location?.type === LocationType.ForestTileTokens
        && item?.location?.parent === currentTile
    ) ?? []
    const topCount = tokens.filter(item => item?.location?.id === LotZone.Top).length
    const bottomCount = tokens.filter(item => item?.location?.id === LotZone.Bottom).length
    const total = topCount + bottomCount
    const targetBottom = Math.floor(total / 2)

    // Reached target split: confirm
    if (bottomCount >= targetBottom) {
      const confirmMoves = legalMoves.filter(move => isCustomMoveType(CustomMoveType.ConfirmSplit)(move))
      if (confirmMoves.length > 0) return confirmMoves
    }

    // Get my preferred mushroom colors from start card
    const myStartCard = game.items[MaterialType.StartCard]?.find(
      item => item?.id === this.player
    )
    const side = myStartCard?.location?.rotation ?? 0
    const myColors = new Set(getStartCardMushrooms(this.player as PlayerAnimal, side))

    // Move tokens down: prefer tokens I DON'T want (keep wanted ones on top for me)
    const moveDownMoves = legalMoves.filter(move =>
      isMoveItemType(MaterialType.RoundToken)(move) && move.location.id === LotZone.Bottom
    )

    if (moveDownMoves.length === 0) {
      return legalMoves.filter(move => isCustomMoveType(CustomMoveType.ConfirmSplit)(move))
    }

    // Find the token id (mushroom color) for each move
    const unwantedMoves = moveDownMoves.filter(move => {
      if (!isMoveItemType(MaterialType.RoundToken)(move)) return false
      const token = game.items[MaterialType.RoundToken]?.[move.itemIndex]
      return token && !myColors.has(token.id)
    })

    // Prefer moving unwanted tokens down; fallback to any if all remaining are wanted
    return unwantedMoves.length > 0 ? unwantedMoves : moveDownMoves
  }
}
