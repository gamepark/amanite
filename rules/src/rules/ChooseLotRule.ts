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
      this.customMove(CustomMoveType.ChooseLot, 'top'),
      this.customMove(CustomMoveType.ChooseLot, 'bottom')
    ]
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    if (!isCustomMoveType(CustomMoveType.ChooseLot)(move)) return []

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
    const firstPlayerLotTokens = chosenSide === 'top' ? lotTop : lotBottom
    const secondPlayerLotTokens = chosenSide === 'top' ? lotBottom : lotTop

    // Log custom moves with player + token ids
    moves.push(this.customMove(CustomMoveType.LogTokensCollected, { player: firstPlayer, tokens: firstPlayerLotTokens.getItems().map(i => i.id) }))
    moves.push(this.customMove(CustomMoveType.LogTokensCollected, { player: secondPlayer, tokens: secondPlayerLotTokens.getItems().map(i => i.id) }))

    moves.push(firstPlayerLotTokens.moveItemsAtOnce({ type: LocationType.PlayerTokens, player: firstPlayer }))
    moves.push(secondPlayerLotTokens.moveItemsAtOnce({ type: LocationType.PlayerTokens, player: secondPlayer }))

    // Return meeples to stock
    moves.push(...firstMeeple.moveItems({ type: LocationType.PlayerMeepleStock, player: firstPlayer }))
    moves.push(...secondMeeple.moveItems({ type: LocationType.PlayerMeepleStock, player: secondPlayer }))

    // Count pigs in the lots (before moves are applied)
    const firstPlayerPigs = firstPlayerLotTokens.filter(item => isPig(item.id)).length
    const secondPlayerPigs = secondPlayerLotTokens.filter(item => isPig(item.id)).length

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
