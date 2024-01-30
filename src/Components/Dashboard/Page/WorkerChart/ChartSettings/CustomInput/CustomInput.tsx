//Deps
import React from "react";

//MUI
import { Box, InputLabel, Checkbox, TextField  } from "@mui/material";

//Props
import { IChartDetails } from "../../../../../../Context/DashboardContext/interfaces";
interface ICustonInputProps {
  title: string;
  setValue: <K extends keyof IChartDetails>(key: K, value: IChartDetails[K]) => void;
  valueKey: keyof IChartDetails;
  value?: string;
  children?: React.ReactNode;
  optional?: boolean;
}

const CustonInput: React.FC<ICustonInputProps> = ({
  title,
  setValue,
  valueKey,
  value,
  optional,
}): JSX.Element => {
  //State
  const [checked, setChecked] = React.useState(!!value?.length);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(optional){
      if(!event.target.checked) setValue(valueKey, undefined);
      setChecked(event.target.checked);
    }
  };

  //Update Parent Value on Blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(valueKey, e.target.value);
  }

  //Overwrite Default
  React.useEffect(() => {
    if(!checked && !!value?.length) setChecked(true);
  }, [value])

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{
        display: "flex",
        alignItems:"center"
      }}>
        <InputLabel htmlFor={`custom-input-${title}`}>{title}</InputLabel>
        {optional && <Checkbox 
          checked={checked}
          onChange={handleToggle}
          inputProps={{ 'aria-label': 'controlled' }} 

        />}
      </Box>
      {
        (checked || !optional) && (
        <TextField
          id={`custom-input-${title}`}
          placeholder="Type in here…" 
          multiline
          defaultValue={value}
          onBlur={handleBlur}
          sx={{
            textAlign: "center",
            width: "100%",
            marginBottom: "20px",
          }}
        />
        )
      }
      
    </Box>
  );
};

export default React.memo(CustonInput);
