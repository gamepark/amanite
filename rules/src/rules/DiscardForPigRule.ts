import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { isPig, isMushroomToken } from '../material/RoundTokenId'
import { PlayerAnimal } from '../PlayerAnimal'
import { GameHelper } from './helper/GameHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class DiscardForPigRule extends PlayerTurnRule {
  helper = new GameHelper(this.game)

  getPlayerMoves(): MaterialMove[] {
    // Player must discard 1 mushroom token (not pig) from their collection
    const player = this.player as PlayerAnimal
    return this.helper.getPlayerTokens(player)
      .filter(item => isMushroomToken(item.id))
      .moveItems({ type: LocationType.TokenDiscard })
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isMoveItemType(MaterialType.RoundToken)(move)) return []

    const moves: MaterialMove[] = []
    let pigsRemaining = this.remind<number>(Memory.PigsToDiscard) - 1

    // Also move the pig token to discard
    const player = this.player as PlayerAnimal
    const pigToken = this.helper.getPlayerTokens(player)
      .filter(item => isPig(item.id))
      .limit(1)

    if (pigToken.length > 0) {
      moves.push(...pigToken.moveItems({ type: LocationType.TokenDiscard }))
    }

    if (pigsRemaining > 0) {
      this.memorize(Memory.PigsToDiscard, pigsRemaining)
      return moves // Stay in this rule for next pig
    }

    this.forget(Memory.PigsToDiscard)

    // Continue harvest
    moves.push(this.startRule(RuleId.Harvest))
    return moves
  }
}
