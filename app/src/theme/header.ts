import { css } from '@emotion/react'
import { colors } from './colors'
import { headerButtonsCss } from './buttons'

export const headerBarCss = css`
  background: linear-gradient(180deg, rgba(30, 26, 80, 0.92) 0%, rgba(20, 18, 60, 0.88) 100%);
  border-bottom: 1px solid rgba(66, 64, 184, 0.4);
  color: ${colors.cream};
  overflow: visible;

  > h1 {
    overflow: visible;
  }
`

export { headerButtonsCss }
