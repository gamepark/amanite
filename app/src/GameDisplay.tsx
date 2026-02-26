/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { GameTable, GameTableNavigation } from '@gamepark/react-game'
import { PlayerPanels } from './panels/PlayerPanels'
import { ChooseStartCardSideDialog } from './headers/ChooseStartCardSideDialog'

export function GameDisplay() {
  const margin = { top: 7, left: 0, right: 0, bottom: 0 }
  return (
    <>
      <GameTable
        xMin={-42} xMax={42} yMin={-16} yMax={28}
        margin={margin}
        css={tableCss}
      >
        <GameTableNavigation />
        <PlayerPanels />
      </GameTable>
      <ChooseStartCardSideDialog />
    </>
  )
}

const tableCss = css``
