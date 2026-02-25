import { Material, MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerAnimal } from '../../PlayerAnimal'
import { Memory } from '../Memory'

export class GameHelper extends MaterialRulesPart {
  get round(): number {
    return this.remind<number>(Memory.Round)
  }

  get firstPlayer(): PlayerAnimal {
    return this.remind<PlayerAnimal>(Memory.FirstPlayer)
  }

  get players(): PlayerAnimal[] {
    return this.game.players
  }

  get playerCount(): number {
    return this.players.length
  }

  get forestTileCount(): number {
    return this.playerCount + 1
  }

  get notebookSlotsPerMushroom(): number {
    return this.playerCount <= 2 ? 1 : 2
  }

  /** Get players in clockwise order starting from a given player */
  getPlayersClockwise(startPlayer: PlayerAnimal): PlayerAnimal[] {
    const players = this.players
    const startIndex = players.indexOf(startPlayer)
    return [...players.slice(startIndex), ...players.slice(0, startIndex)]
  }

  /** Get players in counter-clockwise order starting from a given player */
  getPlayersCounterClockwise(startPlayer: PlayerAnimal): PlayerAnimal[] {
    return this.getPlayersClockwise(startPlayer).reverse()
  }

  /** Get the next player clockwise */
  getNextPlayer(currentPlayer: PlayerAnimal): PlayerAnimal {
    const players = this.players
    const index = players.indexOf(currentPlayer)
    return players[(index + 1) % players.length]
  }

  /** Get the previous player (counter-clockwise) */
  getPreviousPlayer(currentPlayer: PlayerAnimal): PlayerAnimal {
    const players = this.players
    const index = players.indexOf(currentPlayer)
    return players[(index - 1 + players.length) % players.length]
  }

  /** Get forest tiles */
  get forestTiles(): Material {
    return this.material(MaterialType.ForestTile).location(LocationType.ForestTileRow)
  }

  /** Get tokens on a forest tile */
  getForestTileTokens(tileIndex: number): Material {
    return this.material(MaterialType.RoundToken)
      .location(LocationType.ForestTileTokens)
      .parent(tileIndex)
  }

  /** Get meeples on a forest tile */
  getForestTileMeeples(tileIndex: number): Material {
    return this.material(MaterialType.Meeple)
      .location(LocationType.ForestTileMeepleSpot)
      .parent(tileIndex)
  }

  /** Get a player's meeples in stock */
  getPlayerMeeples(player: PlayerAnimal): Material {
    return this.material(MaterialType.Meeple)
      .location(LocationType.PlayerMeepleStock)
      .player(player)
  }

  /** Get a player's collected tokens */
  getPlayerTokens(player: PlayerAnimal): Material {
    return this.material(MaterialType.RoundToken)
      .location(LocationType.PlayerTokens)
      .player(player)
  }

  /** Get a player's notebook tokens in stock */
  getPlayerNotebooks(player: PlayerAnimal): Material {
    return this.material(MaterialType.NotebookToken)
      .location(LocationType.PlayerNotebookStock)
      .player(player)
  }

  /** Get a player's clue cards */
  getPlayerClues(player: PlayerAnimal): Material {
    return this.material(MaterialType.ClueCard)
      .location(LocationType.PlayerClueCards)
      .player(player)
  }

  /** Get the lot left tokens on a forest tile */
  getLotLeft(tileIndex: number): Material {
    return this.material(MaterialType.RoundToken)
      .location(LocationType.ForestTileLotLeft)
      .parent(tileIndex)
  }

  /** Get the lot right tokens on a forest tile */
  getLotRight(tileIndex: number): Material {
    return this.material(MaterialType.RoundToken)
      .location(LocationType.ForestTileLotRight)
      .parent(tileIndex)
  }
}
