//Deps
import React from "react";
import toast from "react-hot-toast";

//MUI
import {Box, Tab, Typography, useTheme } from "@mui/material";
import { tabsClasses } from '@mui/material/Tabs';

//MUI LAB
import TabList from '@mui/lab/TabList';

//Icons
import DeleteIcon from '@mui/icons-material/Delete';

//Components
import CustomIconButton from "../../Utility/IconButton/IconButton";
import CollapseForm from "../../Utility/CollapseForm/CollapseForm";

interface ICustomTabInput {
  label: string,
  dashboardId: number,
  tabValue: string,
  curTab: string,
  isLoading: boolean,
  disabled?: boolean,
  onDelete: (dashboardId: number) => void,
}
function CustomTab({ label, dashboardId, tabValue, curTab, isLoading, onDelete, disabled }: ICustomTabInput) {
  return (
    <Box display="flex" alignItems="center">
      <Typography sx={{
        marginRight: "15px"
      }}>{label}</Typography>
      {
        curTab === tabValue && 
        <CustomIconButton title={`Delete Dashboard`} disabled={disabled} loading={isLoading} handler={() => onDelete(dashboardId)}>
          
            <DeleteIcon fontSize="small" sx={{
              color: disabled ? "#302f2f" : "white"
            }}/>
          
        </CustomIconButton>
      }
    </Box>
  );
}

//Props
interface IDashboard {
  id: number,
  name: string,
}

interface IDashboardControlProps {
  children?: React.ReactNode;
  dashboards: IDashboard[];
  disabled?: boolean,
  setDashboards: React.Dispatch<React.SetStateAction<IDashboard[]>>;
  curTab: string,
  setCurTab: React.Dispatch<React.SetStateAction<string>>
}

const DashboardControl: React.FC<IDashboardControlProps> = ({dashboards, setDashboards, curTab, setCurTab, disabled}): JSX.Element => {
  //Theme
  const theme = useTheme();

  //Form State
  const [removalLoading, setRemoveLoading] = React.useState(false);
  const [newChartName, setNewChartName] = React.useState("");

  //Form Handlers
  const handleNew = (dashboardName: string) => {
    return fetch(`${import.meta.env.NODE_ENV === "production" ? "https://" : "http://"}${import.meta.env.VITE_API_ENDPOINT}/api/dashboards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: dashboardName
      })
    })
      .then(res => {
        if(res.status === 200){
          return res.json();
        }
        throw new Error(`Failed Creating Dashboard: ${res.status}`);
      })
      .then(data => {
        if(data) {
          setDashboards(prev => [
            ...prev, 
            {
              id: data?.id,
              name: data?.name,
            }
          ]);
          return;
        }
        throw new Error(`Failed Retrieving Created Dashboard: ${JSON.stringify(data, null, 1)}`);
      })
      .catch(e => {
        toast.error("Failed Creating Dashboard");
        console.error(e);
      })
  }

  const handleRemove = (dashboardId: number) => {
    setRemoveLoading(true);
    fetch(`${import.meta.env.NODE_ENV === "production" ? "https://" : "http://"}${import.meta.env.VITE_API_ENDPOINT}/api/dashboards/${dashboardId}`, {
      method: "DELETE",
    })
      .then(res => {
        if(res?.status === 200) {
          setDashboards(prev => prev.filter((value) => value?.id !== dashboardId));
          setCurTab("0");
          return;
        }
        throw new Error(`Failed Removing Dashboard: ${res.status}`);
      })
      .catch(e => {
        toast.error("Failed Removing Dashboard");
        console.error(e);
      })
      .finally(() => {
        setRemoveLoading(false);
      })
  }

  //Event Handlers
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurTab(newValue);
  };

  return (
    <Box sx={{ 
      borderWidth: "1px", 
      borderColor: 'divider',
      borderRadius: "5px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: `${theme.palette.background.paper} !important`,
    }}>
      <TabList 
        onChange={handleChange} 
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
        {
          dashboards?.map((dashboard, index) => {
            return (
              <Tab
                disabled={disabled}
                key={`TabList:${dashboard.name}${index}`}
                label={
                  <CustomTab 
                    label={dashboard.name} 
                    dashboardId={dashboard.id}
                    tabValue={String(index)}
                    curTab={curTab}
                    isLoading={removalLoading}
                    disabled={disabled}
                    onDelete={() => handleRemove(dashboard.id)} 
                  />
                }
                value={String(index)}
              />
            )
          })
        }
      </TabList>
        <CollapseForm
          disabled={disabled}
          formName="Create Dashboard" 
          inputState={{
            value: newChartName,
            setValue: setNewChartName,
          }} 
          submitHandler={handleNew}
        />
    </Box>
  );
}

export default React.memo(DashboardControl);
