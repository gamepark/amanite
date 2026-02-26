import { DropAreaDescription, ItemContext, Locator, MaterialContext } from '@gamepark/react-game'
import { LotZone } from '@gamepark/amanite/material/LotZone'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'

export class ForestTileTokensLocator extends Locator {
  parentItemType = MaterialType.ForestTile

  lotDropArea = new DropAreaDescription({ width: 13, height: 4, borderRadius: 0.5 })

  getLocationDescription(location: Location, _context: MaterialContext) {
    if (location.id === LotZone.Top || location.id === LotZone.Bottom) {
      return this.lotDropArea
    }
    return undefined
  }

  getLocationCoordinates(location: Location): Partial<Coordinates> {
    // Drop area position relative to parent tile
    if (location.id === LotZone.Bottom) return { x: 0, y: 5 }
    return { x: 0, y: -5 }
  }

  getItemCoordinates(item: MaterialItem, _context: ItemContext): Partial<Coordinates> {
    const index = item.location.x ?? 0
    const col = index % 4
    const row = Math.floor(index / 4)
    const yOffset = item.location.id === LotZone.Bottom ? 5 : -5
    return { x: -4.6 + col * 3.05, y: yOffset + row * 1.5, z: row }
  }
}

export const forestTileTokensLocator = new ForestTileTokensLocator()
