import { Trans } from 'react-i18next'
import { usePlayerId, useRules } from '@gamepark/react-game'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'

export const ChooseStartCardSideHeader = () => {
  const player = usePlayerId<PlayerAnimal>()
  const rules = useRules<AmaniteRules>()!

  if (player === undefined) return <Trans defaults="header.choose.start.waiting" />

  const itsMe = rules.isTurnToPlay(player)
  if (itsMe) return <Trans defaults="header.choose.start.you" />
  return <Trans defaults="header.choose.start.waiting" />
}
