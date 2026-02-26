import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerAnimal } from '../PlayerAnimal'
import { GameHelper } from './helper/GameHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PlaceNotebookRule extends PlayerTurnRule {
  helper = new GameHelper(this.game)

  onRuleStart(): MaterialMove[] {
    const player = this.player as PlayerAnimal
    const notebooks = this.helper.getPlayerNotebooks(player)
    if (notebooks.length === 0) {
      return this.nextPlayerOrEndRound()
    }
    return []
  }

  getPlayerMoves(): MaterialMove[] {
    const player = this.player as PlayerAnimal
    const notebooks = this.helper.getPlayerNotebooks(player)

    if (notebooks.length === 0) return []

    const moves: MaterialMove[] = []
    const mushrooms = this.material(MaterialType.MushroomCard)
      .location(LocationType.MushroomCardRow)

    // For each mushroom card, check if there's an available notebook slot
    for (const mushroomIndex of mushrooms.getIndexes()) {
      const maxSlots = this.helper.notebookSlotsPerMushroom

      // Count notebooks already on this mushroom
      const existingNotebooks = this.material(MaterialType.NotebookToken)
        .location(LocationType.NotebookSlot)
        .filter(item => item.location.id === mushroomIndex)

      if (existingNotebooks.length < maxSlots) {
        // Check if this mushroom still has clue cards
        const clueDeck = this.material(MaterialType.ClueCard)
          .location(LocationType.ClueDeck)
          .parent(mushroomIndex)

        if (clueDeck.length > 0) {
          moves.push(
            ...notebooks.moveItems({
              type: LocationType.NotebookSlot,
              id: mushroomIndex,
              x: existingNotebooks.length
            })
          )
        }
      }
    }

    return moves
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isMoveItemType(MaterialType.NotebookToken)(move)) return []

    const moves: MaterialMove[] = []
    const mushroomIndex = move.location.id!

    // Draw 1 clue card from this mushroom's deck
    const clueDeck = this.material(MaterialType.ClueCard)
      .location(LocationType.ClueDeck)
      .parent(mushroomIndex)

    if (clueDeck.length > 0) {
      const topCard = clueDeck.maxBy(item => item.location.x!)
      moves.push(
        ...topCard.moveItems({
          type: LocationType.PlayerClueCards,
          player: this.player,
          rotation: true
        })
      )
    }

    // Next player (counter-clockwise) or end round
    return [...moves, ...this.nextPlayerOrEndRound()]
  }

  private nextPlayerOrEndRound(): MaterialMove[] {
    const firstPlayer = this.remind<PlayerAnimal>(Memory.FirstPlayer)
    let candidate = this.player as PlayerAnimal

    // Walk counter-clockwise through all remaining players
    for (let i = 0; i < this.game.players.length; i++) {
      if (candidate === firstPlayer) {
        return [this.startRule(RuleId.EndRound)]
      }
      candidate = this.helper.getPreviousPlayer(candidate)
      const notebooks = this.helper.getPlayerNotebooks(candidate)
      if (notebooks.length > 0) {
        return [this.startPlayerTurn(RuleId.PlaceNotebook, candidate)]
      }
    }

    return [this.startRule(RuleId.EndRound)]
  }
}
