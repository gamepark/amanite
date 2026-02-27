import { MaterialMove } from '@gamepark/rules-api'
import { AmaniteRules } from '../AmaniteRules'
import { AmaniteSetup } from '../AmaniteSetup'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerAnimal } from '../PlayerAnimal'

type AmaniteMove = MaterialMove<PlayerAnimal, MaterialType, LocationType>

export function createGame(playerCount: 2 | 3 | 4, beginner = true): AmaniteRules {
  const players: PlayerAnimal[] = [PlayerAnimal.Fox, PlayerAnimal.Squirrel, PlayerAnimal.Owl, PlayerAnimal.Jay].slice(0, playerCount)
  const setup = new AmaniteSetup()
  const game = setup.setup({ players: players.map(id => ({ id })), beginner })
  return new AmaniteRules(game)
}

export function playConsequences(rules: AmaniteRules, move: AmaniteMove) {
  let consequences = rules.play(move)
  while (consequences.length > 0) {
    const next = consequences.shift()!
    consequences.push(...rules.play(next))
  }
}

export function resolveAutoMoves(rules: AmaniteRules) {
  let autoMoves = rules.getAutomaticMoves()
  let safety = 0
  while (autoMoves.length > 0 && safety < 1000) {
    for (const auto of autoMoves) {
      playConsequences(rules, auto)
    }
    autoMoves = rules.getAutomaticMoves()
    safety++
  }
}

export function playAndResolve(rules: AmaniteRules, move: AmaniteMove) {
  playConsequences(rules, move)
  resolveAutoMoves(rules)
}

export function getItems(
  rules: AmaniteRules,
  type: MaterialType,
  locationType?: LocationType,
  player?: PlayerAnimal
) {
  let mat = rules.material(type)
  if (locationType !== undefined) mat = mat.location(locationType)
  if (player !== undefined) mat = mat.player(player)
  return mat.getItems()
}

export function getLegalMoves(rules: AmaniteRules, player?: PlayerAnimal) {
  return player !== undefined ? rules.getLegalMoves(player) : rules.getAutomaticMoves()
}
