/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialMove } from '@gamepark/rules-api'
import { getPlayerColor } from './logStyles'

export const DiscardForPigLog: FC<MoveComponentProps<MaterialMove>> = ({ context }) => {
  const player = context.action.playerId ?? context.game.rule?.player
  const name = usePlayerName(player)
  return (
    <Trans defaults="log.discard.for.pig" values={{ player: name }}
      components={[<strong css={nameCss(getPlayerColor(player))} />]} />
  )
}

const nameCss = (color: string) => css`font-weight: 600; color: ${color};`