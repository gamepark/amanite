export enum LocationType {
  // Game zones
  ForestTileRow = 1,
  MushroomCardRow,
  ValueCardSlot,
  ClueDeck,
  NotebookSlot,

  // Token zones
  Bag,
  ForestTileTokens,
  ForestTileLotTop,   // @deprecated — use ForestTileTokens with id=LotZone.Top
  ForestTileLotBottom, // @deprecated — use ForestTileTokens with id=LotZone.Bottom

  // Meeple spots
  ForestTileMeepleSpot,

  // Player zones
  PlayerStartCard,
  PlayerClueCards,
  PlayerTokens,
  PlayerMeepleStock,
  PlayerNotebookStock,

  // Other
  FirstPlayerArea,
  TokenDiscard
}
