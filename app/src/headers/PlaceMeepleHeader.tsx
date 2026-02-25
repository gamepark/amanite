import { Trans } from 'react-i18next'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'

export const PlaceMeepleHeader = () => {
  const player = usePlayerId()
  const rules = useRules<AmaniteRules>()!
  const activePlayer = rules.game.rule?.player
  const itsMe = player && activePlayer === player
  const name = usePlayerName(activePlayer)
  if (itsMe) return <Trans defaults="header.place.meeple.you" />
  return <Trans defaults="header.place.meeple.player" values={{ player: name }} />
}
