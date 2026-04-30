import { RuleId } from '@gamepark/amanite/rules/RuleId'
import { ComponentType } from 'react'
import { PlaceMeepleHeader } from './PlaceMeepleHeader'
import { SplitTokensHeader } from './SplitTokensHeader'
import { ChooseLotHeader } from './ChooseLotHeader'
import { ChooseTokensHeader } from './ChooseTokensHeader'
import { DiscardForPigHeader } from './DiscardForPigHeader'
import { PlaceNotebookHeader } from './PlaceNotebookHeader'
import { FinalScoringHeader } from './FinalScoringHeader'
import { PlaceNewTokensHeader } from './PlaceNewTokensHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.PlaceNewTokens]: PlaceNewTokensHeader,
  [RuleId.PlaceMeeple]: PlaceMeepleHeader,
  [RuleId.SplitTokens]: SplitTokensHeader,
  [RuleId.ChooseLot]: ChooseLotHeader,
  [RuleId.ChooseTokens]: ChooseTokensHeader,
  [RuleId.DiscardForPig]: DiscardForPigHeader,
  [RuleId.PlaceNotebook]: PlaceNotebookHeader,
  [RuleId.FinalScoring]: FinalScoringHeader
}
