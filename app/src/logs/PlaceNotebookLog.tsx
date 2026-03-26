/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { MoveComponentProps, usePlayerName, usePlay } from '@gamepark/react-game'
import { MaterialMove, MoveItem, MaterialGame } from '@gamepark/rules-api'
import { MaterialMoveBuilder } from '@gamepark/rules-api/dist/material/moves/MaterialMoveBuilder'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { MushroomColor } from '@gamepark/amanite/material/MushroomColor'
import { getPlayerColor } from './logStyles'

const mushroomColors: Record<number, string> = {
  [MushroomColor.Blue]: '#4488cc',
  [MushroomColor.Green]: '#44aa55',
  [MushroomColor.Purple]: '#8855bb',
  [MushroomColor.Red]: '#cc4444',
  [MushroomColor.White]: '#ccccbb',
  [MushroomColor.Yellow]: '#ccaa33'
}

export const PlaceNotebookLog: FC<MoveComponentProps<MaterialMove>> = ({ move, context }) => {
  const player = context.action.playerId ?? context.game.rule?.player
  const name = usePlayerName(player)
  const { t } = useTranslation()
  const play = usePlay()

  const mushroomIndex = (move as MoveItem).location.id
  const rules = new AmaniteRules(context.game as MaterialGame)
  const mushroomCard = rules.material(MaterialType.MushroomCard).getItem(mushroomIndex!)
  const colorId = mushroomCard?.id as number
  const colorName = mushroomCard ? t(`mushroom.${colorId}`) : '?'
  const hex = mushroomColors[colorId] ?? '#ccc'

  const openHelp = () => {
    if (mushroomIndex !== undefined) {
      play(MaterialMoveBuilder.displayMaterialHelp(MaterialType.MushroomCard, mushroomCard!, mushroomIndex), { transient: true })
    }
  }

  return (
    <Trans i18nKey="log.place.notebook" defaults="<name>{player}</name> investigates <mushroom/>"
      values={{ player: name }}
      components={{
        name: <strong css={nameCss(getPlayerColor(player))} />,
        mushroom: <strong css={mushroomCss(hex)} onClick={openHelp}>{colorName}</strong>
      }} />
  )
}

const nameCss = (color: string) => css`font-weight: 600; color: ${color};`

const mushroomCss = (color: string) => css`
  font-weight: 700;
  color: ${color};
  text-decoration: underline;
  cursor: pointer;
  &:hover { filter: brightness(1.2); }
`