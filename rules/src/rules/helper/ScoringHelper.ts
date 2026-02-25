import { MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { mushroomColors } from '../../material/MushroomColor'
import { isPig, isMushroomToken } from '../../material/RoundTokenId'
import { ValueType } from '../../material/ValueType'
import { PlayerAnimal } from '../../PlayerAnimal'
import { Memory } from '../Memory'

export class ScoringHelper extends MaterialRulesPart {

  get mushroomValueMapping(): Record<number, ValueType> {
    return this.remind<Record<number, ValueType>>(Memory.MushroomValueMapping)
  }

  /** Check if a player is eliminated (too many poison tokens) */
  isEliminated(player: PlayerAnimal): boolean {
    const mapping = this.mushroomValueMapping
    const tokens = this.getPlayerMushroomCounts(player)
    let poisonCount = 0
    let antidoteCount = 0
    let elixirCount = 0

    for (const color of mushroomColors) {
      const value = mapping[color]
      const count = tokens[color] ?? 0
      if (value === ValueType.Poison) poisonCount += count
      if (value === ValueType.Antidote) antidoteCount += count
      if (value === ValueType.Potion) elixirCount += count
      if (value === ValueType.MushroomLimit && count >= 4) return true
    }

    return poisonCount > antidoteCount + elixirCount
  }

  /** Get count of mushroom tokens per color for a player */
  getPlayerMushroomCounts(player: PlayerAnimal): Record<number, number> {
    const counts: Record<number, number> = {}
    const tokens = this.material(MaterialType.RoundToken)
      .location(LocationType.PlayerTokens)
      .player(player)

    for (const color of mushroomColors) {
      counts[color] = tokens.id(color).length
    }
    return counts
  }

  /** Get pig count for a player */
  getPigCount(player: PlayerAnimal): number {
    return this.material(MaterialType.RoundToken)
      .location(LocationType.PlayerTokens)
      .player(player)
      .filter(item => isPig(item.id))
      .length
  }

  /** Get total mushroom token count (excluding pigs) */
  getTotalMushroomCount(player: PlayerAnimal): number {
    return this.material(MaterialType.RoundToken)
      .location(LocationType.PlayerTokens)
      .player(player)
      .filter(item => isMushroomToken(item.id))
      .length
  }

  /** Calculate total score for a player */
  getScore(player: PlayerAnimal): number {
    if (this.isEliminated(player)) return 0

    const mapping = this.mushroomValueMapping
    const counts = this.getPlayerMushroomCounts(player)
    let score = 0

    // Score per value type
    for (const color of mushroomColors) {
      const value = mapping[color]
      const count = counts[color] ?? 0
      score += this.scoreForValue(value, count, player)
    }

    // Pig tokens: 3 VP each
    score += this.getPigCount(player) * 3

    // Poison pairing bonus
    score += this.scorePoisonPairing(player)

    // Antidote + Elixir penalty
    score += this.scoreAntidoteElixirPenalty(player)

    return score
  }

  /** Score for a specific value card */
  private scoreForValue(value: ValueType, count: number, player: PlayerAnimal): number {
    switch (value) {
      case ValueType.Minus1: return -1 * count
      case ValueType.Value1: return 1 * count
      case ValueType.Value2: return 2 * count
      case ValueType.Value3: return 3 * count
      case ValueType.MushroomLimit: return this.scoreMushroomLimit(count)
      case ValueType.MushroomPair: return count === 2 ? 8 : 0
      case ValueType.MushroomMajority: return this.scoreMushroomMajority(player)
      // Poison, Antidote, Potion scoring handled separately via pairing
      case ValueType.Poison:
      case ValueType.Antidote:
      case ValueType.Potion:
        return 0
    }
  }

  /** MushroomLimit: 0→-5, 1→0, 2→3, 3→12, 4+→eliminated */
  private scoreMushroomLimit(count: number): number {
    const scores = [-5, 0, 3, 12]
    if (count >= 4) return 0 // eliminated (handled in isEliminated)
    return scores[count] ?? 0
  }

  /** MushroomMajority: 1st=10, 2nd=4, ties handled */
  private scoreMushroomMajority(player: PlayerAnimal): number {
    const mapping = this.mushroomValueMapping
    const majorityColor = mushroomColors.find(c => mapping[c] === ValueType.MushroomMajority)
    if (!majorityColor) return 0

    // Get counts for non-eliminated players
    const playerCounts: { player: PlayerAnimal, count: number }[] = []
    for (const p of this.game.players) {
      if (!this.isEliminated(p)) {
        const counts = this.getPlayerMushroomCounts(p)
        playerCounts.push({ player: p, count: counts[majorityColor] ?? 0 })
      }
    }

    playerCounts.sort((a, b) => b.count - a.count)
    if (playerCounts.length === 0) return 0

    const myCount = this.getPlayerMushroomCounts(player)[majorityColor] ?? 0
    const maxCount = playerCounts[0].count

    if (myCount === 0) return 0

    // Count ties for 1st place
    const firstPlaceTied = playerCounts.filter(p => p.count === maxCount)
    if (myCount === maxCount) {
      return firstPlaceTied.length > 1 ? 7 : 10
    }

    // 2nd place
    const secondCount = playerCounts.find(p => p.count < maxCount)?.count ?? 0
    if (myCount === secondCount && myCount > 0) {
      const secondPlaceTied = playerCounts.filter(p => p.count === secondCount)
      return secondPlaceTied.length > 1 ? 2 : 4
    }

    return 0
  }

  /** Poison pairing: each Poison token paired with Antidote or Elixir = 5 VP */
  private scorePoisonPairing(player: PlayerAnimal): number {
    const mapping = this.mushroomValueMapping
    const counts = this.getPlayerMushroomCounts(player)
    let poisonCount = 0
    let antidoteCount = 0
    let elixirCount = 0

    for (const color of mushroomColors) {
      const count = counts[color] ?? 0
      if (mapping[color] === ValueType.Poison) poisonCount += count
      if (mapping[color] === ValueType.Antidote) antidoteCount += count
      if (mapping[color] === ValueType.Potion) elixirCount += count
    }

    // Each poison can be paired with one antidote or one elixir
    const pairs = Math.min(poisonCount, antidoteCount + elixirCount)
    return pairs * 5
  }

  /** Antidote + Elixir penalty: each pair = -3 VP */
  private scoreAntidoteElixirPenalty(player: PlayerAnimal): number {
    const mapping = this.mushroomValueMapping
    const counts = this.getPlayerMushroomCounts(player)
    let antidoteCount = 0
    let elixirCount = 0

    for (const color of mushroomColors) {
      const count = counts[color] ?? 0
      if (mapping[color] === ValueType.Antidote) antidoteCount += count
      if (mapping[color] === ValueType.Potion) elixirCount += count
    }

    // Pairs of antidote + elixir (after poison pairing)
    // First subtract those used for poison pairing
    let poisonCount = 0
    for (const color of mushroomColors) {
      if (mapping[color] === ValueType.Poison) poisonCount += counts[color] ?? 0
    }

    // Antidote and elixir used for poison pairing
    let remainingPoison = poisonCount
    const usedAntidote = Math.min(antidoteCount, remainingPoison)
    remainingPoison -= usedAntidote
    const usedElixir = Math.min(elixirCount, remainingPoison)

    const leftoverAntidote = antidoteCount - usedAntidote
    const leftoverElixir = elixirCount - usedElixir

    // Each pair of leftover antidote + elixir = -3 VP
    const penaltyPairs = Math.min(leftoverAntidote, leftoverElixir)
    return penaltyPairs * -3
  }
}
