import { LocationType } from '@gamepark/amanite/material/LocationType'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'
import { Locator } from '@gamepark/react-game'
import { bagLocator } from './BagLocator'
import { clueDeckLocator } from './ClueDeckLocator'
import { firstPlayerAreaLocator } from './FirstPlayerAreaLocator'
import { forestTileLotLeftLocator } from './ForestTileLotLeftLocator'
import { forestTileLotRightLocator } from './ForestTileLotRightLocator'
import { forestTileMeepleSpotLocator } from './ForestTileMeepleSpotLocator'
import { forestTileRowLocator } from './ForestTileRowLocator'
import { forestTileTokensLocator } from './ForestTileTokensLocator'
import { mushroomCardRowLocator } from './MushroomCardRowLocator'
import { notebookSlotLocator } from './NotebookSlotLocator'
import { playerClueCardsLocator } from './PlayerClueCardsLocator'
import { playerMeepleStockLocator } from './PlayerMeepleStockLocator'
import { playerNotebookStockLocator } from './PlayerNotebookStockLocator'
import { playerStartCardLocator } from './PlayerStartCardLocator'
import { playerTokensLocator } from './PlayerTokensLocator'
import { tokenDiscardLocator } from './TokenDiscardLocator'
import { valueCardSlotLocator } from './ValueCardSlotLocator'

export const Locators: Partial<Record<LocationType, Locator<PlayerAnimal, MaterialType, LocationType>>> = {
  [LocationType.ForestTileRow]: forestTileRowLocator,
  [LocationType.MushroomCardRow]: mushroomCardRowLocator,
  [LocationType.ValueCardSlot]: valueCardSlotLocator,
  [LocationType.ClueDeck]: clueDeckLocator,
  [LocationType.NotebookSlot]: notebookSlotLocator,
  [LocationType.Bag]: bagLocator,
  [LocationType.ForestTileTokens]: forestTileTokensLocator,
  [LocationType.ForestTileLotLeft]: forestTileLotLeftLocator,
  [LocationType.ForestTileLotRight]: forestTileLotRightLocator,
  [LocationType.ForestTileMeepleSpot]: forestTileMeepleSpotLocator,
  [LocationType.PlayerStartCard]: playerStartCardLocator,
  [LocationType.PlayerClueCards]: playerClueCardsLocator,
  [LocationType.PlayerTokens]: playerTokensLocator,
  [LocationType.PlayerMeepleStock]: playerMeepleStockLocator,
  [LocationType.PlayerNotebookStock]: playerNotebookStockLocator,
  [LocationType.FirstPlayerArea]: firstPlayerAreaLocator,
  [LocationType.TokenDiscard]: tokenDiscardLocator
}
