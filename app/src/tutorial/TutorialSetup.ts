import { AmaniteSetup } from '@gamepark/amanite/AmaniteSetup'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { MushroomColor, mushroomColors } from '@gamepark/amanite/material/MushroomColor'
import { Pig, MUSHROOM_TOKENS_PER_COLOR, PIG_TOKEN_COUNT } from '@gamepark/amanite/material/RoundTokenId'
import { getStartCardMushrooms } from '@gamepark/amanite/material/StartCard'
import { ValueType } from '@gamepark/amanite/material/ValueType'
import { Memory } from '@gamepark/amanite/rules/Memory'
import { RuleId } from '@gamepark/amanite/rules/RuleId'

export const me = PlayerAnimal.Fox
export const opponent = PlayerAnimal.Squirrel

export class TutorialSetup extends AmaniteSetup {

  /** Fixed value mapping for deterministic tutorial */
  setupValueCardsAndClues() {
    const fixedMapping: [MushroomColor, ValueType][] = [
      [MushroomColor.Blue, ValueType.Value3],      // +3 per token
      [MushroomColor.Yellow, ValueType.Value2],     // +2 per token
      [MushroomColor.Purple, ValueType.Value1],     // +1 per token
      [MushroomColor.Red, ValueType.Minus1],        // -1 per token
      [MushroomColor.White, ValueType.Antidote],
      [MushroomColor.Green, ValueType.Poison],
    ]

    const mapping: Record<number, ValueType> = {}
    const foxClues = getStartCardMushrooms(me, 0)         // [Blue, Yellow, Red]
    const squirrelClues = getStartCardMushrooms(opponent, 0) // [Blue, Purple, White]

    for (let i = 0; i < fixedMapping.length; i++) {
      const [color, value] = fixedMapping[i]

      mapping[color] = value
      const mushroomIndex = this.material(MaterialType.MushroomCard).id(color).getIndex()

      this.material(MaterialType.ValueCard).createItem({
        id: value,
        location: { type: LocationType.ValueCardSlot, x: i }
      })

      // Deal clues directly to players' hands, rest to deck
      let dealt = 0
      if (foxClues.includes(color)) dealt++
      if (squirrelClues.includes(color)) dealt++

      for (let j = 0; j < 6 - dealt; j++) {
        this.material(MaterialType.ClueCard).createItem({
          id: value,
          location: { type: LocationType.ClueDeck, parent: mushroomIndex, x: j }
        })
      }

      if (foxClues.includes(color)) {
        this.material(MaterialType.ClueCard).createItem({
          id: value,
          location: { type: LocationType.PlayerClueCards, player: me }
        })
      }
      if (squirrelClues.includes(color)) {
        this.material(MaterialType.ClueCard).createItem({
          id: value,
          location: { type: LocationType.PlayerClueCards, player: opponent }
        })
      }
    }

    this.memorize(Memory.MushroomValueMapping, mapping)

    // Shuffle each player's clue cards so the order doesn't reveal which mushroom each came from
    this.material(MaterialType.ClueCard).location(LocationType.PlayerClueCards).player(me).shuffle()
    this.material(MaterialType.ClueCard).location(LocationType.PlayerClueCards).player(opponent).shuffle()
  }

  /** Place specific tokens on tiles for a predictable tutorial */
  setupTokenBag() {
    const tileTokens: MushroomColor[][] = [
      [MushroomColor.Blue, MushroomColor.Blue, MushroomColor.Yellow, MushroomColor.Red],
      [MushroomColor.Purple, MushroomColor.White, MushroomColor.Green, MushroomColor.Blue],
      [MushroomColor.Yellow, MushroomColor.Red, MushroomColor.Green, MushroomColor.White],
    ]

    const placedCounts: Record<number, number> = {}
    let t = 0
    for (const tileIndex of this.material(MaterialType.ForestTile).sort(item => item.location.x!).getIndexes()) {
      if (t >= tileTokens.length) break
      for (let i = 0; i < tileTokens[t].length; i++) {
        const color = tileTokens[t][i]
        this.material(MaterialType.RoundToken).createItem({
          id: color,
          location: { type: LocationType.ForestTileTokens, parent: tileIndex, x: i }
        })
        placedCounts[color] = (placedCounts[color] ?? 0) + 1
      }
      t++
    }

    // Remaining tokens in bag
    for (const color of mushroomColors) {
      const placed = placedCounts[color] ?? 0
      for (let i = 0; i < MUSHROOM_TOKENS_PER_COLOR - placed; i++) {
        this.material(MaterialType.RoundToken).createItem({
          id: color,
          location: { type: LocationType.Bag }
        })
      }
    }
    for (let i = 0; i < PIG_TOKEN_COUNT; i++) {
      this.material(MaterialType.RoundToken).createItem({
        id: Pig,
        location: { type: LocationType.Bag }
      })
    }

    // Shuffle remaining tokens in bag
    this.material(MaterialType.RoundToken).location(LocationType.Bag).shuffle()
  }

  /** Skip ChooseStartCardSide + DealInitialClues + PlaceNewTokens */
  start() {
    this.memorize(Memory.MeeplePlacementRound, 1)
    this.startPlayerTurn(RuleId.PlaceMeeple, me)
  }
}
