import { LocationType } from '@gamepark/amanite/material/LocationType'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { PlayerColor } from '@gamepark/amanite/PlayerColor'
import { Locator } from '@gamepark/react-game'

export const Locators: Partial<Record<LocationType, Locator<PlayerColor, MaterialType, LocationType>>> = {}
