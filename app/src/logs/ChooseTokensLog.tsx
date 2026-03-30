/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { CustomMove, MaterialMove } from '@gamepark/rules-api'
import { getPlayerColor } from './logStyles'
import { TokenIcons } from './TokenIcons'

export const ChooseTokensLog: FC<MoveComponentProps<MaterialMove>> = ({ move }) => {
  const data = (move as CustomMove).data as { player: number, tokens: number[] }
  const name = usePlayerName(data.player)

  return (
    <>
      <Trans i18nKey="log.choose.tokens" values={{ player: name }}
        components={[<strong css={nameCss(getPlayerColor(data.player))} />]} />
      <TokenIcons ids={data.tokens} />
    </>
  )
}

const nameCss = (color: string) => css`font-weight: 600; color: ${color};`