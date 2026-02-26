import { FC } from 'react'
import { Trans } from 'react-i18next'
import { MoveComponentProps } from '@gamepark/react-game'
import { MaterialMove } from '@gamepark/rules-api'
import { Memory } from '@gamepark/amanite/rules/Memory'

export const EndRoundLog: FC<MoveComponentProps<MaterialMove>> = ({ context }) => {
  const round = context.game.memory[Memory.Round] ?? 1
  return <Trans defaults="log.end.round" values={{ round }} />
}