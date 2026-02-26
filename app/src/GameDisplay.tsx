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
        <GameTableNavigation css={navCss} />
        <PlayerPanels />
      </GameTable>
      <ChooseStartCardSideDialog />
    </>
  )
}

const tableCss = css``

const navCss = css`
  flex-direction: column;
  gap: 0;
  top: auto;
  bottom: 1.5em;
  left: 1.5em;
  background: linear-gradient(180deg, rgba(21, 43, 26, 0.85) 0%, rgba(12, 30, 18, 0.92) 100%);
  border: 1px solid rgba(42, 74, 46, 0.5);
  border-radius: 2em;
  padding: 0.3em;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04);

  > button {
    font-size: 2em !important;
    width: 2.2em !important;
    height: 2.2em !important;
    border: none !important;
    border-radius: 2em !important;
    background: transparent !important;
    color: rgba(200, 191, 160, 0.7) !important;
    filter: none !important;
    transition: all 0.2s ease !important;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;

    &:not(:disabled):hover,
    &:not(:disabled):focus {
      background: rgba(42, 74, 46, 0.6) !important;
      color: #f0e8c8 !important;
      transform: none !important;
    }

    &:not(:disabled):active {
      background: rgba(212, 146, 42, 0.2) !important;
      color: #d4922a !important;
      transform: scale(0.92) !important;
    }

    &:disabled {
      color: rgba(200, 191, 160, 0.2) !important;
      border-color: transparent !important;
    }
  }

  > button + button {
    border-top: 1px solid rgba(200, 210, 195, 0.1);
  }
`
