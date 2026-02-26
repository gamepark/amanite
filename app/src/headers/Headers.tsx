import { RuleId } from '@gamepark/amanite/rules/RuleId'
import { ComponentType } from 'react'
import { ChooseStartCardSideHeader } from './ChooseStartCardSideHeader'
import { PlaceMeepleHeader } from './PlaceMeepleHeader'
import { SplitTokensHeader } from './SplitTokensHeader'
import { ChooseLotHeader } from './ChooseLotHeader'
import { ChooseTokensHeader } from './ChooseTokensHeader'
import { DiscardForPigHeader } from './DiscardForPigHeader'
import { PlaceNotebookHeader } from './PlaceNotebookHeader'
import { FinalScoringHeader } from './FinalScoringHeader'
import { RevealCluesHeader } from './RevealCluesHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.ChooseStartCardSide]: ChooseStartCardSideHeader,
  [RuleId.PlaceMeeple]: PlaceMeepleHeader,
  [RuleId.SplitTokens]: SplitTokensHeader,
  [RuleId.ChooseLot]: ChooseLotHeader,
  [RuleId.ChooseTokens]: ChooseTokensHeader,
  [RuleId.DiscardForPig]: DiscardForPigHeader,
  [RuleId.PlaceNotebook]: PlaceNotebookHeader,
  [RuleId.FinalScoring]: FinalScoringHeader,
  [RuleId.RevealClues]: RevealCluesHeader
}
