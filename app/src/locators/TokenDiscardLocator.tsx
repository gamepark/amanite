/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { RuleId } from '@gamepark/amanite/rules/RuleId'
import { DropAreaDescription, MaterialContext, PileLocator } from '@gamepark/react-game'
import { useTranslation } from 'react-i18next'

const DiscardContent = () => {
  const { t } = useTranslation()
  return <span css={discardTextCss}>{t('discard.zone')}</span>
}

const discardDropArea = new DropAreaDescription({
  width: 40,
  height: 10,
  borderRadius: 1,
  extraCss: css`
    background: rgba(180, 40, 40, 0.35);
    border: 0.2em dashed rgba(200, 60, 60, 0.7);
  `
})
discardDropArea.content = DiscardContent

export class TokenDiscardLocator extends PileLocator {
  radius = 1.5
  coordinates = { x: 0, y: -30 }

  locationDescription = discardDropArea

  getLocations(context: MaterialContext) {
    if (context.rules.game.rule?.id === RuleId.DiscardForPig && context.player === context.rules.game.rule?.player) {
      return [{ type: LocationType.TokenDiscard }]
    }
    return []
  }

  hide() {
    return true
  }

  getLocationCoordinates() {
    return { x: 0, y: -17, z: 1 }
  }
}

export const tokenDiscardLocator = new TokenDiscardLocator()

const discardTextCss = css`
  position: absolute;
  bottom: 0.5em;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2em;
  font-weight: 900;
  color: rgba(200, 60, 60, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  pointer-events: none;
  user-select: none;
`
