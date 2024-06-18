import { useAppSelector } from "@/store/hooks";
import { appDataSelector } from "@/store/slices/appSlice";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline, createTheme } from "@mui/material";
import { ReactNode } from "react";
import { shallowEqual } from "react-redux";

interface Props {
  children: ReactNode;
}

export default function ThemeProviiderWrapper({ children }: Props) {
  const { app } = useAppSelector(appDataSelector, shallowEqual);

  const { theme: appTheme } = app;
  const getDesignTokens = () => {
    if (appTheme === "light") {
      return {
        palette: {
          primary: { main: "#4C4C6D" },
          secondary: { main: "#FFE194" },
          info: { main: "#E8F6EF" },
          success: { main: "#1B9C85" },
        },
      };
    }
    return {
      palette: {
        primary: {
          main: "#222831",
        },
        secondary: { main: "#EEEEEE" },
        info: { main: "#393E46" },
        success: { main: "#00ADB5" },
      },
      components: {
        MuiInputBase: {
          styleOverrides: {
            formControlLabel: { color: "#EEEEEE" },
            input: {
              color: "#EEEEEE",
              border: "1px solid lightgray",
              borderRadius: "5px",
            },
          },
        },
      },
    };
  };

  const theme = createTheme(getDesignTokens());
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
