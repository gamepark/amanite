/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ValueType } from '@gamepark/amanite/material/ValueType'

const indigo = '#2d2d7a'

const VP: FC<{ children: ReactNode }> = ({ children }) => (
  <span>{children}<span css={vpSuffixCss}>VP</span></span>
)

export const ValueScoringDisplay: FC<{ value: ValueType }> = ({ value }) => {
  switch (value) {
    case ValueType.Minus1:
    case ValueType.Value1:
    case ValueType.Value2:
    case ValueType.Value3:
      return <PerTokenScoring value={value} />
    case ValueType.Antidote:
      return <AntidoteScoring />
    case ValueType.Poison:
      return <PoisonScoring />
    case ValueType.Potion:
      return <PotionScoring />
    case ValueType.MushroomLimit:
      return <LimitScoring />
    case ValueType.MushroomMajority:
      return <MajorityScoring />
    case ValueType.MushroomPair:
      return <PairScoring />
    default:
      return null
  }
}

const vpPerToken: Record<number, number> = {
  [ValueType.Minus1]: -1,
  [ValueType.Value1]: 1,
  [ValueType.Value2]: 2,
  [ValueType.Value3]: 3
}

const PerTokenScoring: FC<{ value: ValueType }> = ({ value }) => {
  const { t } = useTranslation()
  const vp = vpPerToken[value]
  const isNegative = vp < 0
  return (
    <div css={scoringPanelCss}>
      <div css={descCss}>{t('scoring.pertoken.desc')}</div>
      <div css={scoringRowCss}>
        <span css={[vpBadgeCss, isNegative ? negativeBadgeCss : positiveBadgeCss]}>
          <VP>{vp > 0 ? '+' : ''}{vp}</VP>
        </span>
        <span>{t('scoring.per.token')}</span>
      </div>
    </div>
  )
}

const AntidoteScoring: FC = () => {
  const { t } = useTranslation()
  return (
    <div css={scoringPanelCss}>
      <div css={scoringRowCss}>
        <span css={[vpBadgeCss, positiveBadgeCss]}><VP>+5</VP></span>
        <span>{t('scoring.antidote.pair')}</span>
      </div>
      <div css={hintCss}>{t('scoring.antidote.hint')}</div>
    </div>
  )
}

const PoisonScoring: FC = () => {
  const { t } = useTranslation()
  return (
    <div css={scoringPanelCss}>
      <div css={scoringRowCss}>
        <span css={[vpBadgeCss, positiveBadgeCss]}><VP>+5</VP></span>
        <span>{t('scoring.poison.pair')}</span>
      </div>
      <div css={warningCss}>{t('scoring.poison.warning')}</div>
    </div>
  )
}

const PotionScoring: FC = () => {
  const { t } = useTranslation()
  return (
    <div css={scoringPanelCss}>
      <div css={scoringRowCss}>
        <span css={[vpBadgeCss, positiveBadgeCss]}><VP>+5</VP></span>
        <span>{t('scoring.potion.pair')}</span>
      </div>
      <div css={scoringRowCss}>
        <span css={[vpBadgeCss, negativeBadgeCss]}><VP>-3</VP></span>
        <span>{t('scoring.potion.leftover')}</span>
      </div>
    </div>
  )
}

const LimitScoring: FC = () => {
  const { t } = useTranslation()
  const tiers = [
    { count: '0', vp: '-5', negative: true },
    { count: '1', vp: '0', neutral: true },
    { count: '2', vp: '+3' },
    { count: '3', vp: '+12' },
    { count: '4+', vp: null, eliminated: true }
  ]
  return (
    <div css={scoringPanelCss}>
      <div css={descCss}>{t('scoring.limit.desc')}</div>
      <div css={limitGridCss}>
        {tiers.map(({ count, vp, negative, neutral, eliminated }) => (
          <div key={count} css={limitRowCss}>
            <span css={countCss}>{count}</span>
            {eliminated
              ? <span css={elimBadgeCss}>{t('scoring.eliminated')}</span>
              : <span css={[
                  vpBadgeCss,
                  negative ? negativeBadgeCss : neutral ? neutralBadgeCss : positiveBadgeCss
                ]}><VP>{vp}</VP></span>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

const MajorityScoring: FC = () => {
  const { t } = useTranslation()
  return (
    <div css={scoringPanelCss}>
      <div css={descCss}>{t('scoring.majority.desc')}</div>
      <div css={rankingCss}>
        <div css={rankRowCss}>
          <span css={rankBadgeCss}>1st</span>
          <span css={[vpBadgeCss, positiveBadgeCss]}><VP>+10</VP></span>
        </div>
        <div css={rankRowCss}>
          <span css={rankBadgeCss}>2nd</span>
          <span css={[vpBadgeCss, positiveBadgeCss]}><VP>+4</VP></span>
        </div>
      </div>
      <div css={hintCss}>{t('scoring.majority.ties')}</div>
    </div>
  )
}

const PairScoring: FC = () => {
  const { t } = useTranslation()
  return (
    <div css={scoringPanelCss}>
      <div css={descCss}>{t('scoring.pair.desc')}</div>
      <div css={scoringRowCss}>
        <span css={highlightCss}>= 2</span>
        <span css={[vpBadgeCss, positiveBadgeCss]}><VP>+8</VP></span>
      </div>
      <div css={hintCss}>{t('scoring.pair.hint')}</div>
    </div>
  )
}

// ─── Styles ────────────────────────────────────────────────────────

const scoringPanelCss = css`
  margin: 0.4em 0 0;
  padding: 0.5em 0.6em;
  background: ${indigo}12;
  border-left: 3px solid ${indigo};
  border-radius: 0 4px 4px 0;
  display: flex;
  flex-direction: column;
  gap: 0.35em;
`

const scoringRowCss = css`
  display: flex;
  align-items: center;
  gap: 0.5em;
  line-height: 1.3;
`

const vpBadgeCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.2em;
  padding: 0.1em 0.35em;
  border-radius: 0.3em;
  font-weight: 700;
  font-size: 0.9em;
  flex-shrink: 0;
`

const positiveBadgeCss = css`
  background: #2a6e2a20;
  color: #2a6e2a;
  border: 1px solid #2a6e2a40;
`

const negativeBadgeCss = css`
  background: #b8403220;
  color: #b84032;
  border: 1px solid #b8403240;
`

const neutralBadgeCss = css`
  background: #6b6b6b18;
  color: #5a5a5a;
  border: 1px solid #6b6b6b30;
`

const elimBadgeCss = css`
  display: inline-flex;
  align-items: center;
  padding: 0.1em 0.35em;
  border-radius: 0.3em;
  font-weight: 700;
  font-size: 0.8em;
  background: #b8403225;
  color: #b84032;
  border: 1px solid #b8403240;
  letter-spacing: 0.02em;
`

const descCss = css`
  font-size: 0.9em;
  color: #2a2a4a;
  line-height: 1.4;
  margin-bottom: 0.15em;
`

const hintCss = css`
  font-size: 0.85em;
  color: #5a5a6a;
  font-style: italic;
  line-height: 1.35;
`

const warningCss = css`
  font-size: 0.85em;
  color: #b84032;
  font-weight: 600;
  line-height: 1.35;
`

const limitGridCss = css`
  display: flex;
  gap: 0.3em;
  flex-wrap: wrap;
`

const limitRowCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15em;
  min-width: 2.5em;
`

const countCss = css`
  font-size: 0.8em;
  font-weight: 600;
  color: ${indigo};
  opacity: 0.7;
`

const rankingCss = css`
  display: flex;
  gap: 0.8em;
`

const rankRowCss = css`
  display: flex;
  align-items: center;
  gap: 0.3em;
`

const rankBadgeCss = css`
  font-size: 0.8em;
  font-weight: 700;
  color: ${indigo};
  opacity: 0.7;
`

const vpSuffixCss = css`
  font-size: 0.65em;
  font-weight: 600;
  margin-left: 0.15em;
  vertical-align: super;
  opacity: 0.75;
`

const highlightCss = css`
  font-weight: 700;
  font-size: 0.95em;
  color: ${indigo};
`
