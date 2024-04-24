//Deps
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

//MUI
import { Box, useTheme } from "@mui/material";

//Context
import {
  useUserDetailsContext,
  UserDetailsContext,
} from "../../Context/UserDetailsContext/useUserDetailsContext";

//Components
import Nav from "./Nav/Nav";

//Props
interface ILayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<ILayoutProps> = (): JSX.Element => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  //Theme
  const theme = useTheme();

  //User
  const userDetailsContext = useUserDetailsContext();

  useEffect(() => {
    if (!queryClient?.isFetching() && !queryClient?.isMutating()) {
      const { isAuthenticated } = userDetailsContext;
      if (!isAuthenticated) {
        navigate("/authenticate");
      } else if (isAuthenticated && location.pathname === "/authenticate") {
        navigate("/");
      }
    }
  }, [userDetailsContext.isAuthenticated]);

  return (
    <UserDetailsContext.Provider value={userDetailsContext}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Nav />
        <Box
          sx={{
            width: "100%",
            height: "100%",
            flexGrow: 1,
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 5000,
              style: {
                background: theme.palette.background.paper,
                color: "white",
              },

              success: {
                duration: 3000,
                style: {},
              },
            }}
          />
          <Outlet
            context={{
              isAuthenticated: userDetailsContext?.isAuthenticated,
              isLoading: userDetailsContext?.isLoading,
            }}
          />
        </Box>
      </Box>
    </UserDetailsContext.Provider>
  );
};

export default React.memo(Layout);
