/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'
import { ScoringHelper } from '@gamepark/amanite/rules/helper/ScoringHelper'
import { getPlayerColor } from './logStyles'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'

const playerAccent: Record<number, string> = {
  [PlayerAnimal.Fox]: '#D4722A',
  [PlayerAnimal.Squirrel]: '#B84032',
  [PlayerAnimal.Owl]: '#7B7D7E',
  [PlayerAnimal.Jay]: '#3B7BB5'
}

export const FinalScoringLog: FC<MoveComponentProps<MaterialMove>> = ({ context }) => {
  const rules = new AmaniteRules(context.game as MaterialGame)
  const players = context.game.players

  const scores = players.map(p => {
    const helper = new ScoringHelper(context.game, p)
    return { player: p, score: rules.getScore(p), eliminated: helper.isEliminated }
  }).sort((a, b) => b.score - a.score)

  const winner = scores[0]

  return (
    <div css={scrollCss}>
      <WinnerBlock player={winner.player} score={winner.score} />
      <div css={dividerCss} />
      <div css={standingsCss}>
        {scores.map(({ player, score, eliminated }) => (
          <ScoreRow key={player} player={player} score={score} eliminated={eliminated} />
        ))}
      </div>
    </div>
  )
}

const WinnerBlock: FC<{ player: number, score: number }> = ({ player, score }) => {
  const { t } = useTranslation()
  const name = usePlayerName(player)
  return (
    <div css={winnerCss}>
      <span css={crownCss}>{'\u2733'}</span>
      {' '}
      <strong css={winnerNameCss(getPlayerColor(player))}>{name}</strong>
      {' '}
      <span css={winnerPtsCss}>{t('log.winner.points', { score })}</span>
    </div>
  )
}

const ScoreRow: FC<{ player: number, score: number, eliminated: boolean }> = ({ player, score, eliminated }) => {
  const { t } = useTranslation()
  const name = usePlayerName(player)
  const accent = playerAccent[player] ?? '#888'
  return (
    <div css={[rowCss, eliminated && eliminatedCss]}>
      <span css={dotStyle(accent)} />
      <span css={nameStyle(getPlayerColor(player))}>{name}</span>
      <span css={eliminated ? elimScoreStyle : scoreStyle}>
        {eliminated ? t('log.eliminated') : score}
      </span>
    </div>
  )
}

const scrollCss = css`
  background: linear-gradient(175deg, #f7f2e2 0%, #f0e8c8 40%, #ece3c5 100%);
  border: 1px solid rgba(140, 120, 80, 0.25);
  border-radius: 0.25em;
  padding: 0.6em 0.8em 0.6em 1em;
  box-shadow: inset 0 1px 2px rgba(140, 120, 70, 0.06), 0 1px 3px rgba(0, 0, 0, 0.06);
  color: #2a2a3e;
`

const winnerCss = css`
  text-align: center;
  padding-bottom: 0.4em;
`

const crownCss = css`
  color: #b89e30;
  font-size: 0.9em;
`

const winnerNameCss = (color: string) => css`
  font-weight: 700;
  color: ${color};
`

const winnerPtsCss = css`
  font-size: 0.85em;
  color: #6b5a42;
  font-style: italic;
`

const dividerCss = css`
  border-top: 1px dashed rgba(107, 90, 66, 0.25);
  margin-bottom: 0.35em;
`

const standingsCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.15em;
`

const rowCss = css`
  display: flex;
  align-items: center;
  gap: 0.35em;
  padding: 0.1em 0.2em;
`

const dotStyle = (accent: string) => css`
  width: 0.45em;
  height: 0.45em;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${accent};
  opacity: 0.75;
`

const nameStyle = (color: string) => css`
  flex: 1;
  font-weight: 600;
  color: ${color};
`

const scoreStyle = css`
  font-weight: 700;
  color: #3a2a1a !important;
`

const elimScoreStyle = css`
  font-weight: 600;
  font-size: 0.85em;
  font-style: italic;
  color: #8a6a4a !important;
`

const eliminatedCss = css`
  opacity: 0.55;
`
