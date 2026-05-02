import { css, Interpolation, Theme } from '@emotion/react'
import { ItemContext, TokenDescription } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'
import { MeepleHelp } from './help/MeepleHelp'
import FoxMeeple from '../images/tokens/meeple/FoxMeeple.png'
import SquirrelMeeple from '../images/tokens/meeple/SquirrelMeeple.png'
import OwlMeeple from '../images/tokens/meeple/OwlMeeple.png'
import JayMeeple from '../images/tokens/meeple/JayMeeple.png'

const onTileOutlineCss = css`
  filter:
    drop-shadow(0.04em 0 0 rgba(0, 0, 0, 0.7))
    drop-shadow(-0.04em 0 0 rgba(0, 0, 0, 0.7))
    drop-shadow(0 0.04em 0 rgba(0, 0, 0, 0.7))
    drop-shadow(0 -0.04em 0 rgba(0, 0, 0, 0.7));
`

class MeepleDescription extends TokenDescription {
  width = 1.6
  height = 2.4
  borderRadius = 0
  transparency = true
  help = MeepleHelp

  images = {
    [PlayerAnimal.Fox]: FoxMeeple,
    [PlayerAnimal.Squirrel]: SquirrelMeeple,
    [PlayerAnimal.Owl]: OwlMeeple,
    [PlayerAnimal.Jay]: JayMeeple
  }

  getItemExtraCss(item: MaterialItem, _context: ItemContext): Interpolation<Theme> {
    if (item.location.type === LocationType.ForestTileMeepleSpot) return onTileOutlineCss
    return
  }
}

export const meepleDescription = new MeepleDescription()
