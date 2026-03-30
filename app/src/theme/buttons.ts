import { css } from '@emotion/react'
import { colors } from './colors'

export const buttonsCss = css`
  padding: 0.2em 0.6em;
  border-radius: 0.4em;
  border: 1.5px solid ${colors.indigo};
  background: ${colors.indigo};
  color: ${colors.yellow};
  font-family: 'Baloo 2', cursive;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: ${colors.indigoLight};
    border-color: ${colors.indigoLight};
    color: ${colors.yellowLight};
  }

  &:active {
    background: ${colors.indigoDark};
    border-color: ${colors.indigoDark};
    color: ${colors.yellowDark};
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
    background: #555;
    border-color: #555;
    color: #999;
  }
`

export const headerButtonsCss = css`
  border: 1.5px solid ${colors.indigo};
  background: ${colors.indigo};
  color: ${colors.yellow};
  font-family: 'Baloo 2', cursive;
  font-weight: 700;
  font-size: 0.85em;
  padding: 0.2em 0.5em;
  border-radius: 0.4em;
  letter-spacing: 0.02em;
  text-transform: none;
  cursor: pointer;

  &:hover {
    background: ${colors.indigoLight};
    border-color: ${colors.indigoLight};
    color: ${colors.yellowLight};
  }

  &:active {
    background: ${colors.indigoDark};
    border-color: ${colors.indigoDark};
    color: ${colors.yellowDark};
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
    background: #555;
    border-color: #555;
    color: #999;
  }
`
