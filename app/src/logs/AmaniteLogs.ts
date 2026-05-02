import { LogDescription, MoveComponentContext, MovePlayedLogDescription } from '@gamepark/react-game'
import {
  isCustomMoveType, isEndGame, isMoveItemType, isMoveItemTypeAtOnce,
  isStartPlayerTurn, isStartRule, MaterialGame, MaterialMove
} from '@gamepark/rules-api'
import { AmaniteRules } from '@gamepark/amanite/AmaniteRules'
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'
import { CustomMoveType } from '@gamepark/amanite/rules/CustomMoveType'
import { RuleId } from '@gamepark/amanite/rules/RuleId'
import { gameOverCss, logCss, separatorCss, systemLogCss } from './logStyles'
import { PlaceMeepleLog } from './PlaceMeepleLog'
import { SplitTokensLog } from './SplitTokensLog'
import { ChooseLotLog } from './ChooseLotLog'
import { ChooseTokensLog } from './ChooseTokensLog'
import { DiscardForPigLog } from './DiscardForPigLog'
import { PlaceNotebookLog } from './PlaceNotebookLog'
import { StartRoundLog } from './StartRoundLog'
import { EndRoundLog } from './EndRoundLog'
import { FinalScoringLog } from './FinalScoringLog'
import { ReceiveLotLog } from './ReceiveLotLog'
import { ForestTileLog } from './ForestTileLog'

export class AmaniteLogs implements LogDescription<MaterialMove, PlayerAnimal, MaterialGame> {
  getMovePlayedLogDescription(
    move: MaterialMove,
    context: MoveComponentContext<MaterialMove, PlayerAnimal, MaterialGame>
  ): MovePlayedLogDescription | undefined {
    const rule = context.game.rule?.id
    const player = context.game.rule?.player

    // ── Separators ──

    // StartRound — first batch of tokens placed on forest tiles
    if (rule === RuleId.PlaceNewTokens
      && isMoveItemTypeAtOnce(MaterialType.RoundToken)(move)
      && move.location.type === LocationType.ForestTileTokens) {
      const rules = new AmaniteRules(context.game as MaterialGame)
      const tokensOnTiles = rules.material(MaterialType.RoundToken)
        .location(LocationType.ForestTileTokens).length
      if (tokensOnTiles === 0) {
        return { Component: StartRoundLog, css: separatorCss }
      }
    }

    // ForestTile — separator when Harvest starts processing a tile
    if (rule === RuleId.Harvest && isStartPlayerTurn(move)
      && (move.id === RuleId.ChooseLot || move.id === RuleId.ChooseTokens)) {
      return { Component: ForestTileLog, css: separatorCss }
    }

    // ── Player actions ──

    // PlaceMeeple
    if (isMoveItemType(MaterialType.Meeple)(move) && move.location.type === LocationType.ForestTileMeepleSpot) {
      return { Component: PlaceMeepleLog, player, css: logCss(player) }
    }

    // SplitTokens confirm
    if (rule === RuleId.SplitTokens && isCustomMoveType(CustomMoveType.ConfirmSplit)(move)) {
      return { Component: SplitTokensLog, player, css: logCss(player) }
    }

    // ChooseLot (single log for the whole lot choice)
    if (rule === RuleId.ChooseLot && isCustomMoveType(CustomMoveType.ChooseLot)(move)) {
      return { Component: ChooseLotLog, player, css: logCss(player) }
    }

    // LogTokensCollected — shows token icons for lot/choose
    if (isCustomMoveType<CustomMoveType.LogTokensCollected, { player: number, tokens: number[] }>(CustomMoveType.LogTokensCollected)(move) && move.data) {
      const data = move.data
      if (rule === RuleId.ChooseLot) {
        const isChooser = data.player === player
        if (isChooser) {
          return { Component: ChooseTokensLog, depth: 1, css: logCss(data.player) }
        }
        return { Component: ReceiveLotLog, player: data.player, css: logCss(data.player) }
      }
      return { Component: ChooseTokensLog, player: data.player, css: logCss(data.player) }
    }

    // DiscardForPig
    if (rule === RuleId.DiscardForPig && isMoveItemType(MaterialType.RoundToken)(move)
      && move.location.type === LocationType.Bag) {
      return { Component: DiscardForPigLog, player, css: logCss(player) }
    }

    // PlaceNotebook
    if (isMoveItemType(MaterialType.NotebookToken)(move)
      && move.location.type === LocationType.NotebookSlot) {
      return { Component: PlaceNotebookLog, player, css: logCss(player) }
    }

    // ── System events ──

    // EndRound (transition to EndRound rule)
    if (isStartRule(move) && move.id === RuleId.EndRound) {
      return { Component: EndRoundLog, css: systemLogCss }
    }

    // FinalScoring
    if (isEndGame(move)) {
      return { Component: FinalScoringLog, css: gameOverCss }
    }

    return undefined
  }
}
