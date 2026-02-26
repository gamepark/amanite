import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { isPig } from '../material/RoundTokenId'
import { PlayerAnimal } from '../PlayerAnimal'
import { GameHelper } from './helper/GameHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class ChooseTokensRule extends PlayerTurnRule {
  helper = new GameHelper(this.game)

  get tileIndex(): number {
    return this.remind<number>(Memory.CurrentForestTile)
  }

  getPlayerMoves(): MaterialMove[] {
    const tileIndex = this.tileIndex
    const tokens = this.helper.getForestTileTokens(tileIndex)

    // Player picks exactly 2 tokens (one at a time)
    return tokens.moveItems({
      type: LocationType.PlayerTokens,
      player: this.player
    })
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isMoveItemType(MaterialType.RoundToken)(move)) return []
    if (move.location.type !== LocationType.PlayerTokens) return []

    const picked = (this.remind<number>(Memory.TokensChosen) ?? 0) + 1
    this.memorize(Memory.TokensChosen, picked)

    // Track if the picked token is a pig
    const movedItem = this.material(MaterialType.RoundToken).index(move.itemIndex).getItem()
    if (movedItem && isPig(movedItem.id)) {
      const pigsPicked = (this.remind<number>(Memory.PigsPicked) ?? 0) + 1
      this.memorize(Memory.PigsPicked, pigsPicked)
    }

    if (picked >= 2) {
      const moves: MaterialMove[] = []
      const tileIndex = this.tileIndex

      // Return remaining tokens to bag
      const remainingTokens = this.helper.getForestTileTokens(tileIndex)
      moves.push(...remainingTokens.moveItems({ type: LocationType.Bag }))

      // Return meeple to stock
      const meeple = this.helper.getForestTileMeeples(tileIndex)
      const player = this.player as PlayerAnimal
      moves.push(...meeple.moveItems({ type: LocationType.PlayerMeepleStock, player }))

      // Clean up counters
      const pigCount = this.remind<number>(Memory.PigsPicked) ?? 0
      this.forget(Memory.TokensChosen)
      this.forget(Memory.PigsPicked)

      if (pigCount > 0) {
        this.memorize(Memory.PigsToDiscard, pigCount)
        moves.push(this.startPlayerTurn(RuleId.DiscardForPig, player))
        return moves
      }

      // Continue harvest
      moves.push(this.startRule(RuleId.Harvest))
      return moves
    }

    return []
  }
}
