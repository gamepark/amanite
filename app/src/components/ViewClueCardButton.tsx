/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { Memory } from '@gamepark/amanite/rules/Memory'
import { ItemMenuButton, usePlay, useRules } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import { FC } from 'react'

type ViewClueCardButtonProps = {
  notebookIndex: number
  x?: number
  y?: number
}

export const ViewClueCardButton: FC<ViewClueCardButtonProps> = ({ notebookIndex, x = 1.6, y = 0 }) => {
  const rules = useRules<AmaniteRules>()
  const play = usePlay()
  if (!rules) return null

  const map = rules.remind<Record<number, number>>(Memory.NotebookCardMap) ?? {}
  const cardIndex = map[notebookIndex]
  if (cardIndex === undefined) return null

  const item = rules.material(MaterialType.ClueCard).index(cardIndex).getItem()
  if (!item || item.location.type !== LocationType.PlayerClueCards) return null

  const onClick = () => {
    play(MaterialMoveBuilder.displayMaterialHelp(MaterialType.ClueCard, item, cardIndex), { transient: true })
  }

  return (
    <ItemMenuButton onClick={onClick} x={x} y={y} css={buttonCss} title="Voir l'indice">
      <FontAwesomeIcon icon={faEye} css={iconCss} />
    </ItemMenuButton>
  )
}

const buttonCss = css`
  width: 1.6em;
  height: 1.6em;
  border-radius: 0.8em;
  background-color: #3432A0;
  color: #F0D040;
  border: 0.1em solid #F0D040;
  box-shadow: 0 0.1em 0.3em rgba(0, 0, 0, 0.5);
  padding: 0;

  &:hover {
    background-color: #4240B8;
    color: #FFE050;
  }
`

const iconCss = css`
  font-size: 0.7em;
`
