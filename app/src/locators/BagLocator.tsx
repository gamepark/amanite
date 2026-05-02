/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { DropAreaDescription, ItemContext, MaterialContext, PileLocator } from '@gamepark/react-game'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { RuleId } from '@gamepark/amanite/rules/RuleId'
import { Location, MaterialItem } from '@gamepark/rules-api'
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

export class BagLocator extends PileLocator {
  coordinates = { x: 0, y: -30 }
  radius = 1.5

  locationDescription = discardDropArea

  getLocations(context: MaterialContext) {
    if (context.rules.game.rule?.id === RuleId.DiscardForPig
      && context.player === context.rules.game.rule?.player) {
      return [{ type: LocationType.Bag }]
    }
    return []
  }

  getLocationCoordinates(_location: Location) {
    return { x: 0, y: -17, z: 1 }
  }

  placeItem(item: MaterialItem<number, number>, context: ItemContext<number, number, number, number, number>): string[] {
    return super.placeItem(item, context).concat('scale(0.001)')
  }
}

export const bagLocator = new BagLocator()

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
