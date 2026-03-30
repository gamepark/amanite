import { Trans } from 'react-i18next'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'

export const PlaceNotebookHeader = () => {
  const player = usePlayerId()
  const rules = useRules<AmaniteRules>()!
  const activePlayer = rules.game.rule?.player
  const itsMe = player && activePlayer === player
  const name = usePlayerName(activePlayer)
  if (itsMe) return <Trans i18nKey="header.place.notebook.you" />
  return <Trans i18nKey="header.place.notebook.player" values={{ player: name }} />
}
