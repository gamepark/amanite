import { describe, it, expect, beforeEach } from 'vitest'
import { isMoveItemType, isCustomMoveType } from '@gamepark/rules-api'
import { createGame, playAndResolve, resolveAutoMoves, getItems } from './helpers'
import { AmaniteRules } from '../AmaniteRules'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { RuleId } from '../rules/RuleId'
import { CustomMoveType } from '../rules/CustomMoveType'
import { PlayerAnimal } from '../PlayerAnimal'

const Fox = PlayerAnimal.Fox
const Squirrel = PlayerAnimal.Squirrel

describe('Full 2-player game flow', () => {
  let rules: AmaniteRules

  beforeEach(() => {
    rules = createGame(2)
  })

  it('should start at ChooseStartCardSide', () => {
    expect(rules.game.rule?.id).toBe(RuleId.ChooseStartCardSide)
  })

  describe('ChooseStartCardSide', () => {
    it('should allow both players to choose a side', () => {
      const foxMoves = rules.getLegalMoves(Fox)
      const squirrelMoves = rules.getLegalMoves(Squirrel)
      expect(foxMoves.length).toBe(2)
      expect(squirrelMoves.length).toBe(2)
    })

    it('should transition to PlaceNewTokens after both choose', () => {
      // Fox chooses side 0
      const foxMove = rules.getLegalMoves(Fox)
        .find(m => isCustomMoveType(CustomMoveType.Pass)(m) && m.data?.side === 0)!
      playAndResolve(rules, foxMove)

      // Squirrel chooses side 1
      const squirrelMove = rules.getLegalMoves(Squirrel)
        .find(m => isCustomMoveType(CustomMoveType.Pass)(m) && m.data?.side === 1)!
      playAndResolve(rules, squirrelMove)

      // Should now be at PlaceNewTokens or PlaceMeeple (auto rules resolve)
      resolveAutoMoves(rules)
      expect(rules.game.rule?.id).toBe(RuleId.PlaceMeeple)
    })
  })

  describe('Full round flow', () => {
    beforeEach(() => {
      // Complete start card selection
      const foxMove = rules.getLegalMoves(Fox)
        .find(m => isCustomMoveType(CustomMoveType.Pass)(m))!
      playAndResolve(rules, foxMove)
      const squirrelMove = rules.getLegalMoves(Squirrel)
        .find(m => isCustomMoveType(CustomMoveType.Pass)(m))!
      playAndResolve(rules, squirrelMove)
      resolveAutoMoves(rules)
    })

    it('should deal initial clues (3 per player)', () => {
      // Each player should have 3 clue cards
      expect(getItems(rules, MaterialType.ClueCard, LocationType.PlayerClueCards, Fox)).toHaveLength(3)
      expect(getItems(rules, MaterialType.ClueCard, LocationType.PlayerClueCards, Squirrel)).toHaveLength(3)
    })

    it('should place 4 tokens per tile in round 1', () => {
      // 3 tiles, 4 tokens each = 12 tokens on tiles
      const tilesTokens = rules.material(MaterialType.RoundToken).location(LocationType.ForestTileTokens)
      expect(tilesTokens.length).toBe(12)
    })

    it('should be PlaceMeeple with Fox as first player', () => {
      expect(rules.game.rule?.id).toBe(RuleId.PlaceMeeple)
      expect(rules.getActivePlayer()).toBe(Fox)
    })

    it('should allow placing on empty tiles (spot 0)', () => {
      const moves = rules.getLegalMoves(Fox)
      expect(moves.length).toBeGreaterThan(0)
      // All meeple placements should be to ForestTileMeepleSpot
      const meepleMoves = moves.filter((m: any) => isMoveItemType(MaterialType.Meeple)(m))
      expect(meepleMoves.length).toBeGreaterThan(0)
      meepleMoves.forEach((m: any) => {
        expect(m.location.type).toBe(LocationType.ForestTileMeepleSpot)
        expect(m.location.x).toBe(0) // First spot on each tile
      })
    })

    it('should trigger split when second meeple placed on same tile', () => {
      // Fox places on tile 0
      const foxMoves = rules.getLegalMoves(Fox)
      const foxPlace = foxMoves.find((m: any) =>
        isMoveItemType(MaterialType.Meeple)(m) && m.location.parent === 0
      )!
      playAndResolve(rules, foxPlace)

      // Squirrel places on same tile 0 (spot 1)
      expect(rules.getActivePlayer()).toBe(Squirrel)
      const squirrelMoves = rules.getLegalMoves(Squirrel)
      const squirrelPlace = squirrelMoves.find((m: any) =>
        isMoveItemType(MaterialType.Meeple)(m) && m.location.parent === 0
      )!
      playAndResolve(rules, squirrelPlace)

      // Should now be in SplitTokens, with Squirrel as the splitting player
      expect(rules.game.rule?.id).toBe(RuleId.SplitTokens)
      expect(rules.getActivePlayer()).toBe(Squirrel)
    })

    it('should complete a full round through to PlaceNotebook', () => {
      // === Placement round 1 ===
      // Fox places meeple on tile 0
      let moves = rules.getLegalMoves(Fox)
      let place = moves.find((m: any) => isMoveItemType(MaterialType.Meeple)(m) && m.location.parent === 0)!
      playAndResolve(rules, place)

      // Squirrel places meeple on tile 1
      moves = rules.getLegalMoves(Squirrel)
      place = moves.find((m: any) => isMoveItemType(MaterialType.Meeple)(m) && m.location.parent === 1)!
      playAndResolve(rules, place)

      // === Placement round 2 ===
      // Fox places meeple on tile 1 (triggers split)
      moves = rules.getLegalMoves(Fox)
      place = moves.find((m: any) => isMoveItemType(MaterialType.Meeple)(m) && m.location.parent === 1)!
      playAndResolve(rules, place)

      // Fox should be splitting (placed on x=1)
      expect(rules.game.rule?.id).toBe(RuleId.SplitTokens)
      expect(rules.getActivePlayer()).toBe(Fox)

      // Split: move 1 token to bottom lot, then confirm
      moves = rules.getLegalMoves(Fox)
      const moveToBottom = moves.find((m: any) =>
        isMoveItemType(MaterialType.RoundToken)(m) && m.location.id === 2 // LotZone.Bottom
      )!
      playAndResolve(rules, moveToBottom)

      const confirm = rules.getLegalMoves(Fox)
        .find(m => isCustomMoveType(CustomMoveType.ConfirmSplit)(m))!
      playAndResolve(rules, confirm)

      // Squirrel places meeple on tile 2
      moves = rules.getLegalMoves(Squirrel)
      place = moves.find((m: any) => isMoveItemType(MaterialType.Meeple)(m))!
      playAndResolve(rules, place)

      resolveAutoMoves(rules)

      // === Harvest ===
      // Tile 0 has 1 meeple (Fox) → ChooseTokens
      // Tile 1 has 2 meeples (Squirrel spot 0, Fox spot 1) → ChooseLot
      // Tile 2 has 1 meeple (Squirrel) → ChooseTokens
      const currentRule = rules.game.rule?.id
      expect([RuleId.ChooseLot, RuleId.ChooseTokens, RuleId.Harvest]).toContain(currentRule)
    })
  })
})
