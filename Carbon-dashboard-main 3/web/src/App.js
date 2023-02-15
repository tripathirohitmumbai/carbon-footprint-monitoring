import React from "react";
import { ThemeProvider } from "@mui/material";
import { Route, Routes, useLocation, Navigate, Outlet } from "react-router-dom";

import theme from "./theme";
import Dashboard from "./components/Dashboard/Dashboard";
import { AuthProvider, useAuth } from "./providers/auth";
import SignIn from "./components/SignIn";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <div style={{ height: "100vh" }}>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route element={<RenderAuth />}>
              <Route path="/" element={<Dashboard />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

function RenderAuth() {
  const auth = useAuth();
  const location = useLocation();

  if (!auth?.user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default App;
