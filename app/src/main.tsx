import { css } from '@emotion/react'
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
  dialog: {
    backgroundColor: '#f0e8c8',
    color: '#2d2d7a'
  },
  buttons: css`
    padding: 0.2em 0.6em;
    border-radius: 0.4em;
    border: 1.5px solid #2d2d7a;
    background: linear-gradient(180deg, #f0e8c8 0%, #e8deb8 100%);
    color: #2d2d7a;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

    &:hover {
      background: linear-gradient(180deg, #e8deb8 0%, #ddd4a8 100%);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.18);
    }

    &:active {
      background: #ddd4a8;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
      transform: scale(0.96);
    }
  `
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
