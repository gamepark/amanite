export enum MushroomColor {
  Blue = 1,
  Green,
  Purple,
  Red,
  White,
  Yellow
}

export const mushroomColors = Object.values(MushroomColor).filter((v): v is MushroomColor => typeof v === 'number')
