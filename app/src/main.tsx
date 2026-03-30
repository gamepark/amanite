import { css } from '@emotion/react'
import { BottomBarNavigation } from '@gamepark/react-game'
import { AmaniteOptionsSpec } from '@gamepark/amanite/AmaniteOptions'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'
import { AmaniteSetup } from '@gamepark/amanite/AmaniteSetup'
import { GameProvider } from '@gamepark/react-game'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gameAnimations } from './animations/GameAnimations'
import { App } from './App'
import { Locators } from './locators/Locators'
import { AmaniteLogs } from './logs/AmaniteLogs'
import { Material } from './material/Material'
import { ai } from './tutorial/TutorialAi'
import { Tutorial } from './tutorial/Tutorial'
import { AmaniteScoring } from './scoring/AmaniteScoring'

const theme = {
  root: {
    fontFamily: 'Baloo 2'
  },
  palette: {
    primary: '#4a7c3a',
    primaryHover: '#5a9248',
    primaryActive: '#3d6830',
    primaryLight: '#6aad55',
    primaryLighter: '#a8d49a',
    surface: '#f0e8c8',
    onSurface: '#2d1f0e',
    onSurfaceFocus: '#4a7c3a',
    onSurfaceActive: '#3d6830',
    danger: '#a83232',
    dangerHover: '#c03a3a',
    dangerActive: '#8a2828',
    disabled: '#8a8070'
  },
  dialog: {
    backgroundColor: '#f0e8c8',
    color: '#2d1f0e',
    navigation: BottomBarNavigation,
    container: css`
      border: 2px solid #4a7c3a;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    `,
    backdrop: css`
      background: rgba(10, 18, 8, 0.7);
    `
  },
  buttons: css`
    padding: 0.2em 0.6em;
    border-radius: 0.4em;
    border: 1.5px solid #4a7c3a;
    background: linear-gradient(180deg, #f0e8c8 0%, #e8deb8 100%);
    color: #2d1f0e;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

    &:hover {
      background: linear-gradient(180deg, #e8deb8 0%, #ddd4a8 100%);
      border-color: #5a9248;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.18);
    }

    &:active {
      background: #ddd4a8;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
      transform: scale(0.96);
    }
  `,
  dropArea: {
    backgroundColor: 'rgba(140, 200, 110, 0.35)'
  },
  header: {
    bar: css`
      background: linear-gradient(180deg, rgba(26, 42, 18, 0.92) 0%, rgba(15, 26, 11, 0.88) 100%);
      border-bottom: 1px solid rgba(74, 124, 58, 0.4);
      color: #e8deb8;
    `,
    buttons: css`
      border-color: #4a7c3a;
      background: linear-gradient(180deg, #3a5c2e 0%, #2e4a24 100%);
      color: #e8deb8;
      font-family: 'Baloo 2', cursive;
      font-weight: 700;
      font-size: 0.85em;
      padding: 0.1em 0.5em;
      border-radius: 0.6em;
      letter-spacing: 0.02em;
      text-transform: none;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);

      &:hover {
        background: linear-gradient(180deg, #4a7c3a 0%, #3a5c2e 100%);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
      }

      &:active {
        background: #2e4a24;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
      }
    `
  },
  menu: {
    panel: css`
      background: linear-gradient(180deg, #f0e8c8 0%, #e4dab4 100%);
      border: 1px solid #4a7c3a;
    `,
    button: css`
      color: #2d1f0e;
      &:hover {
        background: rgba(74, 124, 58, 0.12);
      }
    `,
    mainButton: css`
      background: linear-gradient(180deg, #4a7c3a 0%, #3a5c2e 100%);
      color: #f0e8c8;
      border: none;
      &:hover {
        background: linear-gradient(180deg, #5a9248 0%, #4a7c3a 100%);
      }
    `
  },
  journal: {
    tab: css`
      background: rgba(26, 42, 18, 0.8);
      color: #c8c0a0;
    `,
    tabSelected: css`
      background: rgba(74, 124, 58, 0.4);
      color: #f0e8c8;
    `,
    historyEntry: css`
      background: rgba(240, 232, 200, 0.06);
      border-radius: 0.3em;
      font-size: 1.8em;
    `
  },
  result: {
    border: '#4a7c3a',
    icon: '#6aad55',
    container: css`
      background: linear-gradient(180deg, #f0e8c8 0%, #e4dab4 100%);
      color: #2d1f0e;
    `
  },
  tutorial: {
    container: css`
      background: #f0e8c8;
      border: 2px solid #4a7c3a;
      color: #2d1f0e;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
    `
  },
  timeStats: {
    container: css`
      background: linear-gradient(180deg, #f0e8c8 0%, #e4dab4 100%);
      color: #2d1f0e;
      border: 1px solid #4a7c3a;
    `,
    thinkBackground: '#dcefd5',
    waitBackground: '#e8e0cc'
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider
      game="amanite"
      Rules={AmaniteRules}
      optionsSpec={AmaniteOptionsSpec}
      GameSetup={AmaniteSetup}
      material={Material}
      locators={Locators}
      animations={gameAnimations}
      logs={new AmaniteLogs()}
      scoring={new AmaniteScoring()}
      tutorial={new Tutorial()}
      ai={ai}
      theme={theme}
    >
      <App />
    </GameProvider>
  </StrictMode>
)
