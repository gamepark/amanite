import { getRelativePlayerIndex, MaterialContext } from '@gamepark/react-game'

export function getViewPlayer(context: MaterialContext): number | undefined {
  return context.rules.game.view ?? context.player ?? context.rules.players[0]
}

export function isPlayerViewed(player: number | undefined, context: MaterialContext): boolean {
  const view = context.rules.game.view
  const index = getRelativePlayerIndex(context, player)
  return view === player || (view === undefined && index === 0)
}
