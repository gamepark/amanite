/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialMove, MoveItem } from '@gamepark/rules-api'
import { getPlayerColor } from './logStyles'

export const PlaceMeepleLog: FC<MoveComponentProps<MaterialMove>> = ({ move, context }) => {
  const player = context.action.playerId ?? context.game.rule?.player
  const name = usePlayerName(player)
  const tileIndex = (move as MoveItem).location.parent ?? 0
  return (
    <Trans defaults="log.place.meeple" values={{ player: name, tile: tileIndex + 1 }}
      components={[<strong css={nameCss(getPlayerColor(player))} />]} />
  )
}

const nameCss = (color: string) => css`font-weight: 600; color: ${color};`