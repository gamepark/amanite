import { describe, it, expect } from 'vitest'
import { createGame, getItems } from './helpers'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { mushroomColors } from '../material/MushroomColor'
import { RuleId } from '../rules/RuleId'
import { Memory } from '../rules/Memory'
import { defaultValueCards, ValueType, mandatoryValueCards } from '../material/ValueType'
import { PlayerAnimal } from '../PlayerAnimal'

describe('Game Setup', () => {
  describe('2 players', () => {
    it('should create 3 forest tiles', () => {
      const rules = createGame(2)
      expect(getItems(rules, MaterialType.ForestTile, LocationType.ForestTileRow)).toHaveLength(3)
    })

    it('should not create mushroom cards in game state (they are static)', () => {
      const rules = createGame(2)
      expect(rules.game.items[MaterialType.MushroomCard] ?? []).toHaveLength(0)
    })

    it('should create 64 round tokens total (bag + tiles after PlaceNewTokens auto-runs)', () => {
      const rules = createGame(2)
      const inBag = getItems(rules, MaterialType.RoundToken, LocationType.Bag).length
      const onTiles = getItems(rules, MaterialType.RoundToken, LocationType.ForestTileTokens).length
      expect(inBag + onTiles).toBe(64)
    })

    it('should give 2 meeples per player', () => {
      const rules = createGame(2)
      expect(getItems(rules, MaterialType.Meeple, LocationType.PlayerMeepleStock, PlayerAnimal.Fox)).toHaveLength(2)
      expect(getItems(rules, MaterialType.Meeple, LocationType.PlayerMeepleStock, PlayerAnimal.Squirrel)).toHaveLength(2)
    })

    it('should give 2 notebook tokens per player', () => {
      const rules = createGame(2)
      expect(getItems(rules, MaterialType.NotebookToken, LocationType.PlayerNotebookStock, PlayerAnimal.Fox)).toHaveLength(2)
      expect(getItems(rules, MaterialType.NotebookToken, LocationType.PlayerNotebookStock, PlayerAnimal.Squirrel)).toHaveLength(2)
    })

    it('should give 1 start card per player', () => {
      const rules = createGame(2)
      expect(getItems(rules, MaterialType.StartCard, LocationType.PlayerStartCard, PlayerAnimal.Fox)).toHaveLength(1)
      expect(getItems(rules, MaterialType.StartCard, LocationType.PlayerStartCard, PlayerAnimal.Squirrel)).toHaveLength(1)
    })

    it('should auto-resolve PlaceNewTokens at start and stop on PlaceMeeple', () => {
      const rules = createGame(2)
      expect(rules.game.rule?.id).toBe(RuleId.PlaceMeeple)
    })

    it('should deal 3 clue cards (face up to owner) into each player\'s hand', () => {
      const rules = createGame(2)
      for (const player of [PlayerAnimal.Fox, PlayerAnimal.Squirrel]) {
        const hand = getItems(rules, MaterialType.ClueCard, LocationType.PlayerClueCards, player)
        expect(hand).toHaveLength(3)
        hand.forEach(card => expect(card.location.rotation).toBe(true))
      }
    })

    it('should leave 6 minus dealt clue cards on each mushroom deck', () => {
      const rules = createGame(2)
      const totalDeckCards = getItems(rules, MaterialType.ClueCard, LocationType.ClueDeck).length
      // 36 total clues − 2 players × 3 dealt = 30
      expect(totalDeckCards).toBe(30)
    })

    it('should memorize round 1 and first player', () => {
      const rules = createGame(2)
      expect(rules.remind(Memory.Round)).toBe(1)
      expect(rules.remind(Memory.FirstPlayer)).toBe(PlayerAnimal.Fox)
    })
  })

  describe('4 players', () => {
    it('should create 5 forest tiles', () => {
      const rules = createGame(4)
      expect(getItems(rules, MaterialType.ForestTile, LocationType.ForestTileRow)).toHaveLength(5)
    })

    it('should not create mushroom cards in game state (they are static)', () => {
      const rules = createGame(4)
      expect(rules.game.items[MaterialType.MushroomCard] ?? []).toHaveLength(0)
    })

    it('should give 2 meeples to each of 4 players', () => {
      const rules = createGame(4)
      for (const player of [PlayerAnimal.Fox, PlayerAnimal.Squirrel, PlayerAnimal.Owl, PlayerAnimal.Jay]) {
        expect(getItems(rules, MaterialType.Meeple, LocationType.PlayerMeepleStock, player)).toHaveLength(2)
      }
    })
  })

  describe('Value cards', () => {
    it('should use default value cards in beginner mode', () => {
      const rules = createGame(2, true)
      const cards = getItems(rules, MaterialType.ValueCard, LocationType.ValueCardSlot)
      expect(cards).toHaveLength(6)
      const ids = cards.map(c => c.id as ValueType)
      for (const v of defaultValueCards) {
        expect(ids).toContain(v)
      }
    })

    it('should always include Antidote and Poison in non-beginner mode', () => {
      const rules = createGame(2, false)
      const cards = getItems(rules, MaterialType.ValueCard, LocationType.ValueCardSlot)
      expect(cards).toHaveLength(6)
      const ids = cards.map(c => c.id as ValueType)
      for (const v of mandatoryValueCards) {
        expect(ids).toContain(v)
      }
    })

    it('should have 36 clue cards total split between decks and player hands', () => {
      const rules = createGame(2)
      const inDecks = getItems(rules, MaterialType.ClueCard, LocationType.ClueDeck).length
      const inFoxHand = getItems(rules, MaterialType.ClueCard, LocationType.PlayerClueCards, PlayerAnimal.Fox).length
      const inSquirrelHand = getItems(rules, MaterialType.ClueCard, LocationType.PlayerClueCards, PlayerAnimal.Squirrel).length
      expect(inDecks + inFoxHand + inSquirrelHand).toBe(36)
    })

    it('should place a clue pile on each mushroom (keyed by color) with size = 6 - players dealt from it', () => {
      const rules = createGame(2)
      for (const color of mushroomColors) {
        const deck = rules.material(MaterialType.ClueCard)
          .location(LocationType.ClueDeck)
          .locationId(color)
        expect(deck.length).toBeGreaterThanOrEqual(4)
        expect(deck.length).toBeLessThanOrEqual(6)
      }
    })
  })
})
