import { FC } from 'react'
import { Trans } from 'react-i18next'
import { MoveComponentProps } from '@gamepark/react-game'
import { MaterialMove, StartPlayerTurn } from '@gamepark/rules-api'
import { Memory } from '@gamepark/amanite/rules/Memory'

export const ForestTileLog: FC<MoveComponentProps<MaterialMove>> = ({ context }) => {
  const tileIndex = context.game.memory[Memory.CurrentForestTile]
  const tile = (tileIndex ?? 0) + 1
  return <Trans defaults="log.forest.tile" values={{ tile }} />
}
