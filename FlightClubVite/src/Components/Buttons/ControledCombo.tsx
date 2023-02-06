import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';

export interface ComboProps {
  onChanged: (item: InputComboItem) => void;
  source: string;
  selectedItem?: InputComboItem;
  filter?: any;
  title?: string;
}
export interface StateComboProps {
  onChanged: (item: InputComboItem) => void;
  source: string;
  selectedItem: InputComboItem
}

export interface InputComboItem{
  _id: string;
  lable: string;
  description: string;
}
export const newInputComboItem : InputComboItem = {
  _id: '',
  lable: '',
  description: ''
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
      fullWidth={true}
      value={value}
      onChange={(event: any, newValue: InputComboItem | null) => {
        console.log("ControledCombo/onChange", newValue)

        setValue(newValue);
        
          onSelectedItem(newValue ?? {_id: "",lable:""} as InputComboItem)
      }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);

        }}
        id="controllable-states-demo"
        options={items}
        getOptionLabel={option => `${(option as InputComboItem).lable}`}
        
        renderInput={(params) => <TextField {...params}  label={title} variant="standard" />}
      />
  );
}
