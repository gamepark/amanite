/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ScoringDescription } from '@gamepark/react-game'
import { Trans } from 'react-i18next'
import { MaterialRules } from '@gamepark/rules-api'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'
import { MushroomColor, mushroomColors } from '@gamepark/amanite/material/MushroomColor'
import { ValueType } from '@gamepark/amanite/material/ValueType'
import { ScoringHelper } from '@gamepark/amanite/rules/helper/ScoringHelper'
import BlueToken from '../images/tokens/round/BlueMushroomToken.jpg'
import GreenToken from '../images/tokens/round/GreenMushroomToken.jpg'
import PurpleToken from '../images/tokens/round/PurpleMushroomToken.jpg'
import RedToken from '../images/tokens/round/RedMushroomToken.jpg'
import WhiteToken from '../images/tokens/round/WhiteMushroomToken.jpg'
import YellowToken from '../images/tokens/round/YellowMushroomToken.jpg'
import PigToken from '../images/tokens/round/PigToken.jpg'
import Minus1Card from '../images/cards/value/Minus1ValueCard.jpg'
import Value1Card from '../images/cards/value/Value1Card.jpg'
import Value2Card from '../images/cards/value/Value2Card.jpg'
import Value3Card from '../images/cards/value/Value3Card.jpg'
import AntidoteCard from '../images/cards/value/AntidoteValueCard.jpg'
import PoisonCard from '../images/cards/value/PoisonValueCard.jpg'
import PotionCard from '../images/cards/value/PotionValueCard.jpg'
import LimitCard from '../images/cards/value/MushroomLimitValueCard.jpg'
import MajorityCard from '../images/cards/value/MushroomMajorityValueCard.jpg'
import PairCard from '../images/cards/value/MushroomPairValueCard.jpg'

const tokenImages: Record<number, string> = {
  [MushroomColor.Blue]: BlueToken,
  [MushroomColor.Green]: GreenToken,
  [MushroomColor.Purple]: PurpleToken,
  [MushroomColor.Red]: RedToken,
  [MushroomColor.White]: WhiteToken,
  [MushroomColor.Yellow]: YellowToken
}

const valueCardImages: Record<number, string> = {
  [ValueType.Minus1]: Minus1Card,
  [ValueType.Value1]: Value1Card,
  [ValueType.Value2]: Value2Card,
  [ValueType.Value3]: Value3Card,
  [ValueType.Antidote]: AntidoteCard,
  [ValueType.Poison]: PoisonCard,
  [ValueType.Potion]: PotionCard,
  [ValueType.MushroomLimit]: LimitCard,
  [ValueType.MushroomMajority]: MajorityCard,
  [ValueType.MushroomPair]: PairCard
}

enum ScoringKeyType {
  Mushroom = 1,
  Pig,
  PoisonPairing,
  AntidoteElixirPenalty,
  Eliminated,
  Total,
  Tiebreaker
}

type ScoringKey =
  | { type: ScoringKeyType.Mushroom, color: MushroomColor }
  | { type: ScoringKeyType.Pig }
  | { type: ScoringKeyType.PoisonPairing }
  | { type: ScoringKeyType.AntidoteElixirPenalty }
  | { type: ScoringKeyType.Eliminated }
  | { type: ScoringKeyType.Total }
  | { type: ScoringKeyType.Tiebreaker }

export class AmaniteScoring implements ScoringDescription<PlayerAnimal, MaterialRules, ScoringKey> {

  getScoringKeys(rules: MaterialRules): ScoringKey[] {
    const helper = new ScoringHelper(rules.game, rules.game.players[0])
    const mapping = helper.mushroomValueMapping
    const keys: ScoringKey[] = []

    const pairingValues = [ValueType.Poison, ValueType.Antidote, ValueType.Potion]

    // One row per mushroom color (skip Poison/Antidote/Potion — handled by pairing rows)
    for (const color of mushroomColors) {
      const value = mapping[color]
      if (value !== undefined && !pairingValues.includes(value)) {
        keys.push({ type: ScoringKeyType.Mushroom, color })
      }
    }

    keys.push({ type: ScoringKeyType.Pig })

    // Pairing rows only if relevant values are in play
    const values = Object.values(mapping)
    const hasPoison = values.includes(ValueType.Poison)
    const hasAntidote = values.includes(ValueType.Antidote)
    const hasPotion = values.includes(ValueType.Potion)

    if (hasPoison && (hasAntidote || hasPotion)) {
      keys.push({ type: ScoringKeyType.PoisonPairing })
    }
    if (hasAntidote && hasPotion) {
      const hasPenalty = rules.game.players.some(
        (p: PlayerAnimal) => new ScoringHelper(rules.game, p).antidoteElixirPenaltyScore < 0
      )
      if (hasPenalty) {
        keys.push({ type: ScoringKeyType.AntidoteElixirPenalty })
      }
    }

    if (hasPoison) {
      keys.push({ type: ScoringKeyType.Eliminated })
    }
    keys.push({ type: ScoringKeyType.Total })

    // Show tiebreaker row if at least 2 non-eliminated players share the same score
    const scores = rules.game.players.map((p: PlayerAnimal) => {
      const h = new ScoringHelper(rules.game, p)
      return h.isEliminated ? null : h.score
    }).filter((s: number | null) => s !== null)
    const hasTie = scores.length !== new Set(scores).size
    if (hasTie) {
      keys.push({ type: ScoringKeyType.Tiebreaker })
    }

    return keys
  }

  getScoringHeader(key: ScoringKey, rules: MaterialRules) {
    if (key.type === ScoringKeyType.Eliminated) {
      const helper = new ScoringHelper(rules.game, rules.game.players[0])
      const values = Object.values(helper.mushroomValueMapping)
      const hasAntidote = values.includes(ValueType.Antidote)
      const hasPotion = values.includes(ValueType.Potion)
      return (
        <div css={headerCss}>
          <img src={PoisonCard} css={valueImgSmCss} alt="" />
          <span css={operatorCss}>&le;</span>
          {hasAntidote && <img src={AntidoteCard} css={valueImgSmCss} alt="" />}
          {hasAntidote && hasPotion && <span css={operatorCss}>+</span>}
          {hasPotion && <img src={PotionCard} css={valueImgSmCss} alt="" />}
        </div>
      )
    }
    if (key.type === ScoringKeyType.Mushroom) {
      const helper = new ScoringHelper(rules.game, rules.game.players[0])
      const value = helper.mushroomValueMapping[key.color]
      const isMultiply = value === ValueType.Minus1 || value === ValueType.Value1 || value === ValueType.Value2 || value === ValueType.Value3
      return (
        <div css={headerCss}>
          <img src={tokenImages[key.color]} css={tokenImgCss} alt="" />
          {value !== undefined && isMultiply && <span css={operatorCss}>&times;</span>}
          {value !== undefined && <img src={valueCardImages[value]} css={valueImgCss} alt="" />}
        </div>
      )
    }
    if (key.type === ScoringKeyType.Pig) {
      return (
        <div css={headerCss}>
          <img src={PigToken} css={tokenImgCss} alt="" />
        </div>
      )
    }
    if (key.type === ScoringKeyType.PoisonPairing) {
      return (
        <div css={headerCss}>
          <img src={PoisonCard} css={valueImgSmCss} alt="" />
          <span css={operatorCss}>+</span>
          <img src={AntidoteCard} css={valueImgSmCss} alt="" />
        </div>
      )
    }
    if (key.type === ScoringKeyType.AntidoteElixirPenalty) {
      return (
        <div css={headerCss}>
          <img src={AntidoteCard} css={valueImgSmCss} alt="" />
          <span css={operatorCss}>+</span>
          <img src={PotionCard} css={valueImgSmCss} alt="" />
        </div>
      )
    }
    if (key.type === ScoringKeyType.Tiebreaker) {
      return <div css={tiebreakerHeaderCss}><Trans defaults="scoring.tiebreaker" components={{ br: <br/>, small: <span css={tiebreakerSubCss} /> }} /></div>
    }
    return <div css={totalHeaderCss}>Total</div>
  }

  getScoringPlayerData(key: ScoringKey, player: PlayerAnimal, rules: MaterialRules) {
    const helper = new ScoringHelper(rules.game, player)

    if (key.type === ScoringKeyType.Mushroom) {
      return <div css={dataCss}>{helper.getMushroomScore(key.color)}</div>
    }
    if (key.type === ScoringKeyType.Pig) {
      return <div css={dataCss}>{helper.pigScore}</div>
    }
    if (key.type === ScoringKeyType.PoisonPairing) {
      return <div css={dataCss}>{helper.poisonPairingScore}</div>
    }
    if (key.type === ScoringKeyType.AntidoteElixirPenalty) {
      return <div css={dataCss}>{helper.antidoteElixirPenaltyScore}</div>
    }
    if (key.type === ScoringKeyType.Eliminated) {
      return <div css={helper.isEliminated ? eliminatedCss : safeCss}>{helper.isEliminated ? '✗' : '✓'}</div>
    }
    if (key.type === ScoringKeyType.Total) {
      return <div css={helper.isEliminated ? eliminatedTotalCss : totalDataCss}>{helper.score}</div>
    }
    if (key.type === ScoringKeyType.Tiebreaker) {
      if (helper.isEliminated) return <div css={dataCss}>—</div>
      return <div css={tiebreakerDataCss}>{helper.totalMushroomCount}</div>
    }
    return null
  }
}

const headerCss = css`
  display: flex;
  align-items: center;
  gap: 0.3em;
  justify-content: center;
`

const tokenImgCss = css`
  width: 2em;
  height: 2em;
  border-radius: 50%;
  object-fit: cover;
`

const valueImgCss = css`
  height: 2.8em;
  width: auto;
  border-radius: 0.2em;
  object-fit: cover;
`

const valueImgSmCss = css`
  height: 2.8em;
  width: auto;
  border-radius: 0.15em;
  object-fit: cover;
`

const operatorCss = css`
  font-size: 0.9em;
  font-weight: 700;
  opacity: 0.6;
`

const totalHeaderCss = css`
  font-weight: 900;
  font-size: 1.1em;
  text-align: center;
`

const dataCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 1em;
`

const totalDataCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: 900;
  font-size: 1.2em;
`

const eliminatedCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: 900;
  font-size: 1.3em;
  color: #e53935;
`

const safeCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: 900;
  font-size: 1.3em;
  color: #4caf50;
`

const tiebreakerHeaderCss = css`
  font-size: 0.9em;
  font-weight: 700;
  text-align: center;
  line-height: 1.3;
`

const tiebreakerSubCss = css`
  font-size: 0.75em;
  font-weight: 400;
  opacity: 0.6;
  font-style: italic;
`

const tiebreakerDataCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 0.9em;
  opacity: 0.7;
  font-style: italic;
`

const eliminatedTotalCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: 900;
  font-size: 1.2em;
  color: #e53935;
  text-decoration: line-through;
`
