//Deps
import React from "react";

//MUI
import {Box, Typography} from "@mui/material";

//Images
import ChartSettings from "./../../Images/ChartSettings.png";
import CreatingChartModulePreview from "./../../Images/CreatingChartModulePreview.png";
import CreatingDashboardPreview from "./../../Images/CreatingDashboardPreview.png";
import DeletingDashboardPreview from "./../../Images/DeletingDashboardPreview.png";
import LockingChartModulePreview from "./../../Images/LockingChartModulePreview.png";
import Resize_DnDPreview from "./../../Images/Resize_DnDPreview.png";

//Gifs
import CreatingDashboards from "./../../Images/Gifs/CreatingDashboard.gif";
import DeletingDashboards from "./../../Images/Gifs/DeletingDashboard.gif";
import Resize_DnD from "./../../Images/Gifs/Resize_DnD.gif";
import CreatingChartModules from "./../../Images/Gifs/CreatingChartModule.gif";
import LockingChartModules from "./../../Images/Gifs/LockingChartModule.gif";

//Comps
import GifPlayer from "./GifPlayer/GifPlayer";

//Props
interface IAboutProps {
  children?: React.ReactNode;
}

const About: React.FC<IAboutProps> = (props): JSX.Element => {
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",

      backgroundColor: "background.paper",
      margin: "10px",
      borderRadius: "10px",
      height: "100%",
      width: "100%",
      padding: "20px"
    }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}> About </Typography>
      <Typography gutterBottom>ADM-Viz is an open-source dashboard modeling tool designed for consuming and visualizing SODA API datasets.</Typography>
      
      <Typography variant="subtitle1" gutterBottom  sx={{ fontWeight: 'bold' }}> Creating Dashboards: </Typography>
      <GifPlayer gif={CreatingDashboards} preview={CreatingDashboardPreview} />

      <Typography variant="subtitle1" gutterBottom  sx={{ fontWeight: 'bold' }}> Deleting Dashboards: </Typography>
      <GifPlayer gif={DeletingDashboards} preview={DeletingDashboardPreview} />

      <Typography variant="subtitle1" gutterBottom  sx={{ fontWeight: 'bold' }}> Locking Chart Modules: </Typography>
      <GifPlayer gif={LockingChartModules} preview={LockingChartModulePreview} />

      <Typography variant="subtitle1" gutterBottom  sx={{ fontWeight: 'bold' }}> Creating Chart Modules: </Typography>
      <GifPlayer gif={CreatingChartModules} preview={CreatingChartModulePreview} />

      <Typography variant="subtitle1" gutterBottom  sx={{ fontWeight: 'bold' }}> Dashboard Customization: </Typography>
      <Typography gutterBottom>Each chart module within a dashboard can be freely resized and positioned anywhere within the work area.</Typography>
      <GifPlayer gif={Resize_DnD} preview={Resize_DnDPreview} />

      <Typography variant="subtitle1" gutterBottom  sx={{ fontWeight: 'bold' }}> About Chart Modules: </Typography>
      <Typography gutterBottom>Each chart module employs a web-worker which uses the chart settings to fetch, extract and restructure the visualization data. It expects to receive a JSON array containing key value pairs. It uses the 'Data Key' and 'Label Key' to extract values from each object in the array. It then constructs datasets and labels arrays containing the values pointed to by each key respectively. </Typography>
      
      <Typography variant="subtitle1" gutterBottom  sx={{ fontWeight: 'bold' }}> Chart Module Settings: </Typography>
      <img src={ChartSettings} style={{margin: "10px"}}/>
      
      <Typography variant="subtitle1" gutterBottom  sx={{ fontWeight: 'bold' }}> Basic Settings: </Typography>
      <ul>
        <li><strong>Chart Name:</strong> The title for the visualization.</li>
        <li><strong>Src Url:</strong> Data fetching endpoint.</li>
        <li><strong>Data Key:</strong> Identifier for dataset values.</li>
        <li><strong>Label Key:</strong> Identifier for label values.</li>
        <li><strong>Chart Type:</strong> Specifies the ChartJS chart type.</li>
        <li><strong>From - To:</strong> Date range for the time series, automatically appended to the request query '$WHERE' clause.</li>
      </ul>
      <Typography variant="subtitle1" gutterBottom  sx={{ fontWeight: 'bold' }}> Query Builder: </Typography>
      <ul>
        <li><strong>$SELECT:</strong> The set of columns to be returned, similar to a SELECT in SQL.</li>
        <li><strong>$WHERE:</strong> Filters the rows to be returned, similar to WHERE.</li>
        <li><strong>$GROUP:</strong> Column to group results on, similar to GROUP BY in SQL.</li>
        <li><strong>$ORDER:</strong> Column to order results on, similar to ORDER BY in SQL 	.</li>
        <li><strong>$LIMIT:</strong> Maximum number of results to return.</li>
      </ul>
      <Typography>Learn more about SODA APIs. <a href={"https://dev.socrata.com/docs/queries/"}>Docs</a></Typography>
    </Box>
  );
}

export default React.memo(About);
