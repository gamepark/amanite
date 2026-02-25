import { PlayerAnimal } from '../PlayerAnimal'
import { MushroomColor } from './MushroomColor'

/**
 * Each Start card has 2 sides. Each side shows 3 mushroom colors
 * that the player will draw initial clue cards from.
 * Side index 0 = side 1, side index 1 = side 2.
 */
export const startCardMushrooms: Record<PlayerAnimal, [MushroomColor[], MushroomColor[]]> = {
  [PlayerAnimal.Fox]: [
    [MushroomColor.Blue, MushroomColor.Yellow, MushroomColor.Red],
    [MushroomColor.Blue, MushroomColor.Yellow, MushroomColor.White]
  ],
  [PlayerAnimal.Squirrel]: [
    [MushroomColor.Blue, MushroomColor.Purple, MushroomColor.White],
    [MushroomColor.Green, MushroomColor.Purple, MushroomColor.White]
  ],
  [PlayerAnimal.Owl]: [
    [MushroomColor.Green, MushroomColor.Purple, MushroomColor.Red],
    [MushroomColor.Green, MushroomColor.Yellow, MushroomColor.Red]
  ],
  [PlayerAnimal.Jay]: [
    [MushroomColor.White, MushroomColor.Red, MushroomColor.Green],
    [MushroomColor.Purple, MushroomColor.Yellow, MushroomColor.Blue]
  ]
}

/** Get the mushroom colors for a given start card side */
export function getStartCardMushrooms(animal: PlayerAnimal, side: number): MushroomColor[] {
  return startCardMushrooms[animal][side] ?? startCardMushrooms[animal][0]
}
