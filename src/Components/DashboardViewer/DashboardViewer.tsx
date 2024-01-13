//Deps
import React from "react";
import toast from "react-hot-toast";

//MUI
import {Box, Skeleton } from "@mui/material";

//MUI LAB
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';

//Context
import { UserDetailsContext } from "../../Context/UserDetailsContext/useUserDetailsContext";
import Dashboard from "../Dashboard/Dashboard";

//Custom
import { DASH_CONTROLS_HEIGHT, GUTTER_SIZE, NAV_HEIGHT } from "../../constants";
import DashboardControl from "./DashboardControl/DashboardControl";



//Props
interface IDashboard {
  id: number,
  name: string,
}

interface IDashboardGridProps {
  children?: React.ReactNode;
  demo?: boolean;
}

const DashboardGrid: React.FC<IDashboardGridProps> = ({demo}): JSX.Element => {
  //Theme
  const [height, setHeight] = React.useState(0);

  //User
  const userDetailsContext = React.useContext(UserDetailsContext);

  //Dashboards
  const [loading, setLoading] = React.useState(true);
  const [dashboards, setDashboards] = React.useState<IDashboard[]>([]);

  //Tab State
  const [curTab, setCurTab] = React.useState("0");

  //Effect
  React.useEffect(() => {
    if(userDetailsContext?.isAuthenticated && userDetailsContext?.userDetails){
      const { id } = userDetailsContext?.userDetails;
      fetchDashboards(id);
    } else if(demo){
      setDashboards([{
        id: 0,
        name: "Demo"
      }]);
      setLoading(false);
    }
  }, [userDetailsContext?.isAuthenticated])

  React.useEffect(() => {
    // Function to handle the resize event
    const handleResize = () => {
      setHeight(document.documentElement.clientHeight);
    };

    // Set initial height
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //API Helpers
  const fetchDashboards = (userId: number) => {
    fetch(`/sdr/users/${userId}/dashboards`, {
      method: "GET",
    })
    .then(res => {
      if(res.status === 200){
        return res.json();
      }
      throw new Error(`Failed Fetching Dashboards: ${res.status}`);
    })
    .then(data => {
      console.log(data);
      if(data?.["_embedded"]?.["dashboards"]) {
        return setDashboards(data?.["_embedded"]?.["dashboards"]);
      }
      throw new Error(`Failed Extracting Dashboards: ${JSON.stringify(data, null, 1)}`);
    })
    .catch(e => {
      toast.error("Failed Fetching Dashboards");
      console.error(e);
    })
    .finally(() => {
      setLoading(false);
    })
  }

  return (
    <Box sx={{
      padding: "10px 10px 10px 10px",
      width: "100%"
    }}>
      {
        !loading ?
        <TabContext value={curTab}>
          <DashboardControl 
            curTab={curTab}
            setCurTab={setCurTab}
            dashboards={dashboards}
            setDashboards={setDashboards}
            disabled={demo}
          />
          {
            (userDetailsContext?.isAuthenticated || demo) && dashboards?.map((dashboard, index) => {
              return (
                <TabPanel 
                  key={`TabPanels:${dashboard.name}${index}`} 
                  sx={{
                    padding: "0px"
                  }} 
                  value={String(index)}>
                    <Dashboard 
                      userId={userDetailsContext?.userDetails ? userDetailsContext.userDetails.id : 0} 
                      dashboardName={dashboard.name} 
                      dashboardId={dashboard.id}
                      demo={demo}
                    />
                </TabPanel>
              )
            })
          }
        </TabContext>
        :
        <>
          <Skeleton variant="rounded" sx={{
            height: `${DASH_CONTROLS_HEIGHT}px`
          }}/>
          <Skeleton variant="rounded" sx={{
            marginTop: "10px",
            height: `${height - NAV_HEIGHT + DASH_CONTROLS_HEIGHT + GUTTER_SIZE*2}px`
          }}/>
        </>
        
      }
    </Box>
  );
}

export default React.memo(DashboardGrid);
