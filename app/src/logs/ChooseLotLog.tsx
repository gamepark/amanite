/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { CustomMove, MaterialMove } from '@gamepark/rules-api'
import { getPlayerColor } from './logStyles'

export const ChooseLotLog: FC<MoveComponentProps<MaterialMove>> = ({ move, context }) => {
  const player = context.action.playerId ?? context.game.rule?.player
  const name = usePlayerName(player)
  const data = (move as CustomMove).data as string
  const key = data === 'top' ? 'log.choose.lot.top' : 'log.choose.lot.bottom'

  return (
    <Trans i18nKey={key} values={{ player: name }}
      components={[<strong css={nameCss(getPlayerColor(player))} />]} />
  )
}

const nameCss = (color: string) => css`font-weight: 600; color: ${color};`