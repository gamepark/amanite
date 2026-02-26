import { Trans, useTranslation } from 'react-i18next'
import { PlayMoveButton, useLegalMoves, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'
import { isCustomMoveType } from '@gamepark/rules-api'
import { CustomMoveType } from '@gamepark/amanite/rules/CustomMoveType'

export const ChooseLotHeader = () => {
  const { t } = useTranslation()
  const player = usePlayerId()
  const rules = useRules<AmaniteRules>()!
  const activePlayer = rules.game.rule?.player
  const itsMe = player && activePlayer === player
  const name = usePlayerName(activePlayer)
  const legalMoves = useLegalMoves()

  if (itsMe) {
    const topMove = legalMoves.find(move => isCustomMoveType(CustomMoveType.Pass)(move) && move.data === 'top')
    const bottomMove = legalMoves.find(move => isCustomMoveType(CustomMoveType.Pass)(move) && move.data === 'bottom')
    return (
      <Trans defaults="header.choose.lot.you"
        components={{
          top: <PlayMoveButton move={topMove}>{t('button.top.lot')}</PlayMoveButton>,
          bottom: <PlayMoveButton move={bottomMove}>{t('button.bottom.lot')}</PlayMoveButton>
        }}
      />
    )
  }
  return <Trans defaults="header.choose.lot.player" values={{ player: name }} />
}
