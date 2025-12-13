import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  shape: {
    borderRadius: 8, // Tailwind rounded-md
  },
  spacing: 4, // Tailwind scale (1 = 4px = 0.25rem)
  palette: {
    primary: {
      main: "#2563eb",  // Tailwind blue-600
      light: "#3b82f6", // blue-500
      dark: "#1e40af"   // blue-800
    },
    secondary: {
      main: "#059669",  // Tailwind emerald-600
      light: "#10b981", // emerald-500
      dark: "#047857"   // emerald-700
    },
    error: {
      main: "#dc2626", // red-600
    },
    warning: {
      main: "#d97706", // amber-600
    },
    info: {
      main: "#0284c7", // sky-600
    },
    success: {
      main: "#16a34a", // green-600
    },
    grey: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
  },
});
