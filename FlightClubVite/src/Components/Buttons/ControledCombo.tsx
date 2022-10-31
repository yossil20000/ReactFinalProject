import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';

export interface ComboProps {
  onChanged: (item: InputComboItem) => void;
}
export interface InputComboItem{
  _id: string;
  lable: string;
  description: string;
}

export interface InputComboProps{
  items: InputComboItem[];
  title: string;
  selectedItem: InputComboItem | null | "";
  onSelectedItem: (item : InputComboItem) => void;
}

export default function ControledCombo(props: InputComboProps) {
  const {items,title,selectedItem ,  onSelectedItem} = props;
  const [value, setValue] = useState<InputComboItem | null>(null);
  const [inputValue, setInputValue] = useState('');
  useEffect(()=> {
    console.log("ControledCombo/useEffect", selectedItem)
    if(selectedItem !== undefined )
    setValue((selectedItem as InputComboItem))
  },[selectedItem])
  return (
<Autocomplete
      
      value={value}
      onChange={(event: any, newValue: InputComboItem | null) => {
        setValue(newValue);
        if(newValue)
          onSelectedItem(newValue)
      }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);

        }}
        id="controllable-states-demo"
        options={items}
        getOptionLabel={option => `${(option as InputComboItem).lable}`}
        
        renderInput={(params) => <TextField {...params} label={title} />}
      />
  );
}