//Deps
import React from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
//MUI
import { Box, Tab, Typography, useTheme } from "@mui/material";
import { tabsClasses } from "@mui/material/Tabs";

//MUI LAB
import TabList from "@mui/lab/TabList";

//Icons
import DeleteIcon from "@mui/icons-material/Delete";

//Components
import CustomIconButton from "../../Utility/IconButton/IconButton";
import CollapseForm from "../../Utility/CollapseForm/CollapseForm";

interface ICustomTabInput {
  label: string;
  dashboardId: number;
  tabValue: string;
  curTab: string;
  isLoading: boolean;
  disabled?: boolean;
  onDelete: (dashboardId: number) => void;
}
function CustomTab({
  label,
  dashboardId,
  tabValue,
  curTab,
  isLoading,
  onDelete,
  disabled,
}: ICustomTabInput) {
  return (
    <Box display="flex" alignItems="center">
      <Typography
        sx={{
          marginRight: "15px",
        }}
      >
        {label}
      </Typography>
      {curTab === tabValue && (
        <CustomIconButton
          title={`Delete Dashboard`}
          disabled={disabled}
          loading={isLoading}
          handler={() => onDelete(dashboardId)}
        >
          <DeleteIcon
            fontSize="small"
            sx={{
              color: disabled ? "#302f2f" : "white",
            }}
          />
        </CustomIconButton>
      )}
    </Box>
  );
}

//Props
interface IDashboard {
  id: number;
  name: string;
}

interface IDashboardControlProps {
  children?: React.ReactNode;
  dashboards: IDashboard[];
  disabled?: boolean;
  curTab: string;
  setCurTab: React.Dispatch<React.SetStateAction<string>>;
}

const DashboardControl: React.FC<IDashboardControlProps> = ({
  curTab,
  setCurTab,
  disabled,
  dashboards,
}): JSX.Element => {
  const queryClient = useQueryClient();

  //Theme
  const theme = useTheme();

  //Form State
  const [removalLoading, setRemoveLoading] = React.useState(false);
  const [newChartName, setNewChartName] = React.useState("");

  //Form Handlers
  const newDashboardMutation = useMutation({
    mutationKey: ["postDashboard"],
    mutationFn: (dashboardName: string) => {
      return fetch(`/api/dashboards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: dashboardName,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else if (res.status === 406) {
            toast.error(`Dashboard Limit Reached`);
          }
          throw new Error(`Failed Creating Dashboard: ${res.status}`);
        })
        .then((data) => {
          if (data) {
            queryClient.resetQueries({ queryKey: ["getDashboards"] });
            return;
          }
          throw new Error(
            `Failed Retrieving Created Dashboard: ${JSON.stringify(
              data,
              null,
              1
            )}`
          );
        });
    },
    meta: {
      errorMessage: "Error Creating Dashboard",
    },
  });

  const removeDashboardMutation = useMutation({
    mutationKey: ["deleteDashboard"],
    mutationFn: (dashboardId: number) => {
      return fetch(`/api/dashboards/${dashboardId}`, {
        method: "DELETE",
      }).then((res) => {
        if (res?.status === 200) {
          queryClient.resetQueries({ queryKey: ["getDashboards"] });
          setCurTab("0");
          return;
        }
        throw new Error(`Failed Removing Dashboard: ${res.status}`);
      });
    },
    meta: {
      errorMessage: "Error Removing Dashboard",
    },
  });

  const handleNew = (dashboardName: string) => {
    return newDashboardMutation.mutateAsync(dashboardName);
  };

  const handleRemove = (dashboardId: number) => {
    removeDashboardMutation.mutate(dashboardId);
  };

  //Event Handlers
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurTab(newValue);
  };

  return (
    <Box
      sx={{
        borderWidth: "1px",
        borderColor: "divider",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: `${theme.palette.background.paper} !important`,
      }}
    >
      <TabList
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            "&.Mui-disabled": { opacity: 0.3 },
          },
        }}
      >
        {dashboards?.map((dashboard, index) => {
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
                  isLoading={removeDashboardMutation.isPending}
                  disabled={disabled}
                  onDelete={() => handleRemove(dashboard.id)}
                />
              }
              value={String(index)}
            />
          );
        })}
      </TabList>
      <CollapseForm
        disabled={disabled}
        formName="New"
        inputState={{
          value: newChartName,
          setValue: setNewChartName,
        }}
        submitHandler={handleNew}
      />
    </Box>
  );
};

export default React.memo(DashboardControl);
