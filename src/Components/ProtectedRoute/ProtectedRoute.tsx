//Deps
import React from "react";
import { useOutletContext, Navigate } from "react-router-dom";

//MUI

//Props
type ContextType = { isAuthenticated: boolean | null | undefined };
interface IProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({children}): JSX.Element => {
  const {isAuthenticated} = useOutletContext<ContextType>();

  return( 
    <>
    {
      isAuthenticated === false ? 
        (<Navigate to={`/authenticate`}></Navigate>)  :
        (children)
    }
    </>);
}

export default React.memo(ProtectedRoute);
