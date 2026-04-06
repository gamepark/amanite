/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/amanite/material/LocationType'
import { LotZone } from '@gamepark/amanite/material/LotZone'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { Pig } from '@gamepark/amanite/material/RoundTokenId'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'
import { CustomMoveType } from '@gamepark/amanite/rules/CustomMoveType'
import { MaterialTutorial, TutorialStep } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType, MaterialGame, MaterialMove, MaterialRules } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import { me, opponent, TutorialSetup } from './TutorialSetup'

const onTile = (tileX: number) => (move: MaterialMove, game: MaterialGame) => {
  if (!isMoveItemType(MaterialType.Meeple)(move)) return false
  const tile = game.items[MaterialType.ForestTile]?.[move.location.parent!]
  return tile?.location.x === tileX
}

export class Tutorial extends MaterialTutorial<PlayerAnimal, MaterialType, LocationType> {
  version = 5
  options = { players: [{ id: me }, { id: opponent }] }
  setup = new TutorialSetup()
  players = [
    { id: me },
    { id: opponent, name: 'Squirrel' }
  ]

  steps: TutorialStep<PlayerAnimal, MaterialType, LocationType>[] = [

    // ── DISCOVERY: Game overview ──

    // 0: Welcome
    {
      popup: {
        text: () => <Trans i18nKey="tuto.welcome"/>
      }
    },

    // 1: Show mushroom cards (6 colors)
    {
      popup: {
        text: () => <Trans i18nKey="tuto.mushroom.cards"/>,
        position: { y: -25 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.MushroomCard)],
        margin: { left: 5, right: 5, top: 10, bottom: 2 }
      })
    },

    // 2: Show value cards + mushroom cards
    {
      popup: {
        text: () => <Trans i18nKey="tuto.value.cards"/>,
        position: { y: -25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.ValueCard)
        ],
        margin: { left: 5, right: 1, top: 10, bottom: 2 }
      })
    },

    // 3: Explain the secret assignment
    {
      popup: {
        text: () => <Trans i18nKey="tuto.secret"/>,
        position: { y: -25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.ValueCard),
          this.material(game, MaterialType.MushroomCard)
        ],
        margin: { left: 5, right: 1, top: 10, bottom: 2 }
      })
    },

    // 4: Show YOUR clue cards
    {
      popup: {
        text: () => <Trans i18nKey="tuto.clues"/>,
        position: { x: -20 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.ClueCard).location(LocationType.PlayerClueCards).player(me)
        ],
        margin: { top: 3, bottom: 3, left: 30, right: 3 }
      })
    },

    // 5: Explain what YOUR clues tell you
    {
      popup: {
        text: () => <Trans i18nKey="tuto.clues.explain"/>,
        position: { x: -30 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.ClueCard).location(LocationType.PlayerClueCards).player(me)
        ],
        locations: [
          {
            type: LocationType.StartCardClueZone,
            parent: this.material(game, MaterialType.StartCard).player(me).getIndex()
          }
        ],
        margin: { top: 1, bottom: 1, left: 1, right: 1 }
      })
    },

    // ── DISCOVERY: Forest tiles & tokens ──

    // 6: Show forest tiles with tokens
    {
      popup: {
        text: () => <Trans i18nKey="tuto.tiles"/>,
        position: { x: -30, y: 10 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.ForestTile),
          this.material(game, MaterialType.RoundToken).location(LocationType.ForestTileTokens)
        ],
        margin: { top: 2, bottom: 2, left: 2, right: 25 }
      })
    },

    // 7: Explain the 2 zones on a forest tile
    {
      popup: {
        text: () => <Trans i18nKey="tuto.tile.zones"/>,
        position: { x: -30, y: 20 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.ForestTile).filter(item => item.location.x === 0)
        ],
        margin: { top: 2, bottom: 10, left: 2, right: 25 }
      })
    },

    // 8: Show meeples + explain placement
    {
      popup: {
        text: () => <Trans i18nKey="tuto.meeples"/>,
        position: { x: -30, y: -10 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Meeple).location(LocationType.PlayerMeepleStock).player(me)
        ],
        margin: { top: 2, bottom: 2, left: 2, right: 25 }
      })
    },

    // ── GAMEPLAY: Meeple placement ──

    // 9: Place first meeple on tile 0
    {
      popup: {
        text: () => <Trans i18nKey="tuto.place.meeple.1"/>,
        position: { x: -30 }
      },
      focus: (game) => {
        const tileIndex = this.material(game, MaterialType.ForestTile).filter(item => item.location.x === 0).getIndex()
        return {
          materials: [
            this.material(game, MaterialType.Meeple).location(LocationType.PlayerMeepleStock).player(me),
            this.material(game, MaterialType.ForestTile).filter(item => item.location.x === 0),
            this.material(game, MaterialType.RoundToken).location(LocationType.ForestTileTokens)
          ],
          locations: [
            { type: LocationType.ForestTileMeepleSpot, parent: tileIndex, x: 0 }
          ],
          margin: { top: 2, bottom: 15, left: 2, right: 25 }
        }
      },
      move: { player: me, filter: onTile(0) }
    },

    // 10: Opponent places on tile 1 (auto)
    {
      move: { player: opponent, filter: onTile(1) }
    },

    // 11: Place second meeple on tile 2
    {
      popup: {
        text: () => <Trans i18nKey="tuto.place.meeple.2"/>,
        position: { x: -25 }
      },
      focus: (game) => {
        const tileIndex = this.material(game, MaterialType.ForestTile).filter(item => item.location.x === 2).getIndex()
        return {
          materials: [
            this.material(game, MaterialType.Meeple).location(LocationType.PlayerMeepleStock).player(me),
            this.material(game, MaterialType.ForestTile).filter(item => item.location.x === 2),
            this.material(game, MaterialType.RoundToken).location(LocationType.ForestTileTokens)
          ],
          locations: [
            { type: LocationType.ForestTileMeepleSpot, parent: tileIndex, x: 0 }
          ],
          margin: { top: 2, bottom: 5, left: 25, right: 2 }
        }
      },
      move: { player: me, filter: onTile(2) }
    },

    // 12: Opponent places on tile 0 x=1 → triggers split
    {
      move: { player: opponent, filter: onTile(0) }
    },

    // 12b: Explain that the second player on a tile must split the tokens
    {
      popup: {
        text: () => <Trans i18nKey="tuto.split.explain"/>,
        position: { x: -30 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.ForestTile).filter(item => item.location.x === 0),
          this.material(game, MaterialType.RoundToken).location(LocationType.ForestTileTokens),
          this.material(game, MaterialType.Meeple).location(LocationType.ForestTileMeepleSpot)
        ],
        margin: { top: 2, bottom: 5, left: 2, right: 25 }
      })
    },

    // 13-15: Opponent splits tokens (auto: 2 to right + confirm)
    {
      move: {
        player: opponent,
        filter: (move: MaterialMove) =>
          isMoveItemType(MaterialType.RoundToken)(move) && move.location.type === LocationType.ForestTileTokens && move.location.id === LotZone.Bottom
      }
    },
    {
      move: {
        player: opponent,
        filter: (move: MaterialMove) =>
          isMoveItemType(MaterialType.RoundToken)(move) && move.location.type === LocationType.ForestTileTokens && move.location.id === LotZone.Bottom
      }
    },
    {
      move: {
        player: opponent,
        filter: (move: MaterialMove) => isCustomMoveType(CustomMoveType.ConfirmSplit)(move)
      }
    },

    // ── GAMEPLAY: Harvest ──

    // 16: Explain harvest + split result
    {
      popup: {
        text: () => <Trans i18nKey="tuto.harvest"/>,
        position: { x: 32, y: -7 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.ForestTile).filter(item => item.location.x === 0),
          this.material(game, MaterialType.RoundToken).filter(item => item.location.type === LocationType.ForestTileTokens && item.location.parent === this.material(game, MaterialType.ForestTile).filter(item => item.location.x === 0).getIndex())]
      })
    },

    // 17: Choose lot on tile 0
    {
      popup: {
        text: () => <Trans i18nKey="tuto.choose.lot"/>,
        position: { x: 32, y: -7 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.ForestTile).filter(item => item.location.x === 0),
          this.material(game, MaterialType.RoundToken).filter(item => item.location.type === LocationType.ForestTileTokens && item.location.parent === this.material(game, MaterialType.ForestTile).filter(item => item.location.x === 0).getIndex())]
      }),
      move: {
        player: me,
        filter: (move: MaterialMove) => isCustomMoveType(CustomMoveType.ChooseLot)(move)
      }
    },

    // 18-19: Opponent picks 2 tokens from tile 1 (auto)
    {
      move: {
        player: opponent,
        filter: (move: MaterialMove) =>
          isMoveItemType(MaterialType.RoundToken)(move) && move.location.type === LocationType.PlayerTokens
      }
    },
    {
      move: {
        player: opponent,
        filter: (move: MaterialMove) =>
          isMoveItemType(MaterialType.RoundToken)(move) && move.location.type === LocationType.PlayerTokens
      }
    },

    // 20: Explain pigs (zoom on pig token on tile 2)
    {
      popup: {
        text: () => <Trans i18nKey="tuto.pigs"/>,
        position: { x: 0 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.RoundToken).id(Pig)
        ],
        margin: { top: 5, bottom: 5, left: 5, right: 5 }
      })
    },

    // 21: Explain choosing tokens (alone on tile 2) — pick the pig first
    {
      popup: {
        text: () => <Trans i18nKey="tuto.choose.tokens"/>,
        position: { x: 0 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.ForestTile).filter(item => item.location.x === 2),
          this.material(game, MaterialType.RoundToken).location(LocationType.ForestTileTokens),
          this.material(game, MaterialType.RoundToken).location(LocationType.PlayerTokens).player(me)
        ],
        margin: { top: 5, bottom: 5, left: 5, right: 5 },
      }),
      move: {
        player: me,
        filter: (move: MaterialMove, game: MaterialGame) => {
          if (!isMoveItemType(MaterialType.RoundToken)(move)) return false
          if (move.location.type !== LocationType.PlayerTokens) return false
          const item = game.items[MaterialType.RoundToken]?.[move.itemIndex]
          return item?.id === Pig
        }
      }
    },

    // 22: Pick a mushroom token as second token
    {
      move: {
        player: me,
        filter: (move: MaterialMove, game: MaterialGame) => {
          if (!isMoveItemType(MaterialType.RoundToken)(move)) return false
          if (move.location.type !== LocationType.PlayerTokens) return false
          const item = game.items[MaterialType.RoundToken]?.[move.itemIndex]
          return item?.id !== Pig
        }
      }
    },

    // 23: Discard a mushroom token for the pig (if pig was collected)
    {
      popup: {
        text: () => <Trans i18nKey="tuto.discard.pig"/>
      },
      move: {
        player: me,
        filter: (move: MaterialMove) =>
          isMoveItemType(MaterialType.RoundToken)(move) && move.location.type === LocationType.TokenDiscard
      }
    },

    // ── GAMEPLAY: Notebook ──

    // 22: Explain notebook tokens
    {
      popup: {
        text: () => <Trans i18nKey="tuto.notebook"/>,
        position: { x: 25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.NotebookToken).location(LocationType.PlayerNotebookStock).player(me),
          this.material(game, MaterialType.MushroomCard)
        ],
        margin: { left: 1, right: 25, top: 2, bottom: 2 }
      })
    },

    // 23: Explain what placing a notebook does
    {
      popup: {
        text: () => <Trans i18nKey="tuto.notebook.effect"/>,
        position: { x: 25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.NotebookToken).location(LocationType.PlayerNotebookStock).player(me),
          this.material(game, MaterialType.ClueCard).location(LocationType.ClueDeck)
        ],
        margin: { left: 1, right: 25, top: 2, bottom: 2 }
      })
    },

    // 24: Opponent places notebook (auto)
    {
      move: {
        player: opponent,
        filter: (move: MaterialMove) => isMoveItemType(MaterialType.NotebookToken)(move)
      }
    },

    // 25: Place YOUR notebook
    {
      popup: {
        text: () => <Trans i18nKey="tuto.place.notebook"/>,
        position: { x: 25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.NotebookToken).location(LocationType.PlayerNotebookStock).player(me),
          this.material(game, MaterialType.MushroomCard)
        ],
        margin: { left: 1, right: 25, top: 2, bottom: 2 }
      }),
      move: {
        player: me,
        filter: (move: MaterialMove) => isMoveItemType(MaterialType.NotebookToken)(move)
      }
    },

    // ── WRAP-UP ──

    // Explain scoring
    {
      popup: {
        text: () => <Trans i18nKey="tuto.scoring"/>
      }
    },

    // 28: Tutorial complete
    {
      popup: {
        text: () => <Trans i18nKey="tuto.end"/>
      }
    }
  ]

  getNextMove(rules: MaterialRules<PlayerAnimal, MaterialType, LocationType>) {
    const tutorial = rules.game.tutorial
    if (!tutorial || tutorial.step >= this.steps.length) return
    const step = this.steps[tutorial.step]
    if (!step?.move || step.move.player === undefined || step.move.player === me) return
    const moves = rules.getLegalMoves(step.move.player)
    if (step.move.filter) {
      const filtered = moves.filter(m => step.move!.filter!(m, rules.game))
      if (filtered.length > 0) return filtered[0]
    }
    return moves[0]
  }
}
