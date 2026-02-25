import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'

export class FinalScoringRule extends PlayerTurnRule {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []

    // Reveal the 1st clue card of each deck on mushroom cards (rotation = 1)
    const mushrooms = this.material(MaterialType.MushroomCard).location(LocationType.MushroomCardRow)
    for (const mushroomIndex of mushrooms.getIndexes()) {
      const clueDeck = this.material(MaterialType.ClueCard)
        .location(LocationType.ClueDeck)
        .parent(mushroomIndex)

      if (clueDeck.length > 0) {
        const topCard = clueDeck.maxBy(item => item.location.x!)
        moves.push(...topCard.rotateItems(() => 1))
      }
    }

    moves.push(this.endGame())
    return moves
  }

  getPlayerMoves(): MaterialMove[] {
    return []
  }
}
