/** @jsxImportSource @emotion/react */
import { useDndMonitor } from '@dnd-kit/core'
import { css, keyframes } from '@emotion/react'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'
import { mushroomColors, MushroomColor } from '@gamepark/amanite/material/MushroomColor'
import { isPig } from '@gamepark/amanite/material/RoundTokenId'
import { Avatar, PlayerTimer, SpeechBubbleDirection, useMaterialContext, usePlayerName, usePlayers, usePlay, useRules, getRelativePlayerIndex } from '@gamepark/react-game'
import { LocalMoveType, MoveKind } from '@gamepark/rules-api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { FC, useRef } from 'react'
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
import FoxCard from '../images/cards/start/FoxCard1.jpg'
import SquirrelCard from '../images/cards/start/SquirrelCard1.jpg'
import OwlCard from '../images/cards/start/OwlCard1.jpg'
import JayCard from '../images/cards/start/JayCard1.jpg'

const bannerImages: Record<number, string> = {
  [PlayerAnimal.Fox]: FoxCard,
  [PlayerAnimal.Squirrel]: SquirrelCard,
  [PlayerAnimal.Owl]: OwlCard,
  [PlayerAnimal.Jay]: JayCard
}

const bookTokenImages: Record<number, string> = {
  [PlayerAnimal.Fox]: FoxBookToken,
  [PlayerAnimal.Squirrel]: SquirrelBookToken,
  [PlayerAnimal.Owl]: OwlBookToken,
  [PlayerAnimal.Jay]: JayBookToken
}

const playerColors: Record<number, { main: string }> = {
  [PlayerAnimal.Fox]: { main: '#D4722A' },
  [PlayerAnimal.Squirrel]: { main: '#B84032' },
  [PlayerAnimal.Owl]: { main: '#7B7D7E' },
  [PlayerAnimal.Jay]: { main: '#3B7BB5' }
}

const tokenImages: Record<number, string> = {
  [MushroomColor.Blue]: BlueToken,
  [MushroomColor.Green]: GreenToken,
  [MushroomColor.Purple]: PurpleToken,
  [MushroomColor.Red]: RedToken,
  [MushroomColor.White]: WhiteToken,
  [MushroomColor.Yellow]: YellowToken,
  7: PigToken
}

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
        const index = getRelativePlayerIndex(context, player.id)
        const isViewActive = (!rules?.game.view && player.id === players[0]?.id) || rules?.game.view === player.id
        const isTurnToPlay = rules?.isTurnToPlay(player.id) ?? false

        const mushroomCounts: { image: string, count: number }[] = []
        let pigCount = 0
        let clueCount = 0
        let notebookCount = 0

        if (rules) {
          for (const color of mushroomColors) {
            mushroomCounts.push({
              image: tokenImages[color],
              count: rules.material(MaterialType.RoundToken)
                .location(LocationType.PlayerTokens)
                .player(player.id)
                .id(color)
                .length
            })
          }
          pigCount = rules.material(MaterialType.RoundToken)
            .location(LocationType.PlayerTokens)
            .player(player.id)
            .filter(item => isPig(item.id))
            .length
          clueCount = rules.material(MaterialType.ClueCard)
            .location(LocationType.PlayerClueCards)
            .player(player.id)
            .length
          notebookCount = rules.material(MaterialType.NotebookToken)
            .location(LocationType.PlayerNotebookStock)
            .player(player.id)
            .length
        }

        return (
          <PlayerPanel
            key={player.id}
            playerId={player.id}
            index={index}
            isViewActive={isViewActive}
            isTurnToPlay={isTurnToPlay}
            gameOver={rules?.isOver() ?? false}
            mushroomCounts={mushroomCounts}
            pigCount={pigCount}
            clueCount={clueCount}
            notebookCount={notebookCount}
            onClick={() => play({ kind: MoveKind.LocalMove, type: LocalMoveType.ChangeView, view: player.id }, { transient: true })}
          />
        )
      })}
    </>,
    root
  )
}

type PlayerPanelProps = {
  playerId: PlayerAnimal
  index: number
  isViewActive: boolean
  isTurnToPlay: boolean
  gameOver: boolean
  mushroomCounts: { image: string, count: number }[]
  pigCount: number
  clueCount: number
  notebookCount: number
  onClick: () => void
}

const PlayerPanel: FC<PlayerPanelProps> = ({
  playerId, index, isViewActive, isTurnToPlay, gameOver,
  mushroomCounts, pigCount, clueCount, notebookCount, onClick
}) => {
  const playerName = usePlayerName(playerId)
  const colors = playerColors[playerId]
  const panelRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={panelRef} css={[panelCss, positionCss(index), isViewActive && activeGlowCss(colors.main), isTurnToPlay && turnToPlayCss]} onClick={onClick}>
      {/* Banner: art background + avatar + name + timer */}
      <div css={bannerCss}>
        <div css={bannerBgCss(bannerImages[playerId])} />
        <div css={bannerOverlayCss} />
        <div css={avatarWrapperCss}>
          <Avatar playerId={playerId} css={avatarCss} speechBubbleProps={{ direction: getSpeechDirection(panelRef.current) }} />
        </div>
        <span css={nameCss}>{playerName}</span>
        {isViewActive && <FontAwesomeIcon icon={faEye} css={eyeIconCss} />}
        {!gameOver && <PlayerTimer playerId={playerId} css={timerCss} />}
      </div>

      {/* Body: solid dark background */}
      <div css={[bodyCss, isViewActive ? borderTopActiveCss(colors.main) : borderTopInactiveCss]}>
        {/* Token grid: 7 columns */}
        <div css={gridTokensCss}>
          {mushroomCounts.map((m, i) => (
            <div key={i} css={[gridCellCss, m.count === 0 && dimCss]}>
              <img src={m.image} css={tokenIconCss} alt="" />
              <span css={countCss(m.count > 0)}>{m.count}</span>
            </div>
          ))}
          <div css={[gridCellCss, pigCount === 0 && dimCss]}>
            <img src={tokenImages[7]} css={tokenIconCss} alt="" />
            <span css={countCss(pigCount > 0)}>{pigCount}</span>
          </div>
        </div>

        {/* Bottom row: clues + notebooks */}
        <div css={footCss}>
          <div css={[footBadgeCss, clueCount === 0 && dimCss]}>
            <img src={ClueCardBack} css={cardIconCss} alt="" />
            <span css={footCountCss}>{clueCount}</span>
          </div>
          <div css={[footBadgeCss, notebookCount === 0 && dimCss]}>
            <img src={bookTokenImages[playerId]} css={bookIconCss} alt="" />
            <span css={footCountCss}>{notebookCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const getSpeechDirection = (el: HTMLDivElement | null): SpeechBubbleDirection => {
  if (!el) return SpeechBubbleDirection.BOTTOM_RIGHT
  const rect = el.getBoundingClientRect()
  const top = rect.top / window.innerHeight
  return top > 0.5 ? SpeechBubbleDirection.TOP_LEFT : SpeechBubbleDirection.BOTTOM_LEFT
}

// ============ CSS ============

const panelCss = css`
  position: absolute;
  z-index: 100;
  right: 1em;
  width: 22em;
  border-radius: 0.7em;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  font-size: 1.4em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  transition: box-shadow 0.3s, transform 0.2s;

  &:hover {
    transform: translateX(-2px);
  }
`

const activeGlowCss = (color: string) => css`
  outline: 2.5px solid ${color};
  outline-offset: -1px;
  box-shadow: 0 0 16px ${color}66, 0 0 4px ${color}44, 0 3px 12px rgba(0, 0, 0, 0.5);
`


const positionCss = (index: number) => css`
  top: ${8.5 + index * 15}em;
`

// --- Banner ---

const bannerCss = css`
  position: relative;
  padding: 0.5em 0.7em;
  display: flex;
  align-items: center;
  gap: 0.5em;
  min-height: 3.5em;
  overflow: hidden;
  border-radius: 0.7em 0.7em 0 0;
`

const bannerBgCss = (image: string) => css`
  position: absolute;
  inset: 0;
  background: url('${image}') center/cover;
  background-position: 65% 30%;
  filter: brightness(0.55) saturate(0.9);
`

const bannerOverlayCss = css`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 0.3) 100%);
`

const borderTravel = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 200% 0%; }
`

const turnToPlayCss = css`
  &::before {
    content: '';
    position: absolute;
    inset: -0.25em;
    z-index: -1;
    border-radius: 0.8em;
    background: linear-gradient(90deg, transparent, gold, rgb(40, 184, 206), transparent, gold, rgb(40, 184, 206), transparent);
    background-size: 200% 100%;
    animation: ${borderTravel} 2s linear infinite;
  }
`

const avatarWrapperCss = css`
  position: relative;
  width: 2.5em;
  height: 2.5em;
  flex-shrink: 0;
  z-index: 1;
`

const avatarCss = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  z-index: 1;
`


const nameCss = css`
  position: relative;
  z-index: 1;
  flex: 1;
  font-weight: 900;
  font-size: 1.05em;
  color: #fff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const timerCss = css`
  position: relative;
  z-index: 1;
  font-size: 0.8em;
  font-weight: 700;
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
  padding: 0.1em 0.45em;
  border-radius: 0.3em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
`

const eyeIconCss = css`
  position: relative;
  z-index: 1;
  font-size: 0.75em;
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
`

// --- Body ---

const bodyCss = css`
  background: linear-gradient(180deg, #181E18 0%, #141a14 100%);
  padding: 0.5em 0.7em;
  display: flex;
  flex-direction: column;
  gap: 0.35em;
  border-radius: 0 0 0.7em 0.7em;
`

const borderTopActiveCss = (color: string) => css`
  border-top: 2px solid ${color};
`

const borderTopInactiveCss = css`
  border-top: 2px solid rgba(255, 255, 255, 0.08);
`

// --- Token grid ---

const gridTokensCss = css`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.15em;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 0.4em;
  padding: 0.3em 0.15em;
`

const gridCellCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.12em;
`

const dimCss = css`
  opacity: 0.15;
`

const tokenIconCss = css`
  width: 2.1em;
  height: 2.1em;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
`

const countCss = (hasTokens: boolean) => css`
  font-size: 1.05em;
  font-weight: 900;
  color: ${hasTokens ? '#fff' : 'rgba(255, 255, 255, 0.2)'};
  min-width: 0.7em;
  text-align: center;
  text-shadow: ${hasTokens ? '0 1px 2px rgba(0, 0, 0, 0.4)' : 'none'};
`

// --- Footer ---

const footCss = css`
  display: flex;
  gap: 0.35em;
`

const footBadgeCss = css`
  display: flex;
  align-items: center;
  gap: 0.2em;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.35em;
  padding: 0.1em 0.35em;
`

const cardIconCss = css`
  width: 1.4em;
  height: 2em;
  border-radius: 0.15em;
  object-fit: cover;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
`

const bookIconCss = css`
  width: 1.5em;
  height: 2em;
  border-radius: 0.2em;
  object-fit: cover;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
`

const footCountCss = css`
  font-size: 0.9em;
  font-weight: 900;
  color: #ddd;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
`
