//Deps
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { Routes, Route } from "react-router-dom";
import toast from "react-hot-toast";

//Css
import "./App.css";

//MUI
import { Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  QueryClient,
  QueryCache,
  QueryClientProvider,
} from "@tanstack/react-query";

//Component
import Layout from "./Components/Layout/Layout";
import Demo from "./Components/Demo/Demo";

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

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query?.meta?.errorMessage) {
        toast.error(String(query.meta.errorMessage));
      }
    },
  }),
});

function App() {
  //User
  const [authProcessing, setAuthProcessing] = React.useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />

          <Box
            className="App"
            sx={{
              backgroundColor: "black",
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
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
        </ThemeProvider>
      </QueryClientProvider>
    </LocalizationProvider>
  );
}

export default React.memo(App);
