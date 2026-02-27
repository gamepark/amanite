/** @jsxImportSource @emotion/react */
import { css, Global } from '@emotion/react'
import { FailuresDialog, FullscreenDialog, LoadingScreen, MaterialGameSounds, MaterialHeader, MaterialImageLoader, Menu, useGame } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { useEffect, useState } from 'react'
import { GameDisplay } from './GameDisplay'
import { Headers } from './headers/Headers'

export function App() {
  const game = useGame<MaterialGame>()
  const [isJustDisplayed, setJustDisplayed] = useState(true)
  const [isImagesLoading, setImagesLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), process.env.NODE_ENV === 'development' ? 0 : 2000)
  }, [])
  useEffect(() => {
    if (game?.helpDisplay) {
      document.documentElement.classList.add('help-open')
    } else {
      document.documentElement.classList.remove('help-open')
    }
  }, [game?.helpDisplay])
  const loading = !game || isJustDisplayed || isImagesLoading
  return (
    <>
      <Global styles={helpDialogOverrides} />
      {!!game && <GameDisplay />}
      <LoadingScreen display={loading} />
      <MaterialHeader rulesStepsHeaders={Headers} loading={loading} />
      <MaterialImageLoader onImagesLoad={() => setImagesLoading(false)} />
      <MaterialGameSounds />
      <Menu />
      <FailuresDialog />
      <FullscreenDialog />
    </>
  )
}

const helpDialogOverrides = css`
  /* Close button (X) — only in help dialogs (those containing navigation arrows) */
  .help-open div:has(.fa-chevron-left) > .svg-inline--fa.fa-xmark,
  .help-open div:has(.fa-chevron-right) > .svg-inline--fa.fa-xmark {
    top: -0.4em !important;
    right: -0.4em !important;
    width: 0.8em !important;
    height: 0.8em !important;
    padding: 0.2em;
    background: linear-gradient(145deg, #3a3a8a, #2d2d7a);
    color: #f0e8c8;
    border-radius: 50%;
    border: 2px solid rgba(240, 232, 200, 0.3);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    z-index: 100;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
      background: linear-gradient(145deg, #4a4a9a, #3a3a8a);
    }
  }

  /* Navigation arrows — circular cream buttons */
  .help-open div:has(> .fa-chevron-left),
  .help-open div:has(> .fa-chevron-right) {
    z-index: 1 !important;
    background: #f0e8c8 !important;
    border: 2px solid rgba(45, 45, 122, 0.25) !important;
    border-radius: 50% !important;
    box-shadow: 0 0.08em 0.25em rgba(0, 0, 0, 0.2) !important;
    color: #2d2d7a !important;
    width: 1em !important;
    height: 1em !important;
    padding: 0 !important;
    transition: all 0.15s ease !important;
    animation: none !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;

    & > svg {
      width: 0.4em !important;
      height: 0.4em !important;
    }

    &:hover {
      background: #e8deb8 !important;
      border-color: rgba(45, 45, 122, 0.4) !important;
      box-shadow: 0 0.1em 0.35em rgba(0, 0, 0, 0.25) !important;
      transform: translateY(-50%) scale(1.08) !important;
    }

    &:active {
      background: #ddd4a8 !important;
      box-shadow: 0 0.04em 0.1em rgba(0, 0, 0, 0.15) !important;
      transform: translateY(-50%) scale(0.95) !important;
    }
  }

  .help-open div:has(> .fa-chevron-left) {
    left: -0.6em !important;
  }

  .help-open div:has(> .fa-chevron-right) {
    right: -0.6em !important;
  }
`
