import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { isMushroomToken } from '../material/RoundTokenId'
import { PlayerAnimal } from '../PlayerAnimal'
import { GameHelper } from './helper/GameHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class DiscardForPigRule extends PlayerTurnRule {
  helper = new GameHelper(this.game)

  onRuleStart(): MaterialMove[] {
    // If player has no mushroom tokens to discard, skip
    const player = this.player as PlayerAnimal
    const mushroomTokens = this.helper.getPlayerTokens(player)
      .filter(item => isMushroomToken(item.id))

    if (mushroomTokens.length === 0) {
      return this.continueAfterDiscard()
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
    return this.continueAfterDiscard()
  }

  private continueAfterDiscard(): MaterialMove[] {
    const moves: MaterialMove[] = []
    const pigsRemaining = this.remind<number>(Memory.PigsToDiscard) - 1

    if (pigsRemaining > 0) {
      this.memorize(Memory.PigsToDiscard, pigsRemaining)
      // Check if player still has mushroom tokens to discard
      const player = this.player as PlayerAnimal
      const mushroomTokens = this.helper.getPlayerTokens(player)
        .filter(item => isMushroomToken(item.id))
      if (mushroomTokens.length === 0) {
        return this.continueAfterDiscard()
      }
      return moves
    }

    this.forget(Memory.PigsToDiscard)

    // Check if there's a second player's pigs to handle
    const nextPlayer = this.remind<PlayerAnimal | undefined>(Memory.NextPigPlayer)
    if (nextPlayer) {
      const nextPigs = this.remind<number>(Memory.NextPigsToDiscard)
      this.forget(Memory.NextPigPlayer)
      this.forget(Memory.NextPigsToDiscard)
      this.memorize(Memory.PigsToDiscard, nextPigs)
      moves.push(this.startPlayerTurn(RuleId.DiscardForPig, nextPlayer))
      return moves
    }

    moves.push(this.startRule(RuleId.Harvest))
    return moves
  }
}
