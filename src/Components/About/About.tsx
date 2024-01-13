//Deps
import React from "react";

//MUI
import {Box, Typography} from "@mui/material";

//Images
import Input from "./../../Assets/Input.png";
import Fetch from "./../../Assets/Fetch.png";
import Output from "./../../Assets/Output.png";
import DashboardControl from "./../../Assets/DashboardControl.png";
import ChartSettings from "./../../Assets/ChartSettings.png";
import ChartControl from "./../../Assets/ChartControl.png";

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
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}> About Page </Typography>
      <Typography gutterBottom>ADM-Viz is an open-source dashboard modeling tool designed for handling JSON data. This dynamic solution incorporates the HTML5 Drag and Drop API, empowering users with the flexibility to personalize their dashboards. Users can effortlessly adjust the size and positioning of charts to fit their unique requirements. Furthermore, ADM-Viz enhances performance by utilizing web-workers for data fetching, based on parameters specified by the user. This approach ensures efficient data management and processing. For the visualization aspect, ADM-Viz employs Chart.js, a robust and versatile library, to render detailed and interactive charts. This integration not only offers high-quality visualizations but also enriches the user experience with its interactive capabilities.</Typography>
      <Typography variant="subtitle1" gutterBottom  sx={{ fontWeight: 'bold' }}> Creating Dashboards: </Typography>
      <img src={DashboardControl} style={{margin: "10px"}}/>
      <Typography variant="subtitle1" gutterBottom  sx={{ fontWeight: 'bold' }}> Creating Charts: </Typography>
      <img src={ChartControl} style={{margin: "10px"}}/>
      <Typography variant="subtitle1" gutterBottom  sx={{ fontWeight: 'bold' }}> Chart Settings: </Typography>
      <img src={ChartSettings} style={{margin: "10px"}}/>
      <Typography gutterBottom>The web-worker tasked with data fetching uses the chart settings to fetch, extract and restructure the visualization data. It expects to receive a JSON array containing key value pairs. It uses the 'Data Key' and 'Label Key' to extract values from each object in the array. It then constructs datasets and labels arrays containing the values pointed to by each key respectively. </Typography>
      <ul>
        <li><strong>Chart Name:</strong> The title for the visualization.</li>
        <li><strong>Src Url:</strong> Data fetching endpoint.</li>
        <li><strong>Data Key:</strong> Identifier for dataset values.</li>
        <li><strong>API Key:</strong> Authorization header for secure requests.</li>
        <li><strong>Label Key:</strong> Identifier for label values.</li>
        <li><strong>Chart Type:</strong> Specifies the ChartJS chart type.</li>
        <li><strong>From - To:</strong> Date range for the time series, appended to the request URL as search parameters.</li>
      </ul>
      <Typography variant="subtitle1" gutterBottom  sx={{ fontWeight: 'bold' }}> Example Request: </Typography>
      <img src={Fetch} style={{margin: "10px"}}/>
      <Typography variant="subtitle1" gutterBottom  sx={{ fontWeight: 'bold' }}> Example Endpoint Response: </Typography>
      <img src={Input} style={{margin: "10px"}}/>
      <Typography variant="subtitle1" gutterBottom  sx={{ fontWeight: 'bold' }}> Example Web-Worker Output: </Typography>
      <img src={Output} style={{margin: "10px"}}/>
    </Box>
  );
}

export default React.memo(About);
