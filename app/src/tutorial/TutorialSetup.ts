import { AmaniteSetup } from '@gamepark/amanite/AmaniteSetup'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { LotZone } from '@gamepark/amanite/material/LotZone'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { MushroomColor, mushroomColors } from '@gamepark/amanite/material/MushroomColor'
import { Pig, MUSHROOM_TOKENS_PER_COLOR, PIG_TOKEN_COUNT } from '@gamepark/amanite/material/RoundTokenId'
import { getStartCardMushrooms } from '@gamepark/amanite/material/StartCard'
import { ValueType } from '@gamepark/amanite/material/ValueType'
import { Memory } from '@gamepark/amanite/rules/Memory'
import { RuleId } from '@gamepark/amanite/rules/RuleId'
import { shuffle } from 'es-toolkit/compat'


export const me = PlayerAnimal.Fox
export const opponent = PlayerAnimal.Squirrel

export class TutorialSetup extends AmaniteSetup {

  /**
   * Tutorial-friendly mapping: fox always sees the same 3 values (+3, +2, -1)
   * matching the i18n text, but the assignment among fox's 3 visible colors
   * is shuffled — and the same for the 3 other colors (with +1, Antidote, Poison).
   * This way the player still has to deduce which color has which value.
   */
  setupValueCardsAndClues() {
    const foxClues = getStartCardMushrooms(me, 0)            // [Blue, Yellow, Red]
    const squirrelClues = getStartCardMushrooms(opponent, 0) // [Blue, Purple, White]

    const otherColors = mushroomColors.filter(c => !foxClues.includes(c))
    const foxVisibleValues = shuffle([ValueType.Value3, ValueType.Value2, ValueType.Minus1])
    const otherValues = shuffle([ValueType.Value1, ValueType.Antidote, ValueType.Poison])

    const colorToValue = {} as Record<MushroomColor, ValueType>
    foxClues.forEach((color, i) => colorToValue[color] = foxVisibleValues[i])
    otherColors.forEach((color, i) => colorToValue[color] = otherValues[i])

    const valueSlotOrder: ValueType[] = [
      ValueType.Value3, ValueType.Value2, ValueType.Value1,
      ValueType.Minus1, ValueType.Antidote, ValueType.Poison
    ]
    valueSlotOrder.forEach((value, i) => {
      this.material(MaterialType.ValueCard).createItem({
        id: value,
        location: { type: LocationType.ValueCardSlot, x: i }
      })
    })

    for (const color of mushroomColors) {
      const value = colorToValue[color]

      let dealt = 0
      if (foxClues.includes(color)) dealt++
      if (squirrelClues.includes(color)) dealt++

      for (let j = 0; j < 6 - dealt; j++) {
        this.material(MaterialType.ClueCard).createItem({
          id: value,
          location: { type: LocationType.ClueDeck, id: color, x: j }
        })
      }

      if (foxClues.includes(color)) {
        this.material(MaterialType.ClueCard).createItem({
          id: value,
          location: { type: LocationType.PlayerClueCards, player: me, rotation: true }
        })
      }
      if (squirrelClues.includes(color)) {
        this.material(MaterialType.ClueCard).createItem({
          id: value,
          location: { type: LocationType.PlayerClueCards, player: opponent, rotation: true }
        })
      }
    }

    // Shuffle each player's clue cards so the order doesn't reveal which mushroom each came from
    this.material(MaterialType.ClueCard).location(LocationType.PlayerClueCards).player(me).shuffle()
    this.material(MaterialType.ClueCard).location(LocationType.PlayerClueCards).player(opponent).shuffle()
  }

  /** Place specific tokens on tiles for a predictable tutorial */
  setupTokenBag() {
    const tileTokens: number[][] = [
      [MushroomColor.Blue, MushroomColor.Blue, MushroomColor.Yellow, MushroomColor.Red],
      [MushroomColor.Purple, MushroomColor.White, MushroomColor.Green, MushroomColor.Blue],
      [MushroomColor.Yellow, MushroomColor.Red, Pig, MushroomColor.White],
    ]

    const placedCounts: Record<number, number> = {}
    let t = 0
    for (const tileIndex of this.material(MaterialType.ForestTile).sort(item => item.location.x!).getIndexes()) {
      if (t >= tileTokens.length) break
      for (let i = 0; i < tileTokens[t].length; i++) {
        const color = tileTokens[t][i]
        this.material(MaterialType.RoundToken).createItem({
          id: color,
          location: { type: LocationType.ForestTileTokens, parent: tileIndex, x: i, id: LotZone.Top }
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
    const pigsPlaced = placedCounts[Pig] ?? 0
    for (let i = 0; i < PIG_TOKEN_COUNT - pigsPlaced; i++) {
      this.material(MaterialType.RoundToken).createItem({
        id: Pig,
        location: { type: LocationType.Bag }
      })
    }

    // Shuffle remaining tokens in bag
    this.material(MaterialType.RoundToken).location(LocationType.Bag).shuffle()
  }

  /** Force start cards on side 0 (recto) so they match getStartCardMushrooms(player, 0) */
  setupPlayers() {
    for (const player of this.players) {
      this.material(MaterialType.StartCard).createItem({
        id: player,
        location: { type: LocationType.PlayerStartCard, player, rotation: 0 }
      })
      for (let i = 0; i < 2; i++) {
        this.material(MaterialType.Meeple).createItem({
          id: player,
          location: { type: LocationType.PlayerMeepleStock, player, x: i }
        })
      }
      for (let i = 0; i < 2; i++) {
        this.material(MaterialType.NotebookToken).createItem({
          id: player,
          location: { type: LocationType.PlayerNotebookStock, player, x: i }
        })
      }
    }
  }

  /** Skip PlaceNewTokens — tokens are pre-placed for a deterministic tutorial */
  start() {
    this.memorize(Memory.MeeplePlacementRound, 1)
    this.startPlayerTurn(RuleId.PlaceMeeple, me)
  }
}
