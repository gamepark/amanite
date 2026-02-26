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

  onRuleStart(): MaterialMove[] {
    // If player has no mushroom tokens to discard, auto-discard the pig
    const player = this.player as PlayerAnimal
    const mushroomTokens = this.helper.getPlayerTokens(player)
      .filter(item => isMushroomToken(item.id))

    if (mushroomTokens.length === 0) {
      return this.discardPigAndContinue()
    }
    return []
  }

  getPlayerMoves(): MaterialMove[] {
    const player = this.player as PlayerAnimal
    return this.helper.getPlayerTokens(player)
      .filter(item => isMushroomToken(item.id))
      .moveItems({ type: LocationType.TokenDiscard })
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isMoveItemType(MaterialType.RoundToken)(move)) return []
    return this.discardPigAndContinue()
  }

  private discardPigAndContinue(): MaterialMove[] {
    const moves: MaterialMove[] = []
    let pigsRemaining = this.remind<number>(Memory.PigsToDiscard) - 1

    const player = this.player as PlayerAnimal
    const pigToken = this.helper.getPlayerTokens(player)
      .filter(item => isPig(item.id))
      .limit(1)

    if (pigToken.length > 0) {
      moves.push(...pigToken.moveItems({ type: LocationType.TokenDiscard }))
    }

    if (pigsRemaining > 0) {
      this.memorize(Memory.PigsToDiscard, pigsRemaining)
      return moves
    }

    this.forget(Memory.PigsToDiscard)
    moves.push(this.startRule(RuleId.Harvest))
    return moves
  }
}
