import { Trans } from 'react-i18next'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'
import { Memory } from '@gamepark/amanite/rules/Memory'

export const ChooseTokensHeader = () => {
  const player = usePlayerId()
  const rules = useRules<AmaniteRules>()!
  const activePlayer = rules.game.rule?.player
  const itsMe = player && activePlayer === player
  const name = usePlayerName(activePlayer)
  const chosen = rules.remind(Memory.TokensChosen) ?? 0
  const remaining = 2 - chosen
  if (itsMe) return <Trans i18nKey="header.choose.tokens.you" values={{ count: remaining }} />
  return <Trans i18nKey="header.choose.tokens.player" values={{ player: name, count: remaining }} />
}
