import { MaterialGameSetup } from '@gamepark/rules-api'
import { shuffle } from 'es-toolkit/compat'
import { AmaniteOptions } from './AmaniteOptions'
import { AmaniteRules } from './AmaniteRules'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { mushroomColors } from './material/MushroomColor'
import { Pig, MUSHROOM_TOKENS_PER_COLOR, PIG_TOKEN_COUNT } from './material/RoundTokenId'
import { defaultValueCards, mandatoryValueCards, ValueType } from './material/ValueType'
import { PlayerAnimal } from './PlayerAnimal'
import { Memory } from './rules/Memory'
import { RuleId } from './rules/RuleId'

export class AmaniteSetup extends MaterialGameSetup<PlayerAnimal, MaterialType, LocationType, AmaniteOptions> {
  Rules = AmaniteRules

  setupMaterial(options: AmaniteOptions) {
    const beginner = options.beginner !== false
    this.setupForestTiles()
    this.setupMushroomCards()
    this.setupValueCardsAndClues(beginner)
    this.setupTokenBag()
    this.setupPlayers()
    this.memorize(Memory.Round, 1)
    this.memorize(Memory.FirstPlayer, this.players[0])
  }

  start() {
    this.startSimultaneousRule(RuleId.ChooseStartCardSide)
  }

  /** Step 1: Place forest tiles (players + 1) */
  setupForestTiles() {
    const tileCount = this.players.length + 1
    for (let i = 0; i < tileCount; i++) {
      this.material(MaterialType.ForestTile).createItem({
        id: i + 1, // ForestTile1 to ForestTile5
        location: { type: LocationType.ForestTileRow, x: i }
      })
    }
  }

  /** Step 2: Place 6 mushroom cards */
  setupMushroomCards() {
    for (let i = 0; i < mushroomColors.length; i++) {
      this.material(MaterialType.MushroomCard).createItem({
        id: mushroomColors[i],
        location: { type: LocationType.MushroomCardRow, x: i, rotation: this.players.length > 2 }
      })
    }
  }

  /** Steps 3-9: Setup value cards (face up line), clue decks (random on mushrooms) */
  setupValueCardsAndClues(beginner: boolean) {
    const selectedValues = beginner ? defaultValueCards : this.randomValueCards()

    // Place value cards face up in a line (shows which values are in play)
    for (let i = 0; i < selectedValues.length; i++) {
      this.material(MaterialType.ValueCard).createItem({
        id: selectedValues[i],
        location: { type: LocationType.ValueCardSlot, x: i }
      })
    }

    // Shuffle assignment: which value goes to which mushroom
    const shuffledColors = shuffle([...mushroomColors])

    for (let i = 0; i < selectedValues.length; i++) {
      // Find the mushroom card for this color
      const mushroomIndex = this.material(MaterialType.MushroomCard)
        .id(shuffledColors[i])
        .getIndex()

      // Create 6 identical clue cards per value, placed on the assigned mushroom
      for (let j = 0; j < 6; j++) {
        this.material(MaterialType.ClueCard).createItem({
          id: selectedValues[i],
          location: {
            type: LocationType.ClueDeck,
            parent: mushroomIndex,
            x: j
          }
        })
      }
    }
  }

  /** Step 6: All 64 round tokens in the bag */
  setupTokenBag() {
    // 10 tokens per mushroom color
    for (const color of mushroomColors) {
      for (let i = 0; i < MUSHROOM_TOKENS_PER_COLOR; i++) {
        this.material(MaterialType.RoundToken).createItem({
          id: color,
          location: { type: LocationType.Bag }
        })
      }
    }

    // 4 pig tokens
    for (let i = 0; i < PIG_TOKEN_COUNT; i++) {
      this.material(MaterialType.RoundToken).createItem({
        id: Pig,
        location: { type: LocationType.Bag }
      })
    }

    // Shuffle the bag
    this.material(MaterialType.RoundToken).location(LocationType.Bag).shuffle()
  }

  /** Step 4: Each player gets start card, 2 meeples, 2 notebook tokens */
  setupPlayers() {
    for (const player of this.players) {
      // Start card (rotation will be chosen in ChooseStartCardSideRule)
      this.material(MaterialType.StartCard).createItem({
        id: player,
        location: { type: LocationType.PlayerStartCard, player, rotation: 0 }
      })

      // 2 meeples
      for (let i = 0; i < 2; i++) {
        this.material(MaterialType.Meeple).createItem({
          id: player,
          location: { type: LocationType.PlayerMeepleStock, player, x: i }
        })
      }

      // 2 notebook tokens
      for (let i = 0; i < 2; i++) {
        this.material(MaterialType.NotebookToken).createItem({
          id: player,
          location: { type: LocationType.PlayerNotebookStock, player, x: i }
        })
      }
    }
  }

  /** Pick 6 random value cards: Antidote + Poison mandatory, 4 random from remaining 8 */
  randomValueCards(): ValueType[] {
    const allValues = Object.values(ValueType).filter((v): v is ValueType => typeof v === 'number')
    const optional = allValues.filter(v => !mandatoryValueCards.includes(v))
    const picked = shuffle(optional).slice(0, 4)
    return [...mandatoryValueCards, ...picked]
  }
}
