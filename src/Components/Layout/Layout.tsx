//Deps
import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

//MUI
import { Box, useTheme } from "@mui/material";

//Context
import { UserDetailsContext } from "../../Context/UserDetailsContext/useUserDetailsContext";

//Components
import Nav from "./Nav/Nav";

//Props
interface ILayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<ILayoutProps> = (): JSX.Element => {
  //Theme
  const theme = useTheme();

  //User
  const userDetailsContext = React.useContext(UserDetailsContext);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
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
          display: "flex",
          justifyContent: "center",
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
          context={{ isAuthenticated: userDetailsContext?.isAuthenticated }}
        />
      </Box>
    </Box>
  );
};

export default React.memo(Layout);
