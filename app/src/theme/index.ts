import { css } from '@emotion/react'
import { BottomBarNavigation } from '@gamepark/react-game'
import { colors } from './colors'
import { buttonsCss } from './buttons'
import { headerBarCss, headerButtonsCss } from './header'
import { journalTabCss, journalTabSelectedCss, historyEntryCss } from './journal'

export const theme = {
  root: {
    fontFamily: 'Baloo 2'
  },
  palette: {
    primary: colors.indigo,
    primaryHover: colors.indigoLight,
    primaryActive: colors.indigoDark,
    primaryLight: '#7A78D0',
    primaryLighter: '#B0AEE8',
    surface: colors.cream,
    onSurface: colors.textDark,
    onSurfaceFocus: 'rgba(52, 50, 160, 0.1)',
    onSurfaceActive: 'rgba(52, 50, 160, 0.2)',
    danger: colors.danger,
    dangerHover: colors.dangerHover,
    dangerActive: colors.dangerActive,
    disabled: colors.disabled
  },
  dialog: {
    backgroundColor: colors.cream,
    color: colors.textDark,
    navigation: BottomBarNavigation,
    container: css`
      border: 2px solid ${colors.indigo};
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    `,
    backdrop: css`
      background: rgba(20, 18, 60, 0.7);
    `
  },
  buttons: buttonsCss,
  dropArea: {
    backgroundColor: 'rgba(66, 64, 184, 0.25)'
  },
  header: {
    bar: headerBarCss,
    buttons: headerButtonsCss
  },
  menu: {
    panel: css`
      background: linear-gradient(180deg, ${colors.cream} 0%, ${colors.creamDark} 100%);
      border: 1px solid ${colors.indigo};

      > button {
        display: flex;
        align-items: center;
        gap: 0.4em;
      }
    `,
    button: css`
      color: ${colors.textDark};
      &:hover {
        background: rgba(52, 50, 160, 0.1);
      }
    `,
    mainButton: css`
      background: linear-gradient(180deg, ${colors.indigo} 0%, ${colors.indigoDark} 100%);
      color: ${colors.cream};
      border: none;
      &:hover {
        background: linear-gradient(180deg, ${colors.indigoLight} 0%, ${colors.indigo} 100%);
      }
    `
  },
  journal: {
    tab: journalTabCss,
    tabSelected: journalTabSelectedCss,
    historyEntry: historyEntryCss
  },
  result: {
    border: colors.indigo,
    icon: colors.yellow,
    container: css`
      background: linear-gradient(180deg, ${colors.cream} 0%, ${colors.creamDark} 100%);
      color: ${colors.textDark};
    `
  },
  tutorial: {
    container: css`
      background: ${colors.cream};
      border: 2px solid ${colors.indigo};
      color: ${colors.textDark};
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
    `,
    content: css`
      button:focus:not(:hover) {
        background: transparent;
      }
    `
  },
  timeStats: {
    container: css`
      background: linear-gradient(180deg, ${colors.cream} 0%, ${colors.creamDark} 100%);
      color: ${colors.textDark};
      border: 1px solid ${colors.indigo};
    `,
    thinkBackground: '#D8D0F0',
    waitBackground: '#E8E0CC'
  }
}
