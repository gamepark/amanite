import { MaterialGameAnimations } from '@gamepark/react-game'
import { isMoveItemType, isMoveItemTypeAtOnce, LocalMoveType, MoveKind } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { RuleId } from '@gamepark/amanite/rules/RuleId'
import { besidePanelLocator, fromPanelLocator, onPlayerPanelLocator } from '../locators/OnPlayerPanelLocator'
import { getViewPlayer } from '../locators/ViewHelper'

export const gameAnimations = new MaterialGameAnimations()

const isTokenMove = isMoveItemType(MaterialType.RoundToken)
const isMeepleMove = isMoveItemType(MaterialType.Meeple)
const isNotebookMove = isMoveItemType(MaterialType.NotebookToken)
const isClueMove = isMoveItemType(MaterialType.ClueCard)
const isTokenMoveAtOnce = isMoveItemTypeAtOnce(MaterialType.RoundToken)

const toPanelTrajectory = (_context: any, move: any) => ({
  waypoints: [
    { at: 0.6, locator: besidePanelLocator, location: () => ({ player: move.location.player }) },
    { at: 1, locator: onPlayerPanelLocator, location: () => ({ player: move.location.player }) }
  ]
})

// No animation on view change
gameAnimations
  .configure((move) => move.kind === MoveKind.LocalMove && move.type === LocalMoveType.ChangeView)
  .skip()

// Tokens drawn from bag to forest tiles
gameAnimations
  .configure((move, context) =>
    context.rules.game.rule?.id === RuleId.PlaceNewTokens && isTokenMove(move)
  )
  .duration(600)

// Meeple placement on forest tile — viewed player
gameAnimations
  .configure((move, context) =>
    context.rules.game.rule?.id === RuleId.PlaceMeeple
    && isMeepleMove(move)
    && context.rules.game.rule?.player === getViewPlayer(context)
  )
  .duration(500)

// Meeple placement on forest tile — other player (from panel)
gameAnimations
  .configure((move, context) =>
    context.rules.game.rule?.id === RuleId.PlaceMeeple
    && isMeepleMove(move)
    && context.rules.game.rule?.player !== getViewPlayer(context)
  )
  .duration(1200)
  .trajectory((context) => {
    const player = context.rules.game.rule?.player
    return {
      waypoints: [
        { at: 0, locator: fromPanelLocator, location: () => ({ player }) }
      ]
    }
  })

// Token split (moving tokens between lots)
gameAnimations
  .configure((move, context) =>
    context.rules.game.rule?.id === RuleId.SplitTokens && isTokenMove(move)
  )
  .duration(300)
  .flat()

// Token collection via lot choice — viewed player (normal animation)
gameAnimations
  .configure((move, context) =>
    context.rules.game.rule?.id === RuleId.ChooseLot
    && isTokenMoveAtOnce(move)
    && move.location.player === getViewPlayer(context)
  )
  .duration(600)

// Token collection via lot choice — other player (trajectory to panel)
gameAnimations
  .configure((move, context) =>
    context.rules.game.rule?.id === RuleId.ChooseLot
    && isTokenMoveAtOnce(move)
    && move.location.player !== getViewPlayer(context)
  )
  .duration(1600)
  .trajectory(toPanelTrajectory)

// Token collection via choose tokens — viewed player
gameAnimations
  .configure((move, context) =>
    context.rules.game.rule?.id === RuleId.ChooseTokens
    && isTokenMove(move)
    && move.location.type === LocationType.PlayerTokens
    && move.location.player === getViewPlayer(context)
  )
  .duration(500)

// Token collection via choose tokens — other player (trajectory to panel)
gameAnimations
  .configure((move, context) =>
    context.rules.game.rule?.id === RuleId.ChooseTokens
    && isTokenMove(move)
    && move.location.type === LocationType.PlayerTokens
    && move.location.player !== getViewPlayer(context)
  )
  .duration(1400)
  .trajectory(toPanelTrajectory)

// Tokens returned to bag (after choose tokens)
gameAnimations
  .configure((move, context) =>
    context.rules.game.rule?.id === RuleId.ChooseTokens
    && isTokenMove(move)
    && move.location.type === LocationType.Bag
  )
  .duration(400)

// Meeple return to stock — viewed player
gameAnimations
  .configure((move, context) =>
    isMeepleMove(move)
    && move.location.type === LocationType.PlayerMeepleStock
    && move.location.player === getViewPlayer(context)
  )
  .duration(500)

// Meeple return to stock — other player (trajectory to panel)
gameAnimations
  .configure((move, context) =>
    isMeepleMove(move)
    && move.location.type === LocationType.PlayerMeepleStock
    && move.location.player !== getViewPlayer(context)
  )
  .duration(1200)
  .trajectory(toPanelTrajectory)

// Discard token for pig
gameAnimations
  .configure((move, context) =>
    context.rules.game.rule?.id === RuleId.DiscardForPig && isTokenMove(move)
  )
  .duration(500)

// Notebook token placement — viewed player
gameAnimations
  .configure((move, context) =>
    context.rules.game.rule?.id === RuleId.PlaceNotebook
    && isNotebookMove(move)
    && context.rules.game.rule?.player === getViewPlayer(context)
  )
  .duration(600)

// Notebook token placement — other player (from panel)
gameAnimations
  .configure((move, context) =>
    context.rules.game.rule?.id === RuleId.PlaceNotebook
    && isNotebookMove(move)
    && context.rules.game.rule?.player !== getViewPlayer(context)
  )
  .duration(1200)
  .trajectory((context) => {
    const player = context.rules.game.rule?.player
    return {
      waypoints: [
        { at: 0, locator: fromPanelLocator, location: () => ({ player }) }
      ]
    }
  })

// Clue card draw — viewed player
gameAnimations
  .configure((move, context) =>
    isClueMove(move)
    && move.location.type === LocationType.PlayerClueCards
    && move.location.player === getViewPlayer(context)
  )
  .duration(600)

// Clue card draw — other player (trajectory to panel)
gameAnimations
  .configure((move, context) =>
    isClueMove(move)
    && move.location.type === LocationType.PlayerClueCards
    && move.location.player !== getViewPlayer(context)
  )
  .duration(1400)
  .trajectory(toPanelTrajectory)

// Clue cards (other moves like shuffle, return to deck)
gameAnimations
  .configure((move) => isClueMove(move))
  .duration(400)

// First player token pass
gameAnimations
  .configure((move) => isMoveItemType(MaterialType.FirstPlayerToken)(move))
  .duration(800)

// Start card rotation (choosing side)
gameAnimations
  .configure((move, context) =>
    context.rules.game.rule?.id === RuleId.ChooseStartCardSide
    && isMoveItemType(MaterialType.StartCard)(move)
  )
  .duration(400)
