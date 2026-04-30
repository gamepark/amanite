/** @jsxImportSource @emotion/react */
import { ItemContext, TokenDescription } from '@gamepark/react-game'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'
import { MaterialItem } from '@gamepark/rules-api'
import { ViewClueCardButton } from '../components/ViewClueCardButton'
import { NotebookTokenHelp } from './help/NotebookTokenHelp'
import FoxBookToken from '../images/tokens/book/FoxBookToken.png'
import JayBookToken from '../images/tokens/book/JayBookToken.png'
import OwlBookToken from '../images/tokens/book/OwlBookToken.png'
import SquirrelBookToken from '../images/tokens/book/SquirrelBookToken.png'

class NotebookTokenDescription extends TokenDescription {
  width = 2.1
  height = 2.9
  borderRadius = 0.3
  transparency = true
  help = NotebookTokenHelp
  menuAlwaysVisible = true

  images = {
    [PlayerAnimal.Fox]: FoxBookToken,
    [PlayerAnimal.Squirrel]: SquirrelBookToken,
    [PlayerAnimal.Owl]: OwlBookToken,
    [PlayerAnimal.Jay]: JayBookToken
  }

  getItemMenu(item: MaterialItem, context: ItemContext) {
    if (item.location.type !== LocationType.NotebookSlot) return
    if (item.id !== context.player) return
    if (context.rules.isOver()) return
    return <ViewClueCardButton notebookIndex={context.index} />
  }
}

export const notebookTokenDescription = new NotebookTokenDescription()
