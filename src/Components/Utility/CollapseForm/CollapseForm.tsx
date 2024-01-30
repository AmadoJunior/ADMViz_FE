//Deps
import React from "react";

//MUI
import {Box, Button, Input, Collapse } from "@mui/material";

//MUI LAB
import { LoadingButton } from '@mui/lab';

//Components

//Props
interface ForwardedState {
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>
}
interface ICollapseFormProps {
  children?: React.ReactNode;
  formName: string,
  inputState: ForwardedState;
  disabled?: boolean,
  submitHandler: (handlerInput: string) => Promise<void>
}

const CollapseForm = ({formName, inputState, disabled, submitHandler}: ICollapseFormProps): JSX.Element => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    inputState.setValue(e.target.value)
  }

  const handleSubmit = (handlerInput: string) => {
    setIsLoading(true);
    submitHandler(handlerInput)
    .finally(() => {
      inputState.setValue("");
      setIsLoading(false);
      setIsOpen(false);
    })
  }

  return (
    <Box sx={{
      display: "flex",
      alignItems: 'center',
      justifyContent: 'center',
      paddingX: "10px"
    }}>
      <Collapse orientation="horizontal"  in={isOpen}>
          <Box sx={{
            display: "flex"
          }}>
            <Input placeholder="Dashboard Name" disabled={isLoading || disabled} sx={{
              width: "250px"
            }} value={inputState.value} onChange={handleInput}></Input>
            <LoadingButton variant="outlined" size="small" loading={isLoading} disabled={disabled} sx={{
              marginLeft: "15px"
            }} onClick={() => handleSubmit(inputState.value)}>Apply</LoadingButton>
            <Button variant="outlined" size="small" color="error" disabled={isLoading} sx={{
              marginLeft: "10px"
            }} onClick={() => setIsOpen(false)}>Cancel</Button>
          </Box>
      </Collapse>
      <Collapse orientation="horizontal"  in={!isOpen}>
        <Box sx={{
            display: "flex",
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            
          <Button variant="outlined" disabled={disabled} size="small" sx={{
          minHeight: "30.75px" //Fixed Height for Collapse Bug
          }} onClick={() => setIsOpen(prev => !prev)}>{formName}</Button>
        </Box>
      </Collapse>
    </Box>
  );
}

export default React.memo(CollapseForm);
