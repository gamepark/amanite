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
    const leftMove = legalMoves.find(move => isCustomMoveType(CustomMoveType.Pass)(move) && move.data === 'left')
    const rightMove = legalMoves.find(move => isCustomMoveType(CustomMoveType.Pass)(move) && move.data === 'right')
    return (
      <Trans defaults="header.choose.lot.you"
        components={{
          left: <PlayMoveButton move={leftMove}>{t('button.left.lot')}</PlayMoveButton>,
          right: <PlayMoveButton move={rightMove}>{t('button.right.lot')}</PlayMoveButton>
        }}
      />
    )
  }
  return <Trans defaults="header.choose.lot.player" values={{ player: name }} />
}
