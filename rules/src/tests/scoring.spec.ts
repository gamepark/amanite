import { describe, it, expect } from 'vitest'
import { MaterialGame } from '@gamepark/rules-api'
import { AmaniteRules } from '../AmaniteRules'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { MushroomColor } from '../material/MushroomColor'
import { ValueType } from '../material/ValueType'
import { PlayerAnimal } from '../PlayerAnimal'
import { Pig } from '../material/RoundTokenId'
import { ScoringHelper } from '../rules/helper/ScoringHelper'

/**
 * Creates a minimal game state for testing scoring.
 * Sets up revealed clue cards on each mushroom to establish the color→value mapping,
 * then adds tokens to a player's collection.
 */
function createScoringGame(
  mapping: Partial<Record<MushroomColor, ValueType>>,
  playerTokens: Record<PlayerAnimal, number[]>, // player → array of token ids (MushroomColor or Pig)
  players: PlayerAnimal[] = [PlayerAnimal.Fox, PlayerAnimal.Squirrel]
): AmaniteRules {
  const game: MaterialGame = {
    players,
    items: {
      [MaterialType.MushroomCard]: [],
      [MaterialType.ClueCard]: [],
      [MaterialType.RoundToken]: [],
      [MaterialType.ValueCard]: [],
      [MaterialType.ForestTile]: [],
      [MaterialType.StartCard]: [],
      [MaterialType.NotebookToken]: [],
      [MaterialType.Meeple]: [],
      [MaterialType.FirstPlayerToken]: []
    },
    rule: { id: 12 }, // FinalScoring
    memory: {}
  }

  // Create mushroom cards
  const colors = [MushroomColor.Blue, MushroomColor.Green, MushroomColor.Purple,
    MushroomColor.Red, MushroomColor.White, MushroomColor.Yellow]
  for (let i = 0; i < colors.length; i++) {
    game.items[MaterialType.MushroomCard]!.push({
      id: colors[i],
      location: { type: LocationType.MushroomCardRow, x: i }
    })
  }

  // Create revealed clue cards on mushrooms (establishes the mapping)
  for (const [colorStr, value] of Object.entries(mapping)) {
    const color = Number(colorStr) as MushroomColor
    const mushroomIndex = colors.indexOf(color)
    if (mushroomIndex >= 0) {
      game.items[MaterialType.ClueCard]!.push({
        id: value,
        location: { type: LocationType.ClueDeck, parent: mushroomIndex, x: 0, rotation: true }
      })
    }
  }

  // Create player tokens
  for (const [playerStr, tokens] of Object.entries(playerTokens)) {
    const player = Number(playerStr) as PlayerAnimal
    for (let i = 0; i < tokens.length; i++) {
      game.items[MaterialType.RoundToken]!.push({
        id: tokens[i],
        location: { type: LocationType.PlayerTokens, player, x: i }
      })
    }
  }

  return new AmaniteRules(game)
}

const Fox = PlayerAnimal.Fox
const Squirrel = PlayerAnimal.Squirrel

describe('Scoring', () => {
  describe('Numeric values', () => {
    it('should score -1 per token for Minus1', () => {
      const rules = createScoringGame(
        { [MushroomColor.Blue]: ValueType.Minus1 },
        { [Fox]: [MushroomColor.Blue, MushroomColor.Blue, MushroomColor.Blue] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      expect(helper.getMushroomScore(MushroomColor.Blue)).toBe(-3)
    })

    it('should score +1 per token for Value1', () => {
      const rules = createScoringGame(
        { [MushroomColor.Green]: ValueType.Value1 },
        { [Fox]: [MushroomColor.Green, MushroomColor.Green] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      expect(helper.getMushroomScore(MushroomColor.Green)).toBe(2)
    })

    it('should score +2 per token for Value2', () => {
      const rules = createScoringGame(
        { [MushroomColor.Purple]: ValueType.Value2 },
        { [Fox]: [MushroomColor.Purple, MushroomColor.Purple, MushroomColor.Purple, MushroomColor.Purple] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      expect(helper.getMushroomScore(MushroomColor.Purple)).toBe(8)
    })

    it('should score +3 per token for Value3', () => {
      const rules = createScoringGame(
        { [MushroomColor.Red]: ValueType.Value3 },
        { [Fox]: [MushroomColor.Red, MushroomColor.Red] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      expect(helper.getMushroomScore(MushroomColor.Red)).toBe(6)
    })
  })

  describe('Pig scoring', () => {
    it('should score 3 VP per pig', () => {
      const rules = createScoringGame(
        {},
        { [Fox]: [Pig, Pig] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      expect(helper.pigScore).toBe(6)
    })

    it('should score 0 with no pigs', () => {
      const rules = createScoringGame(
        {},
        { [Fox]: [MushroomColor.Blue] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      expect(helper.pigScore).toBe(0)
    })
  })

  describe('Poison/Antidote/Elixir', () => {
    it('should score 5 VP per Poison+Antidote pair', () => {
      const rules = createScoringGame(
        {
          [MushroomColor.Blue]: ValueType.Poison,
          [MushroomColor.Green]: ValueType.Antidote
        },
        { [Fox]: [MushroomColor.Blue, MushroomColor.Blue, MushroomColor.Green, MushroomColor.Green, MushroomColor.Green] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      // 2 poisons, 3 antidotes → 2 pairs = 10 VP
      expect(helper.poisonPairingScore).toBe(10)
    })

    it('should score 5 VP per Poison+Elixir pair', () => {
      const rules = createScoringGame(
        {
          [MushroomColor.Blue]: ValueType.Poison,
          [MushroomColor.Red]: ValueType.Potion
        },
        { [Fox]: [MushroomColor.Blue, MushroomColor.Blue, MushroomColor.Red, MushroomColor.Red, MushroomColor.Red] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      // 2 poisons, 3 elixirs → 2 pairs = 10 VP
      expect(helper.poisonPairingScore).toBe(10)
    })

    it('should penalize leftover Antidote+Elixir pairs at -3 VP', () => {
      const rules = createScoringGame(
        {
          [MushroomColor.Blue]: ValueType.Poison,
          [MushroomColor.Green]: ValueType.Antidote,
          [MushroomColor.Red]: ValueType.Potion
        },
        { [Fox]: [MushroomColor.Blue, MushroomColor.Green, MushroomColor.Green, MushroomColor.Red, MushroomColor.Red] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      // 1 poison, 2 antidotes, 2 elixirs
      // Pairing: 1 poison paired with 1 antidote = 5 VP
      // Leftover: 1 antidote + 2 elixirs → 1 pair = -3 VP
      expect(helper.poisonPairingScore).toBe(5)
      expect(helper.antidoteElixirPenaltyScore).toBe(-3)
    })

    it('should eliminate player if poison > antidote + elixir', () => {
      const rules = createScoringGame(
        {
          [MushroomColor.Blue]: ValueType.Poison,
          [MushroomColor.Green]: ValueType.Antidote
        },
        { [Fox]: [MushroomColor.Blue, MushroomColor.Blue, MushroomColor.Blue, MushroomColor.Green] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      // 3 poison, 1 antidote → 3 > 1 → eliminated
      expect(helper.isEliminated).toBe(true)
    })

    it('should not eliminate if poison <= antidote + elixir', () => {
      const rules = createScoringGame(
        {
          [MushroomColor.Blue]: ValueType.Poison,
          [MushroomColor.Green]: ValueType.Antidote,
          [MushroomColor.Red]: ValueType.Potion
        },
        { [Fox]: [MushroomColor.Blue, MushroomColor.Blue, MushroomColor.Green, MushroomColor.Red] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      // 2 poison, 1 antidote + 1 elixir = 2 → not eliminated
      expect(helper.isEliminated).toBe(false)
    })
  })

  describe('MushroomLimit', () => {
    it('should score -5 for 0 tokens', () => {
      const rules = createScoringGame(
        { [MushroomColor.Blue]: ValueType.MushroomLimit },
        { [Fox]: [] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      expect(helper.mushroomLimitScore).toBe(-5)
    })

    it('should score 0 for 1 token', () => {
      const rules = createScoringGame(
        { [MushroomColor.Blue]: ValueType.MushroomLimit },
        { [Fox]: [MushroomColor.Blue] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      expect(helper.mushroomLimitScore).toBe(0)
    })

    it('should score 3 for 2 tokens', () => {
      const rules = createScoringGame(
        { [MushroomColor.Blue]: ValueType.MushroomLimit },
        { [Fox]: [MushroomColor.Blue, MushroomColor.Blue] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      expect(helper.mushroomLimitScore).toBe(3)
    })

    it('should score 12 for 3 tokens', () => {
      const rules = createScoringGame(
        { [MushroomColor.Blue]: ValueType.MushroomLimit },
        { [Fox]: [MushroomColor.Blue, MushroomColor.Blue, MushroomColor.Blue] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      expect(helper.mushroomLimitScore).toBe(12)
    })

    it('should eliminate with 4+ tokens', () => {
      const rules = createScoringGame(
        { [MushroomColor.Blue]: ValueType.MushroomLimit },
        { [Fox]: [MushroomColor.Blue, MushroomColor.Blue, MushroomColor.Blue, MushroomColor.Blue] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      expect(helper.isEliminated).toBe(true)
    })
  })

  describe('MushroomPair', () => {
    it('should score 8 for exactly 2 tokens', () => {
      const rules = createScoringGame(
        { [MushroomColor.Blue]: ValueType.MushroomPair },
        { [Fox]: [MushroomColor.Blue, MushroomColor.Blue] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      expect(helper.mushroomPairScore).toBe(8)
    })

    it('should score 0 for 1 token', () => {
      const rules = createScoringGame(
        { [MushroomColor.Blue]: ValueType.MushroomPair },
        { [Fox]: [MushroomColor.Blue] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      expect(helper.mushroomPairScore).toBe(0)
    })

    it('should score 0 for 3 tokens', () => {
      const rules = createScoringGame(
        { [MushroomColor.Blue]: ValueType.MushroomPair },
        { [Fox]: [MushroomColor.Blue, MushroomColor.Blue, MushroomColor.Blue] } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      expect(helper.mushroomPairScore).toBe(0)
    })
  })

  describe('MushroomMajority', () => {
    it('should score 10 for sole 1st place', () => {
      const rules = createScoringGame(
        { [MushroomColor.Blue]: ValueType.MushroomMajority },
        {
          [Fox]: [MushroomColor.Blue, MushroomColor.Blue, MushroomColor.Blue],
          [Squirrel]: [MushroomColor.Blue]
        } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      expect(helper.mushroomMajorityScore).toBe(10)
    })

    it('should score 4 for sole 2nd place', () => {
      const rules = createScoringGame(
        { [MushroomColor.Blue]: ValueType.MushroomMajority },
        {
          [Fox]: [MushroomColor.Blue],
          [Squirrel]: [MushroomColor.Blue, MushroomColor.Blue, MushroomColor.Blue]
        } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      expect(helper.mushroomMajorityScore).toBe(4)
    })

    it('should score 7 for tied 1st place', () => {
      const rules = createScoringGame(
        { [MushroomColor.Blue]: ValueType.MushroomMajority },
        {
          [Fox]: [MushroomColor.Blue, MushroomColor.Blue],
          [Squirrel]: [MushroomColor.Blue, MushroomColor.Blue]
        } as any
      )
      const foxHelper = new ScoringHelper(rules.game, Fox)
      const squirrelHelper = new ScoringHelper(rules.game, Squirrel)
      expect(foxHelper.mushroomMajorityScore).toBe(7)
      expect(squirrelHelper.mushroomMajorityScore).toBe(7)
    })

    it('should score 0 for player with 0 tokens', () => {
      const rules = createScoringGame(
        { [MushroomColor.Blue]: ValueType.MushroomMajority },
        {
          [Fox]: [],
          [Squirrel]: [MushroomColor.Blue, MushroomColor.Blue]
        } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      expect(helper.mushroomMajorityScore).toBe(0)
    })
  })

  describe('Total score', () => {
    it('should sum all scoring components', () => {
      const rules = createScoringGame(
        {
          [MushroomColor.Blue]: ValueType.Value3,
          [MushroomColor.Green]: ValueType.Value1,
          [MushroomColor.Red]: ValueType.Poison,
          [MushroomColor.Purple]: ValueType.Antidote
        },
        {
          [Fox]: [
            MushroomColor.Blue, MushroomColor.Blue,  // 2×3 = 6
            MushroomColor.Green,                       // 1×1 = 1
            MushroomColor.Red,                         // poison
            MushroomColor.Purple, MushroomColor.Purple, // antidote
            Pig                                         // 3 VP
          ]
        } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      // 6 + 1 + 5 (1 poison+antidote pair) + 3 (pig) = 15
      // Leftover 1 antidote + 0 elixir = 0 penalty pairs
      expect(helper.score).toBe(15)
      expect(helper.isEliminated).toBe(false)
    })

    it('should return 0 score if eliminated', () => {
      const rules = createScoringGame(
        {
          [MushroomColor.Blue]: ValueType.Poison,
          [MushroomColor.Green]: ValueType.Value3
        },
        {
          [Fox]: [
            MushroomColor.Blue, MushroomColor.Blue, MushroomColor.Blue, // 3 poison
            MushroomColor.Green, MushroomColor.Green                     // 2×3 = 6
          ]
        } as any
      )
      const helper = new ScoringHelper(rules.game, Fox)
      expect(helper.isEliminated).toBe(true)
      // AmaniteRules.getScore returns 0 for eliminated players
      expect(rules.getScore(Fox)).toBe(0)
    })
  })
})
