import { getRelativePlayerIndex, ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'

// Panel layout constants (must match PlayerPanels.tsx)
const panelScale = 0.7
const panelWidth = 22 * panelScale  // 15.4 table em
const panelHeight = 10 * panelScale // ~7 table em
const panelRight = 0.5 * panelScale
const panelTopStart = 1.5 * panelScale
const panelGap = 14 * panelScale    // 9.8 table em
const tableXMax = 44

function getPanelCenter(index: number) {
  return {
    x: tableXMax - panelRight - panelWidth / 2,
    y: -16 + panelTopStart + index * panelGap + panelHeight / 2
  }
}

class OnPlayerPanelLocatorClass extends ListLocator {
  getGap(): Partial<Coordinates> {
    return { z: 0.05 }
  }

  getCoordinates(location: Location, context: MaterialContext): Partial<Coordinates> {
    const index = getRelativePlayerIndex(context, location.player)
    return { ...getPanelCenter(index), z: 10 }
  }

  placeItem(item: MaterialItem, context: ItemContext): string[] {
    return [...super.placeItem(item, context), 'scale(0)']
  }
}

export const onPlayerPanelLocator = new OnPlayerPanelLocatorClass()

class BesidePanelLocatorClass extends ListLocator {
  getGap(): Partial<Coordinates> {
    return { z: 0.05 }
  }

  getCoordinates(location: Location, context: MaterialContext): Partial<Coordinates> {
    const center = getPanelCenter(getRelativePlayerIndex(context, location.player))
    return { x: center.x - panelWidth / 2 - 3, y: center.y, z: 10 }
  }

  placeItem(item: MaterialItem, context: ItemContext): string[] {
    return [...super.placeItem(item, context), 'scale(1)']
  }
}

export const besidePanelLocator = new BesidePanelLocatorClass()
