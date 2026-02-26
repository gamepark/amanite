import {
  CompetitiveScore,
  hideItemId,
  MaterialGame,
  MaterialMove,
  FillGapStrategy,
  PositiveSequenceStrategy,
  SecretMaterialRules,
  TimeLimit
} from '@gamepark/rules-api'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerAnimal } from './PlayerAnimal'
import { RuleId } from './rules/RuleId'
import { ScoringHelper } from './rules/helper/ScoringHelper'
import { ChooseStartCardSideRule } from './rules/ChooseStartCardSideRule'
import { DealInitialCluesRule } from './rules/DealInitialCluesRule'
import { PlaceNewTokensRule } from './rules/PlaceNewTokensRule'
import { PlaceMeepleRule } from './rules/PlaceMeepleRule'
import { SplitTokensRule } from './rules/SplitTokensRule'
import { HarvestRule } from './rules/HarvestRule'
import { ChooseLotRule } from './rules/ChooseLotRule'
import { ChooseTokensRule } from './rules/ChooseTokensRule'
import { DiscardForPigRule } from './rules/DiscardForPigRule'
import { PlaceNotebookRule } from './rules/PlaceNotebookRule'
import { EndRoundRule } from './rules/EndRoundRule'
import { FinalScoringRule } from './rules/FinalScoringRule'
import { RevealCluesRule } from './rules/RevealCluesRule'

export class AmaniteRules
  extends SecretMaterialRules<PlayerAnimal, MaterialType, LocationType>
  implements
    CompetitiveScore<MaterialGame<PlayerAnimal, MaterialType, LocationType>, MaterialMove<PlayerAnimal, MaterialType, LocationType>, PlayerAnimal>,
    TimeLimit<MaterialGame<PlayerAnimal, MaterialType, LocationType>, MaterialMove<PlayerAnimal, MaterialType, LocationType>, PlayerAnimal>
{
  rules = {
    [RuleId.ChooseStartCardSide]: ChooseStartCardSideRule,
    [RuleId.DealInitialClues]: DealInitialCluesRule,
    [RuleId.PlaceNewTokens]: PlaceNewTokensRule,
    [RuleId.PlaceMeeple]: PlaceMeepleRule,
    [RuleId.SplitTokens]: SplitTokensRule,
    [RuleId.Harvest]: HarvestRule,
    [RuleId.ChooseLot]: ChooseLotRule,
    [RuleId.ChooseTokens]: ChooseTokensRule,
    [RuleId.DiscardForPig]: DiscardForPigRule,
    [RuleId.PlaceNotebook]: PlaceNotebookRule,
    [RuleId.EndRound]: EndRoundRule,
    [RuleId.FinalScoring]: FinalScoringRule,
    [RuleId.RevealClues]: RevealCluesRule,
  }

  locationsStrategies = {
    [MaterialType.RoundToken]: {
      [LocationType.Bag]: new PositiveSequenceStrategy(),
      [LocationType.ForestTileTokens]: new PositiveSequenceStrategy(),
      [LocationType.PlayerTokens]: new PositiveSequenceStrategy(),
      [LocationType.TokenDiscard]: new PositiveSequenceStrategy()
    },
    [MaterialType.ClueCard]: {
      [LocationType.ClueDeck]: new PositiveSequenceStrategy(),
      [LocationType.PlayerClueCards]: new PositiveSequenceStrategy()
    },
    [MaterialType.Meeple]: {
      [LocationType.PlayerMeepleStock]: new PositiveSequenceStrategy()
    },
    [MaterialType.NotebookToken]: {
      [LocationType.PlayerNotebookStock]: new PositiveSequenceStrategy()
    }
  }

  hidingStrategies = {
    [MaterialType.ClueCard]: {
      [LocationType.ClueDeck]: (item: any) => item.location?.rotation === true ? [] : ['id'],
      [LocationType.PlayerClueCards]: (item: any, player: any) =>
        item.location?.rotation === true ? (item.location?.player === player ? [] : ['id']) : ['id']
    },
    [MaterialType.RoundToken]: {
      [LocationType.Bag]: hideItemId
    }
  }

  giveTime(): number {
    return 60
  }

  getScore(playerId: PlayerAnimal): number {
    const helper = new ScoringHelper(this.game, playerId)
    return helper.isEliminated ? 0 : helper.score
  }

  getTieBreaker(tieBreaker: number, playerId: PlayerAnimal): number | undefined {
    if (tieBreaker === 1) {
      return new ScoringHelper(this.game, playerId).totalMushroomCount
    }
    return undefined
  }
}
