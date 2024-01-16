//Deps
import React, {useEffect, useRef} from "react";
import { Colors } from 'chart.js';
import {
  Chart as ChartJS,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartType,
  ArcElement,
  ChartData
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

//MUI
import { Box } from "@mui/material";

//Default Options
export const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    colors: {
      forceOverride: true
    },
    legend: {
      position: 'top' as const,

      labels: {
        color: 'white', // Set the default text color for legend labels
      }
    },
    title: {
      display: true,
      color: 'white'
    },
  },
  scales: {
    x: { 
        grid: {
          color: "#302f2f"
        },
        ticks: {
          color: "white",
        }
    },
    y: {
      grid: {
        color: "#302f2f"
      },
      ticks: {
        color: "white",
      },
    },
  },
};

//Props
interface IAbstractChartProps {
  children?: React.ReactNode,
  type: ChartType,
  data: ChartData
}

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Colors
);

const AbstractChart: React.FC<IAbstractChartProps> = (({type, data}): JSX.Element => {
  const chartRef = useRef<ChartJS>();
  
  useEffect(() => {
    chartRef?.current?.update();
  }, [data])
  
  return (
    <Box sx={{
      height: "100%",
      width: "100%",
      backgroundColor: "background.paper",
      padding: "10px",
      borderRadius: "10px",
      border: "1px solid",
      borderColor: "#302f2f",
    }}>
      <Chart type={type} ref={chartRef} options={options} data={data} updateMode="resize"  />
    </Box>
    
  );
});

export default React.memo(AbstractChart);
