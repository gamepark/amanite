/** @jsxImportSource @emotion/react */
import { useDndMonitor } from '@dnd-kit/core'
import { css } from '@emotion/react'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'
import { mushroomColors } from '@gamepark/amanite/material/MushroomColor'
import { isPig } from '@gamepark/amanite/material/RoundTokenId'
import { StyledPlayerPanel, useRules, usePlayers, CounterProps, useMaterialContext, getRelativePlayerIndex, usePlay } from '@gamepark/react-game'
import { LocalMoveType, MoveKind } from '@gamepark/rules-api'
import { createPortal } from 'react-dom'
import BlueToken from '../images/tokens/round/BlueMushroomToken.jpg'
import GreenToken from '../images/tokens/round/GreenMushroomToken.jpg'
import PurpleToken from '../images/tokens/round/PurpleMushroomToken.jpg'
import RedToken from '../images/tokens/round/RedMushroomToken.jpg'
import WhiteToken from '../images/tokens/round/WhiteMushroomToken.jpg'
import YellowToken from '../images/tokens/round/YellowMushroomToken.jpg'
import PigToken from '../images/tokens/round/PigToken.jpg'
import ClueCardBack from '../images/cards/clue/ClueCardBack.jpg'
import FoxBookToken from '../images/tokens/book/FoxBookToken.png'
import SquirrelBookToken from '../images/tokens/book/SquirrelBookToken.png'
import OwlBookToken from '../images/tokens/book/OwlBookToken.png'
import JayBookToken from '../images/tokens/book/JayBookToken.png'

const bookTokenImages: Record<number, string> = {
  [PlayerAnimal.Fox]: FoxBookToken,
  [PlayerAnimal.Squirrel]: SquirrelBookToken,
  [PlayerAnimal.Owl]: OwlBookToken,
  [PlayerAnimal.Jay]: JayBookToken
}

const playerColorCode: Record<number, string> = {
  [PlayerAnimal.Fox]: '#D4722A',
  [PlayerAnimal.Squirrel]: '#B84032',
  [PlayerAnimal.Owl]: '#7B7D7E',
  [PlayerAnimal.Jay]: '#3B7BB5'
}

const tokenImages: Record<number, string> = {
  1: BlueToken, 2: GreenToken, 3: PurpleToken,
  4: RedToken, 5: WhiteToken, 6: YellowToken, 7: PigToken
}

const tokenImageCss = css`
  border-radius: 50%;
`

export const PlayerPanels = () => {
  const players = usePlayers<PlayerAnimal>({ sortFromMe: true })
  const rules = useRules<AmaniteRules>()
  const context = useMaterialContext()
  const play = usePlay()
  useDndMonitor({ onDragStart: () => play({ kind: MoveKind.LocalMove, type: LocalMoveType.ChangeView, view: undefined }, { transient: true }) })
  const root = document.getElementById('root')
  if (!root) return null

  return createPortal(
    <>
      {players.map((player) => {
        const counters: CounterProps[] = []
        const index = getRelativePlayerIndex(context, player.id)
        const isViewActive = (!rules?.game.view && player.id === players[0]?.id) || rules?.game.view === player.id

        if (rules) {
          for (const color of mushroomColors) {
            const count = rules.material(MaterialType.RoundToken)
              .location(LocationType.PlayerTokens)
              .player(player.id)
              .id(color)
              .length
            if (count > 0) {
              counters.push({
                image: tokenImages[color],
                imageCss: tokenImageCss,
                value: count
              })
            }
          }

          const pigCount = rules.material(MaterialType.RoundToken)
            .location(LocationType.PlayerTokens)
            .player(player.id)
            .filter(item => isPig(item.id))
            .length
          if (pigCount > 0) {
            counters.push({
              image: tokenImages[7],
              imageCss: tokenImageCss,
              value: pigCount
            })
          }

          const clueCount = rules.material(MaterialType.ClueCard)
            .location(LocationType.PlayerClueCards)
            .player(player.id)
            .length
          if (clueCount > 0) {
            counters.push({
              image: ClueCardBack,
              value: clueCount
            })
          }

          const notebookCount = rules.material(MaterialType.NotebookToken)
            .location(LocationType.PlayerNotebookStock)
            .player(player.id)
            .length
          if (notebookCount > 0) {
            counters.push({
              image: bookTokenImages[player.id] ?? FoxBookToken,
              imageCss: tokenImageCss,
              value: notebookCount
            })
          }
        }

        return (
          <StyledPlayerPanel
            key={player.id}
            player={player}
            color={playerColorCode[player.id]}
            css={panelPosition(index, isViewActive)}
            activeRing
            counters={counters}
            onClick={(e) => {
              e?.preventDefault()
              e?.stopPropagation()
              play({ kind: MoveKind.LocalMove, type: LocalMoveType.ChangeView, view: player.id }, { transient: true })
            }}
          />
        )
      })}
    </>,
    root
  )
}

const panelPosition = (index: number, active: boolean) => css`
  position: absolute;
  right: 1em;
  top: ${8.5 + index * 16}em;
  width: 28em;
  cursor: pointer;
  box-shadow: ${active ? '0 0 0.2em 0.4em rgba(255, 255, 255, 0.7)' : 'none'};
  transition: box-shadow 0.2s;
`
