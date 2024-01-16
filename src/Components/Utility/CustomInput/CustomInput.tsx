//Deps
import React, { ChangeEvent } from "react";

//MUI
import { Box, InputLabel, Input, Checkbox, TextField  } from "@mui/material";

//Props
interface ICustonInputProps {
  title: string;
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  value?: string;
  children?: React.ReactNode;
  optional?: boolean;
}

const CustonInput: React.FC<ICustonInputProps> = ({
  title,
  setValue,
  value,
  optional,
}): JSX.Element => {
  const [checked, setChecked] = React.useState(!!value?.length);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(optional){
      if(!event.target.checked) setValue(undefined);
      setChecked(event.target.checked);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e?.currentTarget?.value);
  }

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
          value={value || ""}
          onChange={handleChange}
          
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
