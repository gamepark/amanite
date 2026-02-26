import { AmaniteOptionsSpec } from '@gamepark/amanite/AmaniteOptions'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'
import { AmaniteSetup } from '@gamepark/amanite/AmaniteSetup'
import { GameProvider, setupTranslation } from '@gamepark/react-game'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gameAnimations } from './animations/GameAnimations'
import { App } from './App'
import { Locators } from './locators/Locators'
import { Material } from './material/Material'
import { ai } from './tutorial/TutorialAi'
import { Tutorial } from './tutorial/Tutorial'
import { AmaniteScoring } from './scoring/AmaniteScoring'
import translations from './translations.json'

setupTranslation(translations, { debug: false })

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
      scoring={new AmaniteScoring()}
      tutorial={new Tutorial()}
      ai={ai}
    >
      <App />
    </GameProvider>
  </StrictMode>
)
