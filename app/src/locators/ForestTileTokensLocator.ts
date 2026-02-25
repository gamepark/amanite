import { FlexLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'

export class ForestTileTokensLocator extends FlexLocator {
  parentItemType = MaterialType.ForestTile
  lineSize = 4
  gap: Partial<Coordinates> = { x: 3.05 }
  lineGap: Partial<Coordinates> = { y: 2 }

  getCoordinates(location: Location, context: MaterialContext) {
    const tile = context.rules.material(MaterialType.ForestTile).getItem(location.parent!)
    const tileX = -26 + (tile?.location.x ?? 0) * 13
    return { x: tileX - 4.6, y: -13 }
  }

  // Override to prevent parent-based positioning (we use absolute coordinates via getCoordinates)
  // parentItemType is only needed so isPlacedOnItem doesn't crash when location.parent is set
  placeItemOnParent(_item: MaterialItem, _context: ItemContext): string[] {
    return []
  }
}

export const forestTileTokensLocator = new ForestTileTokensLocator()
