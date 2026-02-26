import { MaterialDeck, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { getStartCardMushrooms } from '../material/StartCard'
import { PlayerAnimal } from '../PlayerAnimal'
import { RuleId } from './RuleId'

export class DealInitialCluesRule extends MaterialRulesPart {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []

    // Build deck objects per mushroom so successive deals pick different cards
    const clueDecks = new Map<number, MaterialDeck<PlayerAnimal, MaterialType, LocationType>>()
    for (const mushroomCard of this.material(MaterialType.MushroomCard).getIndexes()) {
      clueDecks.set(
        mushroomCard,
        this.material(MaterialType.ClueCard).location(LocationType.ClueDeck).parent(mushroomCard).deck()
      )
    }

    for (const player of this.game.players) {
      this.dealInitialClues(player, moves, clueDecks)
    }

    moves.push(this.startRule(RuleId.RevealClues))
    return moves
  }

  private dealInitialClues(
    player: PlayerAnimal,
    moves: MaterialMove[],
    clueDecks: Map<number, MaterialDeck<PlayerAnimal, MaterialType, LocationType>>
  ) {
    const startCard = this.material(MaterialType.StartCard)
      .location(LocationType.PlayerStartCard)
      .player(player)
      .getItem()

    const side = startCard?.location.rotation ?? 0
    const mushrooms = getStartCardMushrooms(player, side)

    for (const mushroomColor of mushrooms) {
      const mushroomCardIndex = this.material(MaterialType.MushroomCard)
        .id(mushroomColor)
        .getIndex()

      const deck = clueDecks.get(mushroomCardIndex)
      if (deck && deck.length > 0) {
        moves.push(deck.dealOne({ type: LocationType.PlayerClueCards, player, rotation: false }))
      }
    }

  }
}
