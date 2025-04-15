import { MenuItem, TextField } from '@mui/material'
import { useState } from 'react';

export type MUISelectProps<T> = {
  data: T[];
  label: string;
  value: T;
  handlerChange: (value: T, propert: string) => void;
  property: string;
}
function MUISelect<T extends string>({ data, label, value, handlerChange ,property}: MUISelectProps<T>) {
 const [item,setItem] = useState<T>(value)

 
  function handleOnChange(event : React.ChangeEvent<HTMLInputElement>) {
    CustomLogger.log("handleOnChange", event.target.value as string);
    setItem(event.target.value as T)
    handlerChange(event.target.value as T,property)
  }
  return (
    <TextField variant="standard" label={label} select fullWidth value={item}  onChange={handleOnChange}>
      {

        data.map(key => (

          <MenuItem key={key.toString()} value={key.toString()}>{key.toString()}</MenuItem>
        ))

      }
    </TextField>
  )
}

export default MUISelect