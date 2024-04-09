//Deps
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { Routes, Route } from "react-router-dom";

//Css
import "./App.css";

//MUI
import { Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

//Component
import Layout from "./Components/Layout/Layout";
import Demo from "./Components/Demo/Demo";

//Context
import {
  useUserDetailsContext,
  UserDetailsContext,
} from "./Context/UserDetailsContext/useUserDetailsContext";

import Authenticate from "./Components/Authenticate/Authenticate";
import Login from "./Components/Authenticate/Login";
import Register from "./Components/Authenticate/Register";
import About from "./Components/About/About";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import DashboardGrid from "./Components/DashboardViewer/DashboardViewer";

//Darkest #08090a
//Gray #111214
//Border #302f2f
//Them
const darkTheme = createTheme({
  typography: {
    fontFamily: [
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#08090a",
      paper: "#111214",
    },
  },
});

function App() {
  //User
  const userDetailsContext = useUserDetailsContext();
  const [authProcessing, setAuthProcessing] = React.useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <UserDetailsContext.Provider value={userDetailsContext}>
          <Box
            className="App"
            sx={{
              backgroundColor: "black",
              minHeight: "100vh",
            }}
          >
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="/demo" element={<Demo />} />
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <DashboardGrid></DashboardGrid>
                    </ProtectedRoute>
                  }
                />
                <Route path="/about" element={<About />} />
                <Route
                  path="/authenticate"
                  element={
                    <Authenticate
                      authProcessing={authProcessing}
                      setAuthProcessing={setAuthProcessing}
                      childrenProps={[
                        { label: "Sign In", index: 0 },
                        { label: "Register", index: 1 },
                      ]}
                    >
                      <Login
                        authProcessing={authProcessing}
                        setAuthProcessing={setAuthProcessing}
                      />
                      <Register
                        authProcessing={authProcessing}
                        setAuthProcessing={setAuthProcessing}
                      />
                    </Authenticate>
                  }
                />
              </Route>
            </Routes>
          </Box>
        </UserDetailsContext.Provider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default React.memo(App);
