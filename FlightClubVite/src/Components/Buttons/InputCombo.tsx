import { Autocomplete, TextField } from '@mui/material'
import { useState } from 'react';
export interface InputComboItem{
  _id: string;
  lable: string;
}
export interface InputComboProps {
  items: InputComboItem[];
  title: string;
  handleComboChange(event: any, newValue: any) : void ;
}
function InputCombo(props: InputComboProps) {
  const {items,title,handleComboChange} = props;
  const [selectedItem,setSelectedItem] = useState<InputComboItem>();
  
  const handleSelectedItemChanged = (event: any, newValue: any) => {
    setSelectedItem(newValue);
    handleComboChange(event,newValue);
  }
  return (
    <Autocomplete
              freeSolo
              id="free-solo-2-demo"
              disableClearable
              options={items}
              getOptionLabel={option => `${(option as InputComboItem)._id} ${(option as InputComboItem).lable}`}
              value={selectedItem} 
              onChange={handleSelectedItemChanged}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ width: "100%", label: { color: "#2196f3" }, ml: { sm: 1 }, }}
                  size={'small'}
                  label={title}
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                />
              )}
            />
  )
}

export default InputCombo