import {
  CompetitiveScore,
  hideItemId,
  hideItemIdToOthers,
  MaterialGame,
  MaterialMove,
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
import { AcknowledgeCluesRule } from './rules/AcknowledgeCluesRule'

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
    [RuleId.AcknowledgeClues]: AcknowledgeCluesRule
  }

  locationsStrategies = {
    [MaterialType.RoundToken]: {
      [LocationType.Bag]: new PositiveSequenceStrategy(),
      [LocationType.ForestTileTokens]: new PositiveSequenceStrategy(),
      [LocationType.ForestTileLotLeft]: new PositiveSequenceStrategy(),
      [LocationType.ForestTileLotRight]: new PositiveSequenceStrategy(),
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
      [LocationType.ClueDeck]: (item) => item.location?.rotation === 1 ? [] : ['id'],
      [LocationType.PlayerClueCards]: hideItemIdToOthers
    },
    [MaterialType.RoundToken]: {
      [LocationType.Bag]: hideItemId
    }
  }

  giveTime(): number {
    return 60
  }

  getScore(playerId: PlayerAnimal): number {
    return new ScoringHelper(this.game).getScore(playerId)
  }

  getTieBreaker(tieBreaker: number, playerId: PlayerAnimal): number | undefined {
    if (tieBreaker === 1) {
      // Fewest mushroom tokens wins tiebreaker (excluding pigs)
      return new ScoringHelper(this.game).getTotalMushroomCount(playerId)
    }
    return undefined
  }
}
