import { render, queries } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "../providers/auth";
import theme from "../theme";

const customRender = (ui, options) => {
  const custom = (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>{ui}</AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );

  render(custom, { ...options, queries: { ...queries } });
};

export * from "@testing-library/react";

export { customRender as render };
