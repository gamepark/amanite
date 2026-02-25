/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { GameTable, GameTableNavigation } from '@gamepark/react-game'
import { PlayerPanels } from './panels/PlayerPanels'
import { ChooseStartCardSideDialog } from './headers/ChooseStartCardSideDialog'
import { AcknowledgeCluesDialog } from './headers/AcknowledgeCluesDialog'

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
      <AcknowledgeCluesDialog />
    </>
  )
}

const tableCss = css`
  background:
    /* Canopy glow — green light on the forest tile area */
    radial-gradient(ellipse 80% 40% at 50% 8%, rgba(22, 80, 32, 0.45) 0%, transparent 100%),
    /* Indigo shimmer — mushroom card zone */
    radial-gradient(ellipse 70% 30% at 45% 48%, rgba(45, 45, 122, 0.18) 0%, transparent 100%),
    /* Warm hearth — player zone at the bottom */
    radial-gradient(ellipse 90% 35% at 50% 96%, rgba(70, 42, 18, 0.30) 0%, transparent 100%),
    /* Base — deep forest floor at dusk */
    linear-gradient(172deg, #0c1e12 0%, #0e1525 42%, #14100c 100%);
`
