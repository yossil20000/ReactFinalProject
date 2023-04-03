import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react';
interface ComboProps {
  onChanged: (item: InputComboItem) => void;
}
interface InputComboItem{
  _id: string;
  lable: string;
  description: string;
}
const defaultValue: InputComboItem = {
  _id: '',
  lable: '',
  description: ""
}
export interface InputComboProps{
  items: InputComboItem[];
  title: string;
  selectedItem: InputComboItem | undefined | "";
  /* setSelectedItem: (value: React.SetStateAction<InputComboItem | undefined>) => void; */ 
  onSelectedItem: (item : InputComboItem) => void;
  /* handleComboChange(event: any, newValue: any) : void ; */
}
function InputComboObsulute(props: InputComboProps) {

  CustomLogger.log("InputCombo/props", props)
  const {items,title,selectedItem ,  onSelectedItem} = props;
  const [selected,setSelected] = useState<InputComboItem>()
  
  const handleSelectedItemChanged = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    event.preventDefault;
    event.stopPropagation;
    CustomLogger.log("InputCombo/handleSelectedItemChanged", newValue)
    setSelected(newValue)
    onSelectedItem(newValue)
  }
  useEffect(()=> {
    CustomLogger.log("InputCombo/useEffect", selectedItem)
    if(selectedItem !== undefined )
    setSelected(selectedItem as InputComboItem)
  },[selectedItem])
  return (
    <Autocomplete
              freeSolo
              id="free-solo-2-demo"
              disableClearable
              options={items}
              getOptionLabel={option => `${(option as InputComboItem).lable}`}
              value={selected}
              onChange={handleSelectedItemChanged}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ width: "100%", height:"100%", label: { color: "#2196f3" }, ml: 0, }}
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

export default InputComboObsulute