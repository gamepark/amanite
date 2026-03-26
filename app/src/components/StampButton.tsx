/** @jsxImportSource @emotion/react */
import { css, Interpolation, keyframes, Theme } from '@emotion/react'
import { ItemMenuButton } from '@gamepark/react-game'
import { FC, PropsWithChildren } from 'react'

type StampButtonProps = PropsWithChildren<{
  move: any
  x?: number
  y?: number
  extraCss?: Interpolation<Theme>
  vertical?: boolean
  align?: 'left' | 'center' | 'right'
}>

const stampClipPath = `polygon(
  2% 8%, 8% 0%, 20% 3%, 35% 0%, 50% 2%, 65% 0%, 80% 4%, 92% 0%, 98% 6%,
  100% 20%, 98% 40%, 100% 55%, 97% 70%, 100% 85%, 97% 95%,
  90% 100%, 75% 97%, 60% 100%, 45% 98%, 30% 100%, 15% 96%, 5% 100%,
  0% 92%, 3% 75%, 0% 60%, 2% 45%, 0% 30%, 3% 15%
)`

export const StampButton: FC<StampButtonProps> = ({ move, x, y, extraCss, vertical, align = 'center', children }) =>
  <ItemMenuButton move={move} x={x} y={y}
    style={{ background: 'none', border: 'none', borderRadius: 0, width: 'auto', height: 'auto', padding: 0 }}>
    <div css={extraCss} style={{ transform: align === 'left' ? 'translateX(50%)' : align === 'right' ? 'translateX(-50%)' : undefined }}>
      <span css={outlineCss}>
        <span css={[stampInnerCss, vertical && verticalCss]}>{children}</span>
      </span>
    </div>
  </ItemMenuButton>

const outlineCss = css`
  display: inline-block;
  padding: 0.12em;
  background-color: #F0D040;
  clip-path: ${stampClipPath};

  button:hover & {
    background-color: #FFE050;
  }
`

const slide = keyframes`
  0%, 100% { transform: translateX(-0.15em); }
  50% { transform: translateX(0.15em); }
`

export const slideCss = css`
  animation: ${slide} 1.5s ease-in-out infinite;
  &:hover { animation-play-state: paused; }
`

const stampInnerCss = css`
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.4em 0.7em;
  background-color: #3432A0;
  color: #F0D040;
  font-family: 'Baloo 2', cursive;
  font-size: 1em;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
  clip-path: ${stampClipPath};

  button:hover & {
    background-color: #4240B8;
    color: #FFE050;
  }

  button:active & {
    background-color: #2A2880;
    color: #C8B030;
  }
`

const verticalCss = css`
  flex-direction: column;
`

export const stampButtonCss = stampInnerCss

export const stampIconCss = css`
  font-size: 0.7em;
`
