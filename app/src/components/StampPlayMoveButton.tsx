/** @jsxImportSource @emotion/react */
import { css, ThemeProvider } from '@emotion/react'
import { PlayMoveButton, PlayMoveButtonProps } from '@gamepark/react-game'
import { FC } from 'react'

const stampClipPath = `polygon(
  2% 8%, 8% 0%, 20% 3%, 35% 0%, 50% 2%, 65% 0%, 80% 4%, 92% 0%, 98% 6%,
  100% 20%, 98% 40%, 100% 55%, 97% 70%, 100% 85%, 97% 95%,
  90% 100%, 75% 97%, 60% 100%, 45% 98%, 30% 100%, 15% 96%, 5% 100%,
  0% 92%, 3% 75%, 0% 60%, 2% 45%, 0% 30%, 3% 15%
)`

export const StampPlayMoveButton: FC<PlayMoveButtonProps> = ({ children, ...props }) =>
  <ThemeProvider theme={t => ({ ...t, buttons: resetButtonCss })}>
    <PlayMoveButton css={wrapperCss} {...props}>
      <span css={outlineCss}>
        <span css={stampInnerCss}>{children}</span>
      </span>
    </PlayMoveButton>
  </ThemeProvider>

const resetButtonCss = css`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.4;
  }
`

const wrapperCss = css`
  background: none !important;
  border: none !important;
  padding: 0 !important;
  clip-path: none !important;
  position: relative;
  top: -0.05em;
`

const outlineCss = css`
  display: inline-block;
  padding: 0.12em;
  font-size: 0.85em;
  background-color: #F0D040;
  clip-path: ${stampClipPath};

  button:hover & {
    background-color: #FFE050;
  }

  button:disabled & {
    background-color: #999;
  }
`

const stampInnerCss = css`
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0em 0.7em;
  background-color: #3432A0;
  color: #F0D040;
  font-family: 'Baloo 2', cursive;
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

  button:disabled & {
    background-color: #555;
    color: #999;
  }
`
