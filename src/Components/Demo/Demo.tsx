//Deps
import React from "react";

//MUI
import DashboardViewer from "../DashboardViewer/DashboardViewer";

//Components

//Props
interface IDemoProps {
  children?: React.ReactNode;
}

const Demo: React.FC<IDemoProps> = (props): JSX.Element => {
  return (
    <DashboardViewer demo={true}></DashboardViewer>
  );
}

export default React.memo(Demo);
