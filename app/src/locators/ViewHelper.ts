import { getRelativePlayerIndex, MaterialContext } from '@gamepark/react-game'

export function isPlayerViewed(player: number | undefined, context: MaterialContext): boolean {
  const view = context.rules.game.view
  const index = getRelativePlayerIndex(context, player)
  return view === player || (view === undefined && index === 0)
}
