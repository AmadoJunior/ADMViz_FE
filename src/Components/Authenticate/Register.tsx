//Deps
import React from "react";
import useSearchParam from "./../useQueryState";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import { useMutation } from "@tanstack/react-query";

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
  FormHelperText,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

//Icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

//MUI LAB
import { LoadingButton } from "@mui/lab";

//Context

//Props
interface IRegisterProps {
  children?: React.ReactNode;
  setAuthPending: React.Dispatch<React.SetStateAction<boolean>>;
}
interface IFormInput {
  label: string;
  name: string;
  error: boolean;
  errorMsg: string;
  validators?: {
    regex: RegExp;
    msg: string;
  }[];
  exceptions?: {
    regex: RegExp;
    msg: string;
  }[];
}

interface IRegisterFormData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

const defaultFormInputs: IFormInput[] = [
  {
    label: "First Name",
    name: "firstName",
    error: false,
    errorMsg: "",
  },
  {
    label: "Last Name",
    name: "lastName",
    error: false,
    errorMsg: "",
  },
  {
    label: "User Name",
    name: "userName",
    error: false,
    errorMsg: "",
    validators: [
      {
        regex: /^[a-zA-Z0-9]{5,}$/,
        msg: "Length Requirement: 5",
      },
    ],
  },
  {
    label: "Email",
    name: "email",
    error: false,
    errorMsg: "",
    validators: [
      {
        regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        msg: "Invalid Email",
      },
    ],
  },
  {
    label: "Password",
    name: "password",
    error: false,
    errorMsg: "",
    validators: [
      {
        regex: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        msg: "Weak Password",
      },
    ],
  },
];

const Register: React.FC<IRegisterProps> = ({
  setAuthPending,
}): JSX.Element => {
  // Form Nav State
  const [currentForm, setCurrentForm] = useSearchParam("authForm", "0");

  //Rechaptcha State
  const [token, setToken] = React.useState<string | null>(null);
  const recaptchaRef = React.useRef<ReCAPTCHA>();

  //Form Input State
  const [formInputs, setFormInputs] = React.useState<IFormInput[]>([
    ...defaultFormInputs,
  ]);

  //Password
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  //Form Handlers
  const signUpMutation = useMutation({
    mutationKey: ["postSignUp"],
    mutationFn: (jsonData: IRegisterFormData) => {
      setAuthPending(true);
      return fetch(`/api/perform_register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...jsonData, token }),
      })
        .then((response) => {
          if (response?.status === 201) {
            return setCurrentForm();
          } else if (response?.status === 409) {
            const conflictTarget = "userName";
            const conflictValue = jsonData.userName;
            const conflictMessage = "Username Unavailable";
            addException(conflictTarget, {
              regex: RegExp(`^${conflictValue}$`),
              msg: conflictMessage,
            });
            toast.error("Username Unavailable");
          }
          throw new Error("Error: " + response);
        })
        .finally(() => {
          setAuthPending(false);
          recaptchaRef?.current?.reset();
        });
    },
    meta: {
      successMessage: "Successfull Register",
      errorMessage: "Failed Register",
    },
  });
  const validateInputs = (formData: FormData): Promise<IRegisterFormData> => {
    return new Promise((resolve, reject) => {
      const { isValid, updatedFormInputs } = formInputs.reduce<{
        isValid: boolean;
        updatedFormInputs: IFormInput[];
      }>(
        (accumulator, currentValue, currentIndex) => {
          const inputValue = formData.get(currentValue.name) as string;
          console.log(inputValue);
          //Length
          if (!inputValue?.length) {
            accumulator.isValid = false;
            accumulator.updatedFormInputs[currentIndex] = {
              ...currentValue,
              error: true,
              errorMsg: "Required Field",
            };
          } else if (currentValue?.validators?.length) {
            for (const validator of currentValue.validators) {
              if (!validator.regex.test(inputValue)) {
                accumulator.isValid = false;
                accumulator.updatedFormInputs[currentIndex] = {
                  ...currentValue,
                  error: true,
                  errorMsg: validator.msg,
                };
              }
            }
          } else if (currentValue?.exceptions?.length) {
            for (const exception of currentValue.exceptions) {
              if (exception.regex.test(inputValue)) {
                accumulator.isValid = false;
                accumulator.updatedFormInputs[currentIndex] = {
                  ...currentValue,
                  error: true,
                  errorMsg: exception.msg,
                };
              }
            }
          } else {
            accumulator.updatedFormInputs[currentIndex] = {
              ...currentValue,
              error: false,
              errorMsg: "",
            };
          }
          return accumulator;
        },
        {
          isValid: true,
          updatedFormInputs: [...formInputs],
        }
      );

      setFormInputs(updatedFormInputs);

      if (isValid) {
        return resolve({
          firstName: formData.get("firstName") as string,
          lastName: formData.get("lastName") as string,
          userName: formData.get("userName") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        });
      }

      return reject(new Error("Invalid Form Fields"));
    });
  };

  const addException = (
    inputName: string,
    exception: {
      regex: RegExp;
      msg: string;
    }
  ) => {
    setFormInputs((prevInputs) => {
      return prevInputs.map((input) => {
        if (input.name === inputName) {
          if (input.exceptions?.length) {
            return {
              ...input,
              error: true,
              errorMsg: exception.msg,
              exceptions: [...input.exceptions, exception],
            };
          } else {
            return {
              ...input,
              error: true,
              errorMsg: exception.msg,
              exceptions: [exception],
            };
          }
        }
        return input;
      });
    });
  };

  const removeException = (
    inputName: string,
    targetException: {
      regex: RegExp;
      msg: string;
    }
  ) => {
    setFormInputs((prevInputs) => {
      return prevInputs.map((input) => {
        if (input.name === inputName && input.exceptions?.length) {
          const updatedExceptions = input.exceptions.filter(
            (exception) =>
              exception.msg !== targetException.msg ||
              exception.regex.source !== targetException.regex.source
          );
          return { ...input, exceptions: updatedExceptions };
        }
        return input;
      });
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token?.length) return;

    const formData = new FormData(event.currentTarget);
    validateInputs(formData).then((jsonData) =>
      signUpMutation.mutate(jsonData)
    );
  };

  //Captcha Handlers
  const onCaptchaSubmit = () => {
    const captchaValue = recaptchaRef?.current?.getValue();

    if (captchaValue?.length) {
      setToken(captchaValue);
    } else {
      setToken(null);
    }
  };

  const clearToken = () => {
    setToken(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" gutterBottom>
        Register
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        {formInputs?.length &&
          formInputs?.map((formInput, index) => {
            if (formInput.name === "password") {
              return (
                <FormControl
                  key={`FormInput:Login:${index}`}
                  variant="outlined"
                  sx={{ mb: 2 }}
                >
                  <InputLabel htmlFor={formInput.name}>
                    {formInput.label}
                  </InputLabel>
                  <OutlinedInput
                    id={formInput.name}
                    error={formInput?.error}
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
                    name={formInput.name}
                    label={formInput.label}
                  />
                  {formInput?.error && (
                    <FormHelperText>{formInput.errorMsg}</FormHelperText>
                  )}
                </FormControl>
              );
            }
            return (
              <TextField
                key={`FormInput:Login:${index}`}
                required
                fullWidth
                id={formInput.name}
                label={formInput.label}
                name={formInput.name}
                error={formInput.error}
                helperText={formInput.errorMsg}
                sx={{
                  marginBottom: "16px",
                }}
              />
            );
          })}
        <ReCAPTCHA
          theme="dark"
          ref={recaptchaRef as React.RefObject<ReCAPTCHA>}
          sitekey={import.meta.env.VITE_SITE_KEY}
          onChange={onCaptchaSubmit}
          onError={clearToken}
          onExpired={clearToken}
        />
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          loading={signUpMutation.isPending}
          sx={{ mt: 2, mb: 2 }}
          disabled={!token}
        >
          Register
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default React.memo(Register);
