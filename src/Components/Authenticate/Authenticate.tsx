//Deps
import React from "react";
import useSearchParam from "../useQueryState";

//MUI
import { Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";

//Components

//Props
interface IAuthenticateProps {
  children?: React.ReactNode[];
  childrenProps: { label: string; index: number }[];
  authProcessing: boolean;
  setAuthProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

const Authenticate: React.FC<IAuthenticateProps> = ({
  children,
  childrenProps,
  authProcessing,
  setAuthProcessing,
}): JSX.Element => {
  const [currentForm, setCurrentForm] = useSearchParam("authForm", "0");

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "500px",
        backgroundColor: "background.paper",
        padding: "20px 40px 20px 40px",
        borderRadius: "10px",
        height: "100%",
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
        }}
      >
        {children?.length && children[parseInt(currentForm)]}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {childrenProps?.map((item) => {
          return parseInt(currentForm) === item.index ? null : (
            <LoadingButton
              key={`${item.label}${String(item.index)}`}
              variant="outlined"
              loading={authProcessing}
              onClick={() => {
                setCurrentForm(String(item.index));
              }}
            >
              {item.label}
            </LoadingButton>
          );
        })}
      </Box>
    </Box>
  );
};

export default React.memo(Authenticate);
