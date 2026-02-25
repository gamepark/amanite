import { Trans, useTranslation } from 'react-i18next'
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'
import { isCustomMoveType } from '@gamepark/rules-api'
import { CustomMoveType } from '@gamepark/amanite/rules/CustomMoveType'

export const SplitTokensHeader = () => {
  const { t } = useTranslation()
  const player = usePlayerId()
  const rules = useRules<AmaniteRules>()!
  const activePlayer = rules.game.rule?.player
  const itsMe = player && activePlayer === player
  const name = usePlayerName(activePlayer)
  const confirmMove = useLegalMove(isCustomMoveType(CustomMoveType.ConfirmSplit))

  if (itsMe) {
    return (
      <Trans defaults="header.split.tokens.you"
        components={{
          confirm: <PlayMoveButton move={confirmMove}>{t('button.confirm')}</PlayMoveButton>
        }}
      />
    )
  }
  return <Trans defaults="header.split.tokens.player" values={{ player: name }} />
}
