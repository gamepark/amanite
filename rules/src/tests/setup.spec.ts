import { describe, it, expect } from 'vitest'
import { createGame, getItems } from './helpers'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
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

    it('should create 6 mushroom cards with rotation=false (1 notebook slot)', () => {
      const rules = createGame(2)
      const cards = getItems(rules, MaterialType.MushroomCard, LocationType.MushroomCardRow)
      expect(cards).toHaveLength(6)
      cards.forEach(card => expect(card.location.rotation).toBe(false))
    })

    it('should create 64 round tokens in the bag', () => {
      const rules = createGame(2)
      expect(getItems(rules, MaterialType.RoundToken, LocationType.Bag)).toHaveLength(64)
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

    it('should start with ChooseStartCardSide rule', () => {
      const rules = createGame(2)
      expect(rules.game.rule?.id).toBe(RuleId.ChooseStartCardSide)
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

    it('should create 6 mushroom cards with rotation=true (2 notebook slots)', () => {
      const rules = createGame(4)
      const cards = getItems(rules, MaterialType.MushroomCard, LocationType.MushroomCardRow)
      expect(cards).toHaveLength(6)
      cards.forEach(card => expect(card.location.rotation).toBe(true))
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

    it('should have 6 clue cards per value', () => {
      const rules = createGame(2)
      const clueCards = getItems(rules, MaterialType.ClueCard, LocationType.ClueDeck)
      expect(clueCards).toHaveLength(36)
    })

    it('should place each clue pile on a different mushroom card', () => {
      const rules = createGame(2)
      const mushrooms = rules.material(MaterialType.MushroomCard).getIndexes()
      for (const mushroomIndex of mushrooms) {
        const deck = rules.material(MaterialType.ClueCard)
          .location(LocationType.ClueDeck)
          .parent(mushroomIndex)
        expect(deck.length).toBe(6)
      }
    })
  })
})
