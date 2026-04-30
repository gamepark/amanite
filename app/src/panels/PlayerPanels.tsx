/** @jsxImportSource @emotion/react */
import { useDndMonitor } from '@dnd-kit/core'
import { css, keyframes } from '@emotion/react'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'
import { mushroomColors, MushroomColor } from '@gamepark/amanite/material/MushroomColor'
import { ValueType } from '@gamepark/amanite/material/ValueType'
import { isPig } from '@gamepark/amanite/material/RoundTokenId'
import { ScoringHelper } from '@gamepark/amanite/rules/helper/ScoringHelper'
import { Avatar, PlayerTimer, SpeechBubbleDirection, useMaterialContext, usePlayerName, usePlayers, usePlay, useRules, getRelativePlayerIndex } from '@gamepark/react-game'
import { LocalMoveType, MoveKind } from '@gamepark/rules-api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faHeart, faSkull } from '@fortawesome/free-solid-svg-icons'
import { FC, useCallback, useLayoutEffect, useRef, useState } from 'react'
import BlueToken from '../images/tokens/round/BlueMushroomToken.jpg'
import GreenToken from '../images/tokens/round/GreenMushroomToken.jpg'
import PurpleToken from '../images/tokens/round/PurpleMushroomToken.jpg'
import RedToken from '../images/tokens/round/RedMushroomToken.jpg'
import WhiteToken from '../images/tokens/round/WhiteMushroomToken.jpg'
import YellowToken from '../images/tokens/round/YellowMushroomToken.jpg'
import PigToken from '../images/tokens/round/PigToken.jpg'
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

const playerColors: Record<number, { main: string }> = {
  [PlayerAnimal.Fox]: { main: '#A8C46A' },
  [PlayerAnimal.Squirrel]: { main: '#D4722A' },
  [PlayerAnimal.Owl]: { main: '#2A2A2A' },
  [PlayerAnimal.Jay]: { main: '#8B6040' }
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
  const defaultPlayer = players[0]?.id
  const resetView = useCallback(() => {
    if (rules?.game.view !== undefined && rules?.game.view !== defaultPlayer) {
      play({ kind: MoveKind.LocalMove, type: LocalMoveType.ChangeView, view: defaultPlayer }, { transient: true })
    }
  }, [defaultPlayer, play, rules])
  useDndMonitor({ onDragStart: resetView })

  return (
    <>
      {players.map((player) => {
        const index = getRelativePlayerIndex(context, player.id)
        const isViewActive = (!rules?.game.view && player.id === players[0]?.id) || rules?.game.view === player.id
        const isTurnToPlay = rules?.isTurnToPlay(player.id) ?? false

        const mushroomCounts: { image: string, count: number }[] = []
        const colorScores: ColorScore[] = []
        let pigCount = 0
        let pigScore = 0
        let totalScore = 0
        let isEliminated = false

        if (rules) {
          const helper = new ScoringHelper(rules.game, player.id)
          const mapping = helper.mushroomValueMapping
          for (const color of mushroomColors) {
            mushroomCounts.push({
              image: tokenImages[color],
              count: rules.material(MaterialType.RoundToken)
                .location(LocationType.PlayerTokens)
                .player(player.id)
                .id(color)
                .length
            })
            const value = mapping[color]
            if (value === undefined) {
              colorScores.push({ kind: 'hidden' })
            } else if (value === ValueType.Poison) {
              colorScores.push({ kind: helper.isPoisonSurvived ? 'poison-alive' : 'poison-dead' })
            } else {
              colorScores.push({ kind: 'value', score: helper.getColorPanelScore(color) })
            }
          }
          pigCount = rules.material(MaterialType.RoundToken)
            .location(LocationType.PlayerTokens)
            .player(player.id)
            .filter(item => isPig(item.id))
            .length
          pigScore = helper.pigScore
          totalScore = helper.score
          isEliminated = helper.isEliminated
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
            colorScores={colorScores}
            pigScore={pigScore}
            totalScore={totalScore}
            isEliminated={isEliminated}
            onClick={() => play({ kind: MoveKind.LocalMove, type: LocalMoveType.ChangeView, view: player.id }, { transient: true })}
          />
        )
      })}
    </>
  )
}

type ColorScore =
  | { kind: 'hidden' }
  | { kind: 'value', score: number }
  | { kind: 'poison-alive' }
  | { kind: 'poison-dead' }

type PlayerPanelProps = {
  playerId: PlayerAnimal
  index: number
  isViewActive: boolean
  isTurnToPlay: boolean
  gameOver: boolean
  mushroomCounts: { image: string, count: number }[]
  pigCount: number
  colorScores: ColorScore[]
  pigScore: number
  totalScore: number
  isEliminated: boolean
  onClick: () => void
}

const PlayerPanel: FC<PlayerPanelProps> = ({
  playerId, index, isViewActive, isTurnToPlay, gameOver,
  mushroomCounts, pigCount, colorScores, pigScore, totalScore, isEliminated, onClick
}) => {
  const playerName = usePlayerName(playerId)
  const colors = playerColors[playerId]
  const panelRef = useRef<HTMLDivElement>(null)
  const [speechDirection, setSpeechDirection] = useState<SpeechBubbleDirection>(SpeechBubbleDirection.BOTTOM_RIGHT)

  useLayoutEffect(() => {
    setSpeechDirection(getSpeechDirection(panelRef.current))
  }, [index])

  return (
    <div ref={panelRef} css={[panelCss, positionCss(index), isTurnToPlay && turnBorderCss, isViewActive && !isTurnToPlay && activeGlowCss(colors.main)]} onClick={onClick}>
      {/* Banner: art background + avatar + name + timer */}
      <div css={bannerCss}>
        <div css={bannerBgCss(bannerImages[playerId])} />
        <div css={bannerOverlayCss} />
        <div css={avatarWrapperCss}>
          <Avatar playerId={playerId} css={avatarCss} speechBubbleProps={{ direction: speechDirection }} />
        </div>
        <span css={nameCss}>{playerName}</span>
        {isViewActive && <FontAwesomeIcon icon={faEye} css={eyeIconCss} />}
        {gameOver
          ? <span css={[finalScoreCss, isEliminated && finalScoreEliminatedCss]}>{totalScore}</span>
          : <PlayerTimer playerId={playerId} css={timerCss} />}
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

        {/* Score row: per-color score (revealed only) + pig score */}
        <div css={gridScoresCss}>
          {colorScores.map((s, i) => <ScoreCell key={i} score={s} />)}
          <div css={scoreCellCss}>
            {pigCount > 0 && <span css={scoreNumberCss(pigScore)}>{formatScore(pigScore)}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

const formatScore = (n: number): string => n > 0 ? `+${n}` : `${n}`

const ScoreCell: FC<{ score: ColorScore }> = ({ score }) => {
  if (score.kind === 'hidden') {
    return <div css={scoreCellCss} />
  }
  if (score.kind === 'poison-alive') {
    return (
      <div css={scoreCellCss}>
        <FontAwesomeIcon icon={faHeart} css={poisonAliveIconCss} />
      </div>
    )
  }
  if (score.kind === 'poison-dead') {
    return (
      <div css={scoreCellCss}>
        <FontAwesomeIcon icon={faSkull} css={poisonDeadIconCss} />
      </div>
    )
  }
  return (
    <div css={scoreCellCss}>
      <span css={scoreNumberCss(score.score)}>{formatScore(score.score)}</span>
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
  isolation: isolate;
  right: 0.5em;
  width: 22em;
  border-radius: 0.7em;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  font-size: 0.7em;
  box-shadow: 0 0.15em 0.5em rgba(0, 0, 0, 0.4);
  transition: box-shadow 0.3s, transform 0.2s;
  transform: translate3d(0, 0, 0);

  &:hover {
    transform: translate3d(-2px, 0, 0);
  }
`

const activeGlowCss = (color: string) => css`
  outline: 0.15em solid ${color};
  outline-offset: -0.06em;
  box-shadow: 0 0 1em ${color}66, 0 0 0.25em ${color}44, 0 0.2em 0.75em rgba(0, 0, 0, 0.5);
`


const positionCss = (index: number) => css`
  top: ${1.5 + index * 14}em;
`

// --- Banner ---

const bannerCss = css`
  position: relative;
  z-index: 1;
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
  0% { background-position: 0 0; }
  100% { background-position: 200% 0; }
`

const turnBorderCss = css`
  &::before {
    content: '';
    position: absolute;
    inset: -0.25em;
    border-radius: 0.8em;
    background: linear-gradient(90deg, transparent, gold, rgb(40, 184, 206), transparent, gold, rgb(40, 184, 206), transparent);
    background-size: 200% 100%;
    animation: ${borderTravel} 2s linear infinite;
    pointer-events: none;
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
  font-size: 1.4em;
  color: #fff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const timerCss = css`
  position: relative;
  z-index: 1;
  font-size: 1.1em;
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
  font-size: 1.1em;
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
`

const finalScoreCss = css`
  position: relative;
  z-index: 1;
  font-size: 1.6em;
  font-weight: 900;
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
  padding: 0.05em 0.5em;
  border-radius: 0.3em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  flex-shrink: 0;
  min-width: 1.6em;
  text-align: center;
`

const finalScoreEliminatedCss = css`
  color: #ff7b6b;
  text-decoration: line-through;
`

// --- Body ---

const bodyCss = css`
  position: relative;
  z-index: 1;
  background: linear-gradient(180deg, #181E18 0%, #141a14 100%);
  padding: 0.5em 0.7em;
  display: flex;
  flex-direction: column;
  gap: 0.35em;
  border-radius: 0 0 0.7em 0.7em;
`

const borderTopActiveCss = (color: string) => css`
  border-top: 0.12em solid ${color};
`

const borderTopInactiveCss = css`
  border-top: 0.12em solid rgba(255, 255, 255, 0.08);
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
  width: 2.6em;
  height: 2.6em;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
`

const countCss = (hasTokens: boolean) => css`
  font-size: 1.3em;
  font-weight: 900;
  color: ${hasTokens ? '#fff' : 'rgba(255, 255, 255, 0.2)'};
  min-width: 0.7em;
  text-align: center;
  text-shadow: ${hasTokens ? '0 1px 2px rgba(0, 0, 0, 0.4)' : 'none'};
`

// --- Score row ---

const gridScoresCss = css`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.15em;
  padding: 0.05em 0.15em 0.15em;
`

const scoreCellCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 1.4em;
`

const scoreNumberCss = (n: number) => css`
  font-size: 1.3em;
  font-weight: 900;
  color: ${n > 0 ? '#a8e063' : n < 0 ? '#ff7b6b' : 'rgba(255, 255, 255, 0.45)'};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`

const poisonAliveIconCss = css`
  font-size: 1.4em;
  color: #ff6b9a;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
`

const poisonDeadIconCss = css`
  font-size: 1.4em;
  color: #b0b0b0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
`
