//Deps
import React from "react";
import { useOutletContext, Navigate } from "react-router-dom";

//MUI
import { Box, Skeleton } from "@mui/material";

//Props
type ContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
};
interface IProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({
  children,
}): JSX.Element => {
  const { isLoading, isAuthenticated } = useOutletContext<ContextType>();

  if (isLoading)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          flexGrow: 1,
          width: "100%",
        }}
      >
        <Skeleton
          sx={{
            flexGrow: 1,
            height: "100%",
            width: "100%",
          }}
          variant="rounded"
        />
      </Box>
    );

  if (!isAuthenticated) return <Navigate to={`/authenticate`}></Navigate>;

  return children;
};

export default React.memo(ProtectedRoute);
