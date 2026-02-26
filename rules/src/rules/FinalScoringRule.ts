import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'

export class FinalScoringRule extends PlayerTurnRule {
  onRuleStart(): MaterialMove[] {
    // Collect top clue card indexes from each mushroom deck
    const topCardIndexes: number[] = []
    const mushrooms = this.material(MaterialType.MushroomCard).location(LocationType.MushroomCardRow)
    for (const mushroomIndex of mushrooms.getIndexes()) {
      const clueDeck = this.material(MaterialType.ClueCard)
        .location(LocationType.ClueDeck)
        .parent(mushroomIndex)

      if (clueDeck.length > 0) {
        const topCard = clueDeck.maxBy(item => item.location.x!)
        topCardIndexes.push(...topCard.getIndexes())
      }
    }

    // Reveal all top cards at once
    const moves: MaterialMove[] = []
    if (topCardIndexes.length > 0) {
      moves.push(
        this.material(MaterialType.ClueCard)
          .index(index => topCardIndexes.includes(index))
          .moveItemsAtOnce({ rotation: true })
      )
    }

    moves.push(this.endGame())
    return moves
  }

  getPlayerMoves(): MaterialMove[] {
    return []
  }
}
