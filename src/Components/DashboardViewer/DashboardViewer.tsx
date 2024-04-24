//Deps
import React from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

//MUI
import { Box, Skeleton } from "@mui/material";

//MUI LAB
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";

//Context
import { UserDetailsContext } from "../../Context/UserDetailsContext/useUserDetailsContext";
import Dashboard from "../Dashboard/Dashboard";

//Custom
import { DASH_CONTROLS_HEIGHT, GUTTER_SIZE, NAV_HEIGHT } from "../../constants";
import DashboardControl from "./DashboardControl/DashboardControl";

//Props
interface IDashboard {
  id: number;
  name: string;
}

interface IDashboardGridProps {
  children?: React.ReactNode;
  demo?: boolean;
}

const DashboardGrid: React.FC<IDashboardGridProps> = ({
  demo,
}): JSX.Element => {
  //Theme
  const [height, setHeight] = React.useState(0);

  //User
  const userDetailsContext = React.useContext(UserDetailsContext);
  const [userId, setUserId] = React.useState<number | undefined>(undefined);

  //Tab State
  const [curTab, setCurTab] = React.useState("0");

  //Effect
  React.useEffect(() => {
    if (
      !demo &&
      userDetailsContext?.isAuthenticated &&
      userDetailsContext?.userDetails
    ) {
      const { id } = userDetailsContext?.userDetails;
      setUserId(id);
    }
  }, [userDetailsContext?.isAuthenticated]);

  React.useEffect(() => {
    // Function to handle the resize event
    const handleResize = () => {
      setHeight(document.documentElement.clientHeight);
    };

    // Set initial height
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //API Helpers
  const { data, isPending } = useQuery({
    queryKey: ["getDashboards"],
    queryFn: () => {
      return fetch(`/sdr/users/${userId}/dashboards`, {
        method: "GET",
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          }
          throw new Error(`Failed Fetching Dashboards: ${res.status}`);
        })
        .then((data) => {
          if (data?.["_embedded"]?.["dashboards"])
            return data?.["_embedded"]?.["dashboards"] as IDashboard[];

          throw new Error(
            `Failed Extracting Dashboards: ${JSON.stringify(data, null, 1)}`
          );
        });
    },
    enabled: !!userId,
    initialData: demo
      ? [
          {
            id: 0,
            name: "Demo",
          },
        ]
      : undefined,
    meta: {
      errorMessage: "Failed Fetching Dashboards",
    },
  });

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {!isPending ? (
        <TabContext value={curTab}>
          <DashboardControl
            curTab={curTab}
            setCurTab={setCurTab}
            disabled={demo}
            dashboards={data || []}
          />
          {(userDetailsContext?.isAuthenticated || demo) &&
            data?.map((dashboard, index) => {
              return (
                <TabPanel
                  key={`TabPanels:${dashboard.name}${index}`}
                  sx={{
                    padding: "0px",
                  }}
                  value={String(index)}
                >
                  <Dashboard
                    userId={
                      userDetailsContext?.userDetails
                        ? userDetailsContext.userDetails.id
                        : 0
                    }
                    dashboardName={dashboard.name}
                    dashboardId={dashboard.id}
                    demo={demo}
                  />
                </TabPanel>
              );
            })}
        </TabContext>
      ) : (
        <>
          <Skeleton
            variant="rounded"
            sx={{
              height: `${DASH_CONTROLS_HEIGHT}px`,
            }}
          />
          <Skeleton
            variant="rounded"
            sx={{
              marginTop: "10px",
              height: `${
                height - NAV_HEIGHT + DASH_CONTROLS_HEIGHT + GUTTER_SIZE * 2
              }px`,
            }}
          />
        </>
      )}
    </Box>
  );
};

export default React.memo(DashboardGrid);
