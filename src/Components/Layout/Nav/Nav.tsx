//Deps
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";

//MUI LAB
import { LoadingButton } from "@mui/lab";

//MUI
import {
  Box,
  Typography,
  AppBar,
  Menu,
  MenuItem,
  Button,
  Toolbar,
  SvgIcon,
  IconButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Divider,
} from "@mui/material";

//Context
import { UserDetailsContext } from "../../../Context/UserDetailsContext/useUserDetailsContext";

//Icons
import MenuIcon from "@mui/icons-material/Menu";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import MapIcon from "@mui/icons-material/Map";
import InfoIcon from "@mui/icons-material/Info";

//Props
interface INavProps {
  children?: React.ReactNode;
}

//Pages
interface IPage {
  title: string;
  path: string;
  icon: typeof SvgIcon;
  public?: boolean;
}
const pages: IPage[] = [
  {
    title: "My Dashboards",
    path: "/",
    icon: QueryStatsIcon,
  },
  {
    title: "About",
    path: "/about",
    icon: MapIcon,
    public: true,
  },
  {
    title: "Demo",
    path: "/demo",
    icon: InfoIcon,
    public: true,
  },
];

const Nav: React.FC<INavProps> = (): JSX.Element => {
  const queryClient = useQueryClient();

  //User Details
  const userDetailsContext = React.useContext(UserDetailsContext);

  //Misc
  const theme = useTheme();
  const location = useLocation();

  const [logoutLoading, setLogoutLoading] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  //Mobile Helpers
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  //Logout Handler
  const logoutMutation = useMutation({
    mutationKey: ["getLogout"],
    mutationFn: () => {
      return fetch(`/api/perform_logout`, {
        redirect: "manual",
      }).then((response) => {
        if (response.status === 200 || response.status === 0) {
          userDetailsContext.clearAuthentication();
        } else {
          throw new Error(`Failed Logout: ${response.status}`);
        }
      });
    },
    meta: {
      successMessage: "Successful Logout",
      errorMessage: "Failed Logout",
    },
  });
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          width: "100%",
          paddingX: "20px",
          maxWidth: "100%",
        }}
      >
        <Toolbar variant="dense" disableGutters>
          <Box
            sx={{
              marginRight: 2,
              display: {
                xs: "none",
                md: "block",
              },
            }}
          >
            <Typography variant="h6" color="primary">
              ADMViz
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="medium"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={[
                {
                  backgroundColor: "primary.main",
                },
                () => ({
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }),
              ]}
            >
              <MenuIcon sx={{}} />
            </IconButton>
            <Menu
              elevation={1}
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages?.map((item, index) => {
                return (
                  <Box key={item.path}>
                    <Link to={item.path}>
                      <MenuItem
                        onClick={handleCloseNavMenu}
                        disabled={
                          !userDetailsContext?.isAuthenticated && !item.public
                        }
                      >
                        <ListItemIcon>
                          <item.icon />
                        </ListItemIcon>
                        <ListItemText disableTypography>
                          <Typography
                            sx={{
                              color: "white",
                            }}
                          >
                            {item.title}
                          </Typography>
                        </ListItemText>
                      </MenuItem>
                    </Link>
                    {index < pages?.length - 1 && <Divider></Divider>}
                  </Box>
                );
              })}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => {
              return (
                <Link key={page.path} to={`${page?.path}`}>
                  <Button
                    disabled={
                      !userDetailsContext?.isAuthenticated && !page.public
                    }
                    variant="outlined"
                    key={page?.path}
                    onClick={handleCloseNavMenu}
                    size="small"
                    sx={[
                      {
                        mx: 1,
                        backgroundColor:
                          location.pathname === page.path
                            ? "rgba(0, 0, 0, 0.3)"
                            : "none",
                      },
                    ]}
                  >
                    <Typography variant="subtitle2">{page?.title}</Typography>
                  </Button>
                </Link>
              );
            })}
          </Box>
          {userDetailsContext.isAuthenticated ? (
            <LoadingButton
              loading={logoutLoading}
              onClick={handleLogout}
              variant="outlined"
              color="error"
              size="small"
            >
              Log Out
            </LoadingButton>
          ) : (
            <Link key={`/authenticate`} to={`/authenticate`}>
              <Button
                variant="outlined"
                key={`/authenticate`}
                onClick={handleCloseNavMenu}
                size="small"
                sx={[
                  {
                    mx: 1,
                    color: "success.main",
                    borderColor: "success.dark",
                    backgroundColor:
                      location.pathname === "/authenticate"
                        ? "rgba(0, 0, 0, 0.3)"
                        : "none",
                    "&:hover": {
                      borderColor: "success.main",
                    },
                  },
                ]}
              >
                <Typography variant="subtitle2">{"Sign In"}</Typography>
              </Button>
            </Link>
          )}
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default React.memo(Nav);
