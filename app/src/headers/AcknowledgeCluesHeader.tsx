/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next'
import { usePlayerId } from '@gamepark/react-game'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'

export const AcknowledgeCluesHeader = () => {
  const { t } = useTranslation()
  const player = usePlayerId<PlayerAnimal>()
  if (player === undefined) return <>{t('header.clues.spectator')}</>
  return <>{t('header.clues')}</>
}
