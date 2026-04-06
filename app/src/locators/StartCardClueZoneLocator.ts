import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { DropAreaDescription, Locator } from '@gamepark/react-game'

class StartCardClueZoneLocator extends Locator {
  parentItemType = MaterialType.StartCard
  positionOnParent = { x: 9, y: 64 }
  locationDescription = new DropAreaDescription({ width: 2.3, height: 5.7, borderRadius: 0.2 })
}

export const startCardClueZoneLocator = new StartCardClueZoneLocator()
