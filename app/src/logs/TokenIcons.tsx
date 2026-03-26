/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { usePlay } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api/dist/material/moves/MaterialMoveBuilder'
import { MaterialType } from '@gamepark/amanite/material/MaterialType'
import { MushroomColor } from '@gamepark/amanite/material/MushroomColor'
import { Pig } from '@gamepark/amanite/material/RoundTokenId'
import BlueToken from '../images/tokens/round/BlueMushroomToken.jpg'
import GreenToken from '../images/tokens/round/GreenMushroomToken.jpg'
import PurpleToken from '../images/tokens/round/PurpleMushroomToken.jpg'
import RedToken from '../images/tokens/round/RedMushroomToken.jpg'
import WhiteToken from '../images/tokens/round/WhiteMushroomToken.jpg'
import YellowToken from '../images/tokens/round/YellowMushroomToken.jpg'
import PigToken from '../images/tokens/round/PigToken.jpg'

const tokenImages: Record<number, string> = {
  [MushroomColor.Blue]: BlueToken,
  [MushroomColor.Green]: GreenToken,
  [MushroomColor.Purple]: PurpleToken,
  [MushroomColor.Red]: RedToken,
  [MushroomColor.White]: WhiteToken,
  [MushroomColor.Yellow]: YellowToken,
  [Pig]: PigToken
}

export const TokenIcons: FC<{ ids: number[] }> = ({ ids }) => {
  const play = usePlay()
  return (
    <span css={containerCss}>
      {ids.map((id, i) => {
        const img = tokenImages[id]
        if (!img) return null
        const openHelp = () => play(
          MaterialMoveBuilder.displayMaterialHelp(MaterialType.RoundToken, { id }),
          { transient: true }
        )
        return <img key={i} src={img} css={iconCss} alt="" onClick={openHelp} />
      })}
    </span>
  )
}

const containerCss = css`
  display: inline-flex;
  gap: 0.15em;
  vertical-align: middle;
  margin-left: 0.3em;
`

const iconCss = css`
  width: 2em;
  height: 2em;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  &:hover { filter: brightness(1.2); }
`
