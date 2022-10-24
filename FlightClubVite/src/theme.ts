import { PaletteMode } from "@mui/material";
import { amber, grey, deepOrange } from "@mui/material/colors";
import { createTheme } from "@mui/system";
import { useMemo } from "react";
import { useState } from "react";
import { createContext } from "react";

export const tokens = (mode : any) => ({
  ...(mode === "dark"
    ? {
      gray: {
        100: "#e0e0e0",
        200: "#c2c2c2",
        300: "#a3a3a3",
        400: "#858585",
        500: "#666666",
        600: "#525252",
        700: "#3d3d3d",
        800: "#292929",
        900: "#141414",
      },
      primary: {
        100: "#d0d1d5",
        200: "#a1a4ab",
        300: "#727681",
        400: "#434957",
        500: "#141b2d",
        600: "#101624",
        700: "#0c101b",
        800: "#080b12",
        900: "#040509",
      },
      greenAccent: {
        100: "#dbf5ee",
        200: "#b7ebde",
        300: "#94e2cd",
        400: "#70d8bd",
        500: "#4cceac",
        600: "#3da58a",
        700: "#2e7c67",
        800: "#1e5245",
        900: "#0f2922",
      },
      redAccent: {
        100: "#f8dcd9",
        200: "#f1b9b3",
        300: "#e9958c",
        400: "#e27266",
        500: "#db4f40",
        600: "#af3f33",
        700: "#832f26",
        800: "#58201a",
        900: "#2c100d",
      },
      blueAccent: {
        100: "#e1e2fe",
        200: "#c3c6fd",
        300: "#a4a9fc",
        400: "#868dfb",
        500: "#6870fa",
        600: "#535ac8",
        700: "#3e4396",
        800: "#2a2d64",
        900: "#151632",
      }
    }
    : {
      gray: {
        100: "#141414",
        200: "#292929",
        300: "#3d3d3d",
        400: "#525252",
        500: "#666666",
        600: "#858585",
        700: "#a3a3a3",
        800: "#c2c2c2",
        900: "#e0e0e0",
      },
      primary: {
        100: "#040509",
        200: "#080b12",
        300: "#0c101b",
        400: "#101624",
        500: "#141b2d",
        600: "#434957",
        700: "#727681",
        800: "#a1a4ab",
        900: "#d0d1d5",
      },
      greenAccent: {
        100: "#0f2922",
        200: "#1e5245",
        300: "#2e7c67",
        400: "#3da58a",
        500: "#4cceac",
        600: "#70d8bd",
        700: "#94e2cd",
        800: "#b7ebde",
        900: "#dbf5ee",
      },
      redAccent: {
        100: "#2c100d",
        200: "#58201a",
        300: "#832f26",
        400: "#af3f33",
        500: "#db4f40",
        600: "#e27266",
        700: "#e9958c",
        800: "#f1b9b3",
        900: "#f8dcd9",
      },
      blueAccent: {
        100: "#151632",
        200: "#2a2d64",
        300: "#3e4396",
        400: "#535ac8",
        500: "#6870fa",
        600: "#868dfb",
        700: "#a4a9fc",
        800: "#c3c6fd",
        900: "#e1e2fe",
      }
    }
  )
})

/* mui them setting */
export const themeSettings = (mode : any) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === 'dark'
        ? {
          primary: {
            main: colors.primary[500],
          },
          secondary: {
            main: colors.greenAccent[500],
          },
          neutral: {
            dark: colors.gray[700], 
            main: colors.gray[500],
            light:  colors.gray[100]
          },
          background:{
            default: colors.primary[500]
          }
        }
        : {
          primary: {
            main: colors.primary[100],
          },
          secondary: {
            main: colors.greenAccent[500],
          },
          neutral: {
            dark: colors.gray[700], 
            main: colors.gray[500],
            light:  colors.gray[100]
          },
          background:{
            default: '#fcfcfc'
          }
        })
    },
    typography: {
      fontFamily: ['Source Sans Pro', 'sans-serif'].join(","),
      fontSize: 12,
      h1:{
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(","),
        fontSize: 42,
      },
      h2:{
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(","),
        fontSize: 32,
      },
      h3:{
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(","),
        fontSize: 24,
      },
      h4:{
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(","),
        fontSize: 20,
      },
      h5:{
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(","),
        fontSize: 16,
      },
      h6:{
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(","),
        fontSize: 14,
      },
    }
  }
}
const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
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
          primary: deepOrange,
          divider: deepOrange[700],
          background: {
            default: deepOrange[900],
            paper: deepOrange[900],
          },
          text: {
            primary: '#fff',
            secondary: grey[500],
          },
        }),
  },
});

/* context for color mode */
export const ColorModeContext = createContext<any>({
  toggleColorMode: () => {}
})

export const useMode = () => {
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
  return [theme,colorMode];
};



