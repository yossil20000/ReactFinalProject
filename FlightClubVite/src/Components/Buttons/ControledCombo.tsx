import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';
import { MemberType } from '../../Interfaces/API/IMember';

export interface ComboProps {
  onChanged: (item: InputComboItem) => void;
  source: string;
  selectedItem?: InputComboItem;
  filter?: any;
  title?: any;
}
export interface IClubAccountProps extends ComboProps {
  onChanged: (item: InputComboItem) => void;
  source: string;
  selectedItem?: InputComboItem;
  filter?: any;
  title?: any;
  includesType: MemberType[];
}

export interface SelectComboProps extends ComboProps {
  selectedKey : string | undefined,
  selectedValue: string 
}
export interface StateComboProps {
  onChanged: (item: InputComboItem) => void;
  source: string;
  selectedItem: InputComboItem;
  disable?: boolean;
}

export interface InputComboItem{
  _id: string;
  label: string;
  description: string;
  key?: string;
  key2?: string;
  validation?: number;
  
}
export const newInputComboItem : InputComboItem = {
  _id: '',
  label: '',
  description: '',
  key: "",
  key2: "",
}
export interface InputComboProps{
  items: InputComboItem[];
  title: string;
  selectedItem: InputComboItem | null | "";
  onSelectedItem: (item : InputComboItem) => void;
  disable?: boolean
}

export default function ControledCombo(props: InputComboProps) {
  const {items,title,selectedItem ,  onSelectedItem,disable=false} = props;
  const [value, setValue] = useState<InputComboItem | null>(null);
  const [inputValue, setInputValue] = useState('');
  useEffect(()=> {
    CustomLogger.log("ControledCombo/useEffect", selectedItem)
    if(selectedItem !== undefined )
    setValue((selectedItem as InputComboItem))
  },[selectedItem])
  const customFilterOptions = (options: InputComboItem[], params: any) => {
    const filtered = options.filter((option) => {
      return option.description.toLowerCase().includes(params.inputValue.toLowerCase()) || option.label.toLowerCase().includes(params.inputValue.toLowerCase());
    });
    return filtered;
  }
  return (
<Autocomplete
      fullWidth={true}
      value={value}
      filterOptions={customFilterOptions}
      onChange={(event: any, newValue: InputComboItem | null) => {
        CustomLogger.info("ControledCombo/onChange", newValue)

        setValue(newValue);
        
          onSelectedItem(newValue ?? {_id: "",label:""} as InputComboItem)
      }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);

        }}
        id="controllable-states-demo"
        options={items}
        getOptionLabel={option => `${(option as InputComboItem).label}`}
        disabled={disable}
        renderInput={(params) => <TextField {...params}  label={title} variant="standard" />}
      />
  );
}
