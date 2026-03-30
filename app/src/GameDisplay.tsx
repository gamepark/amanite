/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { DevToolsHub, GameTable } from '@gamepark/react-game'
import { PlayerPanels } from './panels/PlayerPanels'
import { ChooseStartCardSideDialog } from './headers/ChooseStartCardSideDialog'

export function GameDisplay() {
  const margin = { top: 7, left: 0, right: 0, bottom: 0 }
  return (
    <>
      <GameTable
        xMin={-42} xMax={44} yMin={-16} yMax={28}
        margin={margin}
        verticalCenter
        css={process.env.NODE_ENV === 'development' && tableBorder}
      >
        <PlayerPanels />
        {import.meta.env.DEV && <DevToolsHub />}
      </GameTable>
      <ChooseStartCardSideDialog />
    </>
  )
}

const tableBorder = css`
  border: 1px solid white;
`