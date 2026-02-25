import { getRelativePlayerIndex, ItemContext, Locator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'

class PanelLocatorClass extends Locator {
  getCoordinates(location: Location, context: MaterialContext): Partial<Coordinates> {
    const index = getRelativePlayerIndex(context, location.player)
    return { x: 50, y: -14 + index * 15 }
  }

  placeItem(item: MaterialItem, context: ItemContext): string[] {
    return super.placeItem(item, context).concat('scale(0.001)')
  }
}

export const panelLocator = new PanelLocatorClass()
