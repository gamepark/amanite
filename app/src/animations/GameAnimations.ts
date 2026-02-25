import { MaterialGameAnimations } from '@gamepark/react-game'
import { isMoveItemType, LocalMoveType, MoveKind } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { RuleId } from '@gamepark/amanite/rules/RuleId'

export const gameAnimations = new MaterialGameAnimations()

// No animation on view change
gameAnimations
  .when()
  .move((move) => move.kind === MoveKind.LocalMove && move.type === LocalMoveType.ChangeView)
  .none()

// Tokens drawn from bag to forest tiles
gameAnimations
  .when()
  .rule(RuleId.PlaceNewTokens)
  .move(isMoveItemType(MaterialType.RoundToken))
  .duration(0.4)

// Meeple placement on forest tile
gameAnimations
  .when()
  .rule(RuleId.PlaceMeeple)
  .move(isMoveItemType(MaterialType.Meeple))
  .duration(0.3)

// Token split (moving tokens between lots)
gameAnimations
  .when()
  .rule(RuleId.SplitTokens)
  .move(isMoveItemType(MaterialType.RoundToken))
  .duration(0.2)

// Token collection (harvest → player)
gameAnimations
  .when()
  .rule(RuleId.ChooseLot)
  .move(isMoveItemType(MaterialType.RoundToken))
  .duration(0.4)

gameAnimations
  .when()
  .rule(RuleId.ChooseTokens)
  .move(isMoveItemType(MaterialType.RoundToken))
  .duration(0.4)

// Meeple return to stock after harvest
gameAnimations
  .when()
  .move((move) => isMoveItemType(MaterialType.Meeple)(move) && move.location.type === LocationType.PlayerMeepleStock)
  .duration(0.3)

// Discard token for pig
gameAnimations
  .when()
  .rule(RuleId.DiscardForPig)
  .move(isMoveItemType(MaterialType.RoundToken))
  .duration(0.3)

// Notebook token placement
gameAnimations
  .when()
  .rule(RuleId.PlaceNotebook)
  .move(isMoveItemType(MaterialType.NotebookToken))
  .duration(0.3)

// Clue card draw
gameAnimations
  .when()
  .move(isMoveItemType(MaterialType.ClueCard))
  .duration(0.3)

// First player token pass
gameAnimations
  .when()
  .move(isMoveItemType(MaterialType.FirstPlayerToken))
  .duration(0.5)

// Start card rotation (choosing side)
gameAnimations
  .when()
  .rule(RuleId.ChooseStartCardSide)
  .move(isMoveItemType(MaterialType.StartCard))
  .duration(0.4)
