import { AmaniteBot } from '@gamepark/amanite/AmaniteBot'
import { MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { PlayerAnimal } from '@gamepark/amanite/PlayerAnimal'

export const ai = (game: MaterialGame, playerId: PlayerAnimal): Promise<MaterialMove[]> => {
  return Promise.resolve(new AmaniteBot(playerId).run(game))
}
