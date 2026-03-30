import { Trans, useTranslation } from 'react-i18next'
import { useLegalMoves, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { StampPlayMoveButton } from '../components/StampPlayMoveButton'
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
    const topMove = legalMoves.find(move => isCustomMoveType(CustomMoveType.ChooseLot)(move) && move.data === 'top')
    const bottomMove = legalMoves.find(move => isCustomMoveType(CustomMoveType.ChooseLot)(move) && move.data === 'bottom')
    return (
      <Trans i18nKey="header.choose.lot.you"
        components={{
          top: <StampPlayMoveButton move={topMove}>{t('button.top.lot')}</StampPlayMoveButton>,
          bottom: <StampPlayMoveButton move={bottomMove}>{t('button.bottom.lot')}</StampPlayMoveButton>
        }}
      />
    )
  }
  return <Trans i18nKey="header.choose.lot.player" values={{ player: name }} />
}
