/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { CustomMove, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { LotZone } from '@gamepark/amanite/material/LotZone'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { Memory } from '@gamepark/amanite/rules/Memory'
import { getPlayerColor } from './logStyles'

export const ChooseLotLog: FC<MoveComponentProps<MaterialMove>> = ({ move, context }) => {
  const player = context.action.playerId ?? context.game.rule?.player
  const name = usePlayerName(player)

  const data = (move as CustomMove).data as string
  const rules = new AmaniteRules(context.game as MaterialGame)
  const tileIndex = rules.game.memory[Memory.CurrentForestTile]
  const tokens = rules.material(MaterialType.RoundToken)
    .location(LocationType.ForestTileTokens)
    .parent(tileIndex)
  const lot = data === 'top'
    ? tokens.filter(item => item.location.id === LotZone.Top)
    : tokens.filter(item => item.location.id === LotZone.Bottom)
  const count = lot.length

  return (
    <Trans defaults="log.choose.lot" values={{ player: name, count }}
      components={[<strong css={nameCss(getPlayerColor(player))} />]} />
  )
}

const nameCss = (color: string) => css`font-weight: 600; color: ${color};`