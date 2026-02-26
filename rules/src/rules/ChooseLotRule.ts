import { CustomMove, isCustomMoveType, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { isPig } from '../material/RoundTokenId'
import { PlayerAnimal } from '../PlayerAnimal'
import { CustomMoveType } from './CustomMoveType'
import { GameHelper } from './helper/GameHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class ChooseLotRule extends PlayerTurnRule {
  helper = new GameHelper(this.game)

  get tileIndex(): number {
    return this.remind<number>(Memory.CurrentForestTile)
  }

  getPlayerMoves(): MaterialMove[] {
    // Player chooses top lot or bottom lot
    return [
      this.customMove(CustomMoveType.Pass, 'top'),
      this.customMove(CustomMoveType.Pass, 'bottom')
    ]
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    if (!isCustomMoveType(CustomMoveType.Pass)(move)) return []

    const tileIndex = this.tileIndex
    const chosenSide: string = move.data
    const moves: MaterialMove[] = []

    const meeples = this.helper.getForestTileMeeples(tileIndex)
    const firstMeeple = meeples.filter(item => item.location.x === 0)
    const secondMeeple = meeples.filter(item => item.location.x === 1)
    const firstPlayer = firstMeeple.getItem()?.id as PlayerAnimal
    const secondPlayer = secondMeeple.getItem()?.id as PlayerAnimal

    const lotTop = this.helper.getLotTop(tileIndex)
    const lotBottom = this.helper.getLotBottom(tileIndex)

    // First player gets chosen lot, second player gets the other
    if (chosenSide === 'top') {
      moves.push(lotTop.moveItemsAtOnce({ type: LocationType.PlayerTokens, player: firstPlayer }))
      moves.push(lotBottom.moveItemsAtOnce({ type: LocationType.PlayerTokens, player: secondPlayer }))
    } else {
      moves.push(lotBottom.moveItemsAtOnce({ type: LocationType.PlayerTokens, player: firstPlayer }))
      moves.push(lotTop.moveItemsAtOnce({ type: LocationType.PlayerTokens, player: secondPlayer }))
    }

    // Return meeples to stock
    moves.push(...firstMeeple.moveItems({ type: LocationType.PlayerMeepleStock, player: firstPlayer }))
    moves.push(...secondMeeple.moveItems({ type: LocationType.PlayerMeepleStock, player: secondPlayer }))

    // Count pigs in the lots (before moves are applied)
    const firstPlayerLot = chosenSide === 'top' ? lotTop : lotBottom
    const secondPlayerLot = chosenSide === 'top' ? lotBottom : lotTop
    const firstPlayerPigs = firstPlayerLot.filter(item => isPig(item.id)).length
    const secondPlayerPigs = secondPlayerLot.filter(item => isPig(item.id)).length

    if (firstPlayerPigs > 0) {
      this.memorize(Memory.PigsToDiscard, firstPlayerPigs)
      if (secondPlayerPigs > 0) {
        this.memorize(Memory.NextPigPlayer, secondPlayer)
        this.memorize(Memory.NextPigsToDiscard, secondPlayerPigs)
      }
      moves.push(this.startPlayerTurn(RuleId.DiscardForPig, firstPlayer))
      return moves
    }

    if (secondPlayerPigs > 0) {
      this.memorize(Memory.PigsToDiscard, secondPlayerPigs)
      moves.push(this.startPlayerTurn(RuleId.DiscardForPig, secondPlayer))
      return moves
    }

    // Continue harvest
    moves.push(this.startRule(RuleId.Harvest))
    return moves
  }
}
