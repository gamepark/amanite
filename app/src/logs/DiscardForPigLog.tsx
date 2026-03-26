/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialMove, MoveItem } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { Pig } from '@gamepark/amanite/material/RoundTokenId'
import { getPlayerColor } from './logStyles'
import { TokenIcons } from './TokenIcons'

export const DiscardForPigLog: FC<MoveComponentProps<MaterialMove>> = ({ move, context }) => {
  const player = context.action.playerId ?? context.game.rule?.player
  const name = usePlayerName(player)
  const discardedId = context.game.items[MaterialType.RoundToken]?.[(move as MoveItem).itemIndex]?.id as number
  return (
    <>
      <Trans defaults="log.discard.for.pig" values={{ player: name }}
        components={[<strong css={nameCss(getPlayerColor(player))} />]} />
      <TokenIcons ids={discardedId !== undefined ? [discardedId, Pig] : [Pig]} />
    </>
  )
}

const nameCss = (color: string) => css`font-weight: 600; color: ${color};`