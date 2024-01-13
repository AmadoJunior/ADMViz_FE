//Deps
import React from "react";
import toast from "react-hot-toast";

//MUI
import {Box, Avatar, Typography, TextField} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

//MUI LAB
import { LoadingButton } from '@mui/lab';

//Context
import { UserDetailsContext } from "../../Context/UserDetailsContext/useUserDetailsContext";

//Components

//Props
interface ILoginProps {
  children?: React.ReactNode;
  authProcessing: boolean;
  setAuthProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<ILoginProps> = ({authProcessing, setAuthProcessing}): JSX.Element => {
  //User Details
  const userDetailsContext = React.useContext(UserDetailsContext);

  //Methods
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if(formData.get("username") && formData.get("password")){
      setAuthProcessing(true);
      fetch(`/api/perform_login`, {
        method: "POST",
        body: formData,
      })
      .then(response => {
        console.log(response);
        if(response.status === 200){
          toast.success("Successfull Login");
          return userDetailsContext.handleIsAuthenticated();
        }
        throw new Error(`Failed Login: ${response.status}`);
      })
      .catch(e => {
        toast.error("Failed Login");
        console.error(e);
      })
      .finally(() => {
        setAuthProcessing(false);
      })
    } else {
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
        <LockOutlinedIcon/>
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign In
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Username or Email"
          name="username"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
        />
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          loading={authProcessing}
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </LoadingButton>
      </Box>
    </Box>
  );
}

export default React.memo(Login);
