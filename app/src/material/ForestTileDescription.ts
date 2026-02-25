import { BoardDescription } from '@gamepark/react-game'
import { ForestTileHelp } from './help/ForestTileHelp'
import ForestTile1 from '../images/tiles/ForestTile1.jpg'
import ForestTile2 from '../images/tiles/ForestTile2.jpg'
import ForestTile3 from '../images/tiles/ForestTile3.jpg'
import ForestTile4 from '../images/tiles/ForestTile4.jpg'
import ForestTile5 from '../images/tiles/ForestTile5.jpg'

class ForestTileDescription extends BoardDescription {
  width = 12
  height = 6
  borderRadius = 0.5
  help = ForestTileHelp

  images = {
    1: ForestTile1,
    2: ForestTile2,
    3: ForestTile3,
    4: ForestTile4,
    5: ForestTile5
  }
}

export const forestTileDescription = new ForestTileDescription()
