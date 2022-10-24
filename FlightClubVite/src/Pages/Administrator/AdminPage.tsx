import React, { useMemo, useState } from 'react'
import {ColorModeContext,useMode} from "../../theme"
import { createTheme, CssBaseline,PaletteMode,Theme,ThemeProvider } from '@mui/material'
import { amber, grey, deepOrange, red } from '@mui/material/colors';
const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'dark'
      ? {
          // palette values for light mode
          primary: amber,
          divider: amber[200],
          text: {
            primary: grey[900],
            secondary: grey[800],
          },
        }
      : {
          // palette values for dark mode
          primary: red,
          divider: deepOrange[700],
          background: {
            default: deepOrange[200],
            paper: deepOrange[200],
          },
          text: {
            primary: '#fff',
            secondary: grey[500],
          },
        }),
  },
});

function AdminPage() {
const [theme1,colorMode1] = useMode()  

const [mode, setMode] = useState<PaletteMode>('light');
  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === 'light' ? 'dark' : 'light',
        );
      },
    }),
    [],
  );

  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]); 
  return (
    <ColorModeContext.Provider value={colorMode1}>
      <ThemeProvider  theme={theme as Theme}>
        <CssBaseline/>
        <div>AdminPage</div>
      </ThemeProvider>
    </ColorModeContext.Provider>
    
  )
}

export default AdminPage
