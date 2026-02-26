/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialMove, MoveItem, MaterialGame } from '@gamepark/rules-api'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { getPlayerColor } from './logStyles'

export const PlaceNotebookLog: FC<MoveComponentProps<MaterialMove>> = ({ move, context }) => {
  const player = context.action.playerId ?? context.game.rule?.player
  const name = usePlayerName(player)
  const { t } = useTranslation()

  const mushroomIndex = (move as MoveItem).location.id
  const rules = new AmaniteRules(context.game as MaterialGame)
  const mushroomCard = rules.material(MaterialType.MushroomCard).getItem(mushroomIndex!)
  const colorName = mushroomCard ? t(`mushroom.${mushroomCard.id}`) : '?'

  return (
    <Trans defaults="log.place.notebook" values={{ player: name, mushroom: colorName }}
      components={[<strong css={nameCss(getPlayerColor(player))} />]} />
  )
}

const nameCss = (color: string) => css`font-weight: 600; color: ${color};`