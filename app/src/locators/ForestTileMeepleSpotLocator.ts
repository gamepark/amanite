import { DropAreaDescription, ItemContext, Locator } from '@gamepark/react-game'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { Coordinates, MaterialItem } from '@gamepark/rules-api'

export class ForestTileMeepleSpotLocator extends Locator {
  parentItemType = MaterialType.ForestTile
  locationDescription = new DropAreaDescription({ width: 12, height: 6, borderRadius: 0.5 })

  getLocationCoordinates(): Partial<Coordinates> {
    // Location is rendered as a child of the parent forest tile, so coordinates are relative to the tile
    return { x: 0, y: 0 }
  }

  getItemCoordinates(item: MaterialItem, _context: ItemContext): Partial<Coordinates> {
    const spot = item.location.x ?? 0
    if (spot === 0) return { x: -3.1, y: 0.15 }
    return { x: 3.1, y: 0.15 }
  }
}

export const forestTileMeepleSpotLocator = new ForestTileMeepleSpotLocator()
