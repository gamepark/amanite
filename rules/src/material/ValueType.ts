export enum ValueType {
  Minus1 = 1,
  Value1,
  Value2,
  Value3,
  Antidote,
  Poison,
  Potion,           // Elixir
  MushroomLimit,    // Escalating: -5/0/3/12, eliminated at 4+
  MushroomMajority, // Majority: 10/4 VP
  MushroomPair      // Exactly 2 = 8 VP
}

/** The 6 default value cards for a first game */
export const defaultValueCards: ValueType[] = [
  ValueType.Minus1,
  ValueType.Value1,
  ValueType.Value2,
  ValueType.Value3,
  ValueType.Antidote,
  ValueType.Poison
]

/** These two value cards must always be present */
export const mandatoryValueCards: ValueType[] = [
  ValueType.Antidote,
  ValueType.Poison
]
