import { LocationType } from '@gamepark/amanite/material/LocationType'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal.ts'
import { Locator } from '@gamepark/react-game'

export const Locators: Partial<Record<LocationType, Locator<PlayerAnimal, MaterialType, LocationType>>> = {}
