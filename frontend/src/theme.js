import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#000" },
    secondary: { main: "#555" },
  },

  typography: {
    fontFamily: `"Aldrich", sans-serif`,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "Aldrich",
          textTransform: "none",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "Aldrich",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontFamily: "Aldrich",
        },
      },
    },
  },
});

export default theme;
