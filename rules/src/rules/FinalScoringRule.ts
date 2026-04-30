import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { mushroomColors } from '../material/MushroomColor'

export class FinalScoringRule extends PlayerTurnRule {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []

    // Reveal each clue deck's top card one at a time (left → right by mushroom layout order),
    // so the framework animates each flip sequentially.
    for (const color of mushroomColors) {
      const clueDeck = this.material(MaterialType.ClueCard)
        .location(LocationType.ClueDeck)
        .locationId(color)

      if (clueDeck.length > 0) {
        const topCard = clueDeck.maxBy(item => item.location.x!)
        moves.push(...topCard.moveItems({ rotation: true }))
      }
    }

    moves.push(this.endGame())
    return moves
  }

  getPlayerMoves(): MaterialMove[] {
    return []
  }
}
