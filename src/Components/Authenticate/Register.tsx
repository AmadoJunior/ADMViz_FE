//Deps
import React from "react";
import useSearchParam from "./../useQueryState";
import toast from "react-hot-toast";

//MUI
import {Box, Avatar, Typography, TextField} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

//MUI LAB
import { LoadingButton } from '@mui/lab';

//Context

//Props
interface IRegisterProps {
  children?: React.ReactNode;
  authProcessing: boolean;
  setAuthProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}
interface IFormInput {
  label: string,
  name: string,
  error: boolean,
  errorMsg: string,
  validators?: {
    regex: RegExp,
    msg: string,
  }[],
  exceptions?: {
    regex: RegExp,
    msg: string,
  }[]
}

interface IRegisterFormData {
  firstName: string,
  lastName: string,
  userName: string,
  email: string,
  password: string,
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
        msg: "Length Requirement: 5"
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
        msg: "Invalid Email"
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
        msg: "Weak Password"
      },
    ],
  },
];

const Register: React.FC<IRegisterProps> = ({authProcessing, setAuthProcessing}): JSX.Element => {
  const [currentForm, setCurrentForm] = useSearchParam("authForm", "0");
  const [formInputs, setFormInputs] = React.useState<IFormInput[]>([...defaultFormInputs]);

  const validateInputs = (formData: FormData): Promise<IRegisterFormData> => {
    return new Promise((resolve, reject) => {

      const {isValid, updatedFormInputs} = formInputs.reduce<{
        isValid: boolean,
        updatedFormInputs: IFormInput[],
      }>((accumulator, currentValue, currentIndex) => {
        const inputValue = formData.get(currentValue.name) as string;
        console.log(inputValue)
        //Length
        if(!inputValue?.length){
          accumulator.isValid = false;
          accumulator.updatedFormInputs[currentIndex] = {
            ...currentValue,
            error: true,
            errorMsg: "Required Field"
          }
        } else if(currentValue?.validators?.length){
          for(const validator of currentValue.validators) {
            if(!validator.regex.test(inputValue)) {
              accumulator.isValid = false;
              accumulator.updatedFormInputs[currentIndex] = {
                ...currentValue,
                error: true,
                errorMsg: validator.msg
              }
            }
          }
        } else if(currentValue?.exceptions?.length) {
          for(const exception of currentValue.exceptions){
            if(exception.regex.test(inputValue)) {
              accumulator.isValid = false;
              accumulator.updatedFormInputs[currentIndex] = {
                ...currentValue,
                error: true,
                errorMsg: exception.msg
              }
            }
          }
        } else {
          accumulator.updatedFormInputs[currentIndex] = {
            ...currentValue,
            error: false,
            errorMsg: ""
          }
        }
        return accumulator;
      }, { 
        isValid: true,
        updatedFormInputs: [...formInputs],
      });
      
      setFormInputs(updatedFormInputs);

      if(isValid) {
        return resolve({
          firstName: formData.get("firstName") as string,
          lastName: formData.get("lastName") as string,
          userName: formData.get("userName") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        }) 
      }
      
      return reject(new Error("Invalid Form Fields"));
    })
  }

  const addException = (inputName: string, exception: {
    regex: RegExp,
    msg: string,
  }) => {
    setFormInputs(prevInputs => {
      return prevInputs.map(input => {
        if(input.name === inputName) {
          if(input.exceptions?.length){
            return {...input, error: true, errorMsg: exception.msg, exceptions: [...input.exceptions, exception]};
          } else {
            return {...input, error: true, errorMsg: exception.msg, exceptions: [exception]};
          }
        }
        return input;
      });
    });
  }

  const removeException = (inputName: string, targetException: {
    regex: RegExp,
    msg: string,
  }) => {
    setFormInputs(prevInputs => {
      return prevInputs.map(input => {
        if(input.name === inputName && input.exceptions?.length) {
          const updatedExceptions = input.exceptions.filter(exception => 
            exception.msg !== targetException.msg ||
            exception.regex.source !== targetException.regex.source
          );
          return {...input, exceptions: updatedExceptions};
        }
        return input;
      });
    });
  }
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    validateInputs(formData)
    .then((jsonData: IRegisterFormData) => {
      setAuthProcessing(true);
      return fetch(`/api/perform_register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      })
      .then(response => {
        console.log(response);
        if(response?.status === 201) {
          toast.success("Successfull Register");
          return setCurrentForm();
        } else if (response?.status === 409) {
          const conflictTarget = "userName";
          const conflictValue = jsonData.userName;
          const conflictMessage = "Username Unavailable";
          addException(conflictTarget, {
            regex: RegExp(`^${conflictValue}$`),
            msg: conflictMessage
          });
          toast.error("Username Unavailable");
        }
        throw new Error("Error: " + response);
      })
    })
    .catch((e) => {
      toast.error("Failed Register");
      console.log(e);
    })
    .finally(() => {
      setAuthProcessing(false);
    })
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
        Register
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        {formInputs?.length && formInputs?.map((formInput, index) => {
          return (
            <TextField
              key={`FormInput:Login:${index}`}
              margin="normal"
              required
              fullWidth
              id={formInput.name}
              label={formInput.label}
              name={formInput.name}
              error={formInput.error}
              helperText={formInput.errorMsg}
            />
          )
        })}
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          loading={authProcessing}
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </LoadingButton>
      </Box>
    </Box>
  );
}

export default React.memo(Register);
