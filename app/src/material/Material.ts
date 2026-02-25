import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { MaterialDescription } from '@gamepark/react-game'
import { forestTileDescription } from './ForestTileDescription'
import { mushroomCardDescription } from './MushroomCardDescription'
import { startCardDescription } from './StartCardDescription'
import { valueCardDescription } from './ValueCardDescription'
import { clueCardDescription } from './ClueCardDescription'
import { roundTokenDescription } from './RoundTokenDescription'
import { notebookTokenDescription } from './NotebookTokenDescription'
import { meepleDescription } from './MeepleDescription'
import { firstPlayerTokenDescription } from './FirstPlayerTokenDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.ForestTile]: forestTileDescription,
  [MaterialType.MushroomCard]: mushroomCardDescription,
  [MaterialType.StartCard]: startCardDescription,
  [MaterialType.ValueCard]: valueCardDescription,
  [MaterialType.ClueCard]: clueCardDescription,
  [MaterialType.RoundToken]: roundTokenDescription,
  [MaterialType.NotebookToken]: notebookTokenDescription,
  [MaterialType.Meeple]: meepleDescription,
  [MaterialType.FirstPlayerToken]: firstPlayerTokenDescription
}
