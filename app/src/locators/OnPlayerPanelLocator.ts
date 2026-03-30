import { getRelativePlayerIndex, ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'

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
    const transforms = [...super.placeItem(item, context), 'scale(0)']
    if (item.id === undefined && isCardType(context.type)) transforms.push('rotateY(180deg)')
    return transforms
  }
}

const cardTypes = [MaterialType.ClueCard, MaterialType.ValueCard, MaterialType.StartCard]
const isCardType = (type: number) => cardTypes.includes(type)

export const onPlayerPanelLocator = new OnPlayerPanelLocatorClass()

class BesidePanelLocatorClass extends ListLocator {
  getGap(): Partial<Coordinates> {
    return { z: 0.05 }
  }

  getCoordinates(location: Location, context: MaterialContext): Partial<Coordinates> {
    const center = getPanelCenter(getRelativePlayerIndex(context, location.player))
    return { x: center.x - panelWidth / 2 - 3, y: center.y + 1, z: 10 }
  }

  placeItem(item: MaterialItem, context: ItemContext): string[] {
    const transforms = [...super.placeItem(item, context), 'scale(1)']
    if (item.id === undefined && isCardType(context.type)) transforms.push('rotateY(180deg)')
    return transforms
  }
}

export const besidePanelLocator = new BesidePanelLocatorClass()

class FromPanelLocatorClass extends ListLocator {
  getGap(): Partial<Coordinates> {
    return { z: 0.05 }
  }

  getCoordinates(location: Location, context: MaterialContext): Partial<Coordinates> {
    const center = getPanelCenter(getRelativePlayerIndex(context, location.player))
    return { x: center.x - panelWidth / 2 - 1.5, y: center.y + 1, z: 10 }
  }
}

export const fromPanelLocator = new FromPanelLocatorClass()
