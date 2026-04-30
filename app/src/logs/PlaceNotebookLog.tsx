/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { MoveComponentProps, usePlayerName, usePlay, useMaterialContext } from '@gamepark/react-game'
import { MaterialMove, MoveItem } from '@gamepark/rules-api'
import { MaterialMoveBuilder } from '@gamepark/rules-api/dist/material/moves/MaterialMoveBuilder'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { MushroomColor } from '@gamepark/amanite/material/MushroomColor'
import { getPlayerColor } from './logStyles'

const mushroomHex: Record<number, string> = {
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
  const materialContext = useMaterialContext()

  const colorId = (move as MoveItem).location.id as number | undefined
  const mushroomCard = colorId !== undefined
    ? materialContext.material[MaterialType.MushroomCard]?.getStaticItems(materialContext).find(item => item.id === colorId)
    : undefined
  const colorName = colorId !== undefined ? t(`mushroom.${colorId}`) : '?'
  const hex = colorId !== undefined ? (mushroomHex[colorId] ?? '#ccc') : '#ccc'

  const openHelp = () => {
    if (mushroomCard) {
      play(MaterialMoveBuilder.displayMaterialHelp(MaterialType.MushroomCard, mushroomCard), { transient: true })
    }
  }

  return (
    <Trans i18nKey="log.place.notebook"
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