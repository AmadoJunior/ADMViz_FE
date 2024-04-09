//Deps
import React from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

//MUI
import {
  Box,
  Avatar,
  Typography,
  TextField,
  FormControl,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

//MUI LAB
import { LoadingButton } from "@mui/lab";

//Components
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

//Props
interface ILoginProps {
  children?: React.ReactNode;
  authProcessing: boolean;
  setAuthProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<ILoginProps> = ({
  authProcessing,
  setAuthProcessing,
}): JSX.Element => {
  //Error
  const [errored, setErrored] = React.useState(false);

  //Password
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  //Methods
  const queryClient = useQueryClient();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get("username") && formData.get("password")) {
      setAuthProcessing(true);
      fetch(`/api/perform_login`, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            setErrored(false);
            toast.success("Successfull Login");
            return queryClient.invalidateQueries({
              queryKey: ["getSelf"],
            });
          }
          throw new Error(`Failed Login: ${response.status}`);
        })
        .catch((e) => {
          setErrored(true);
          toast.error("Failed Login");
          console.error(e);
        })
        .finally(() => {
          setAuthProcessing(false);
        });
    } else {
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign In
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", width: "100%", mt: 1 }}
      >
        <TextField
          error={errored}
          margin="normal"
          required
          fullWidth
          label="Username or Email"
          name="username"
        />
        <FormControl variant="outlined" sx={{ mt: 1 }}>
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            id="password"
            error={errored}
            required
            fullWidth
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            name="password"
            label="Password"
          />
        </FormControl>
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          loading={authProcessing}
          sx={{ mt: 2, mb: 2 }}
        >
          Sign In
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default React.memo(Login);
