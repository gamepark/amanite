import { MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { MushroomColor, mushroomColors } from '../../material/MushroomColor'
import { isMushroomToken, isPig } from '../../material/RoundTokenId'
import { ValueType } from '../../material/ValueType'
import { PlayerAnimal } from '../../PlayerAnimal'

type AmaniteGame = MaterialGame<PlayerAnimal, MaterialType, LocationType>

export class ScoringHelper extends MaterialRulesPart {

  constructor(game: AmaniteGame, readonly player: PlayerAnimal) {
    super(game)
  }

  /** Derive mushroom→value mapping from revealed clue cards on ClueDeck */
  get mushroomValueMapping(): Record<number, ValueType> {
    const mapping: Record<number, ValueType> = {}
    for (const color of mushroomColors) {
      const revealedCard = this.material(MaterialType.ClueCard)
        .location(LocationType.ClueDeck)
        .locationId(color)
        .rotation(true)
        .getItem()
      if (revealedCard?.id !== undefined) {
        mapping[color] = revealedCard.id as ValueType
      }
    }
    return mapping
  }

  /** Check if the player is eliminated */
  get isEliminated(): boolean {
    const mapping = this.mushroomValueMapping
    const tokens = this.mushroomCounts
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

  /** Count of mushroom tokens per color */
  get mushroomCounts(): Record<number, number> {
    const counts: Record<number, number> = {}
    const tokens = this.material(MaterialType.RoundToken)
      .location(LocationType.PlayerTokens)
      .player(this.player)

    for (const color of mushroomColors) {
      counts[color] = tokens.id(color).length
    }
    return counts
  }

  /** Pig count */
  get pigCount(): number {
    return this.material(MaterialType.RoundToken)
      .location(LocationType.PlayerTokens)
      .player(this.player)
      .filter(item => isPig(item.id))
      .length
  }

  /** Total mushroom token count (excluding pigs) — used as tiebreaker */
  get totalMushroomCount(): number {
    return this.material(MaterialType.RoundToken)
      .location(LocationType.PlayerTokens)
      .player(this.player)
      .filter(item => isMushroomToken(item.id))
      .length
  }

  /** Whether the player survives the poison check (heart vs skull) */
  get isPoisonSurvived(): boolean {
    const mapping = this.mushroomValueMapping
    const counts = this.mushroomCounts
    let poisonCount = 0
    let antidoteCount = 0
    let elixirCount = 0
    for (const color of mushroomColors) {
      const c = counts[color] ?? 0
      if (mapping[color] === ValueType.Poison) poisonCount += c
      if (mapping[color] === ValueType.Antidote) antidoteCount += c
      if (mapping[color] === ValueType.Potion) elixirCount += c
    }
    return poisonCount <= antidoteCount + elixirCount
  }

  /**
   * Per-color score for the player panel. Reattributes the global poison/antidote/elixir
   * pairing scores to specific colors:
   *   - Antidote color: min(antidote, poison) × 5 (antidote pairs poisons first)
   *   - Elixir color : remaining unpaired poisons × 5 - antidote/elixir pairs × 3
   *   - Poison color : 0 (display heart/skull icon instead via isPoisonSurvived)
   */
  getColorPanelScore(color: MushroomColor): number {
    const mapping = this.mushroomValueMapping
    const value = mapping[color]
    if (value === undefined) return 0

    if (value === ValueType.Poison) return 0

    if (value === ValueType.Antidote) {
      let antidote = 0, poison = 0
      for (const c of mushroomColors) {
        const n = this.mushroomCounts[c] ?? 0
        if (mapping[c] === ValueType.Antidote) antidote += n
        if (mapping[c] === ValueType.Poison) poison += n
      }
      return Math.min(antidote, poison) * 5
    }

    if (value === ValueType.Potion) {
      let antidote = 0, poison = 0, elixir = 0
      for (const c of mushroomColors) {
        const n = this.mushroomCounts[c] ?? 0
        if (mapping[c] === ValueType.Antidote) antidote += n
        if (mapping[c] === ValueType.Poison) poison += n
        if (mapping[c] === ValueType.Potion) elixir += n
      }
      const unpaired = Math.max(0, poison - antidote)
      return Math.min(elixir, unpaired) * 5 - Math.min(antidote, elixir) * 3
    }

    return this.getMushroomScore(color)
  }

  /** Score for a single mushroom color based on its assigned value */
  getMushroomScore(color: MushroomColor): number {
    const mapping = this.mushroomValueMapping
    const value = mapping[color]
    const count = this.mushroomCounts[color] ?? 0
    if (value === undefined) return 0

    switch (value) {
      case ValueType.Minus1: return -1 * count
      case ValueType.Value1: return count
      case ValueType.Value2: return 2 * count
      case ValueType.Value3: return 3 * count
      case ValueType.MushroomLimit: return this.mushroomLimitScore
      case ValueType.MushroomPair: return this.mushroomPairScore
      case ValueType.MushroomMajority: return this.mushroomMajorityScore
      case ValueType.Poison:
      case ValueType.Antidote:
      case ValueType.Potion:
        return 0
      default:
        return 0
    }
  }

  /** Pig score: 3 VP each */
  get pigScore(): number {
    return this.pigCount * 3
  }

  /** Poison pairing: each Poison paired with Antidote or Elixir = 5 VP */
  get poisonPairingScore(): number {
    const mapping = this.mushroomValueMapping
    const counts = this.mushroomCounts
    let poisonCount = 0
    let antidoteCount = 0
    let elixirCount = 0

    for (const color of mushroomColors) {
      const count = counts[color] ?? 0
      if (mapping[color] === ValueType.Poison) poisonCount += count
      if (mapping[color] === ValueType.Antidote) antidoteCount += count
      if (mapping[color] === ValueType.Potion) elixirCount += count
    }

    return Math.min(poisonCount, antidoteCount + elixirCount) * 5
  }

  /** Antidote + Elixir penalty: -3 VP per Antidote+Elixir pair, independent of Poison pairing */
  get antidoteElixirPenaltyScore(): number {
    const mapping = this.mushroomValueMapping
    const counts = this.mushroomCounts
    let antidoteCount = 0
    let elixirCount = 0

    for (const color of mushroomColors) {
      const count = counts[color] ?? 0
      if (mapping[color] === ValueType.Antidote) antidoteCount += count
      if (mapping[color] === ValueType.Potion) elixirCount += count
    }

    const pairs = Math.min(antidoteCount, elixirCount)
    return pairs > 0 ? pairs * -3 : 0
  }

  /** MushroomLimit: 0→-5, 1→0, 2→3, 3→12 */
  get mushroomLimitScore(): number {
    const mapping = this.mushroomValueMapping
    const limitColor = mushroomColors.find(c => mapping[c] === ValueType.MushroomLimit)
    if (!limitColor) return 0
    const count = this.mushroomCounts[limitColor] ?? 0
    if (count >= 4) return 0
    return [-5, 0, 3, 12][count] ?? 0
  }

  /** MushroomPair: exactly 2 = 8 VP */
  get mushroomPairScore(): number {
    const mapping = this.mushroomValueMapping
    const pairColor = mushroomColors.find(c => mapping[c] === ValueType.MushroomPair)
    if (!pairColor) return 0
    return (this.mushroomCounts[pairColor] ?? 0) === 2 ? 8 : 0
  }

  /** MushroomMajority: 1st=10, 2nd=4, ties handled */
  get mushroomMajorityScore(): number {
    const mapping = this.mushroomValueMapping
    const majorityColor = mushroomColors.find(c => mapping[c] === ValueType.MushroomMajority)
    if (!majorityColor) return 0

    const playerCounts: { player: PlayerAnimal, count: number }[] = []
    for (const p of this.game.players) {
      const helper = new ScoringHelper(this.game, p)
      if (!helper.isEliminated) {
        playerCounts.push({ player: p, count: helper.mushroomCounts[majorityColor] ?? 0 })
      }
    }

    playerCounts.sort((a, b) => b.count - a.count)
    if (playerCounts.length === 0) return 0

    const myCount = this.mushroomCounts[majorityColor] ?? 0
    if (myCount === 0) return 0

    const maxCount = playerCounts[0].count
    const firstPlaceTied = playerCounts.filter(p => p.count === maxCount)
    if (myCount === maxCount) {
      return firstPlaceTied.length > 1 ? 7 : 10
    }

    const secondCount = playerCounts.find(p => p.count < maxCount)?.count ?? 0
    if (myCount === secondCount && myCount > 0) {
      const secondPlaceTied = playerCounts.filter(p => p.count === secondCount)
      return secondPlaceTied.length > 1 ? 2 : 4
    }

    return 0
  }

  /** Total score (without elimination check — use AmaniteRules.getScore for final score) */
  get score(): number {
    let total = 0
    for (const color of mushroomColors) {
      total += this.getMushroomScore(color)
    }
    total += this.pigScore
    total += this.poisonPairingScore
    total += this.antidoteElixirPenaltyScore
    return total
  }
}
