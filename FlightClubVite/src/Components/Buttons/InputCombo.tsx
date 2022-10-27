import { Autocomplete, TextField } from '@mui/material'

export interface InputComboItem{
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
function InputCombo(props: InputComboProps) {

  console.log("InputCombo/props", props)
  const {items,title,selectedItem ,  onSelectedItem} = props;
  
  
  const handleSelectedItemChanged = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    event.preventDefault;
    event.stopPropagation;
    console.log("InputCombo/handleSelectedItemChanged", newValue)
    onSelectedItem(newValue)
    
    /* handleComboChange(event,newValue); */
  }
  return (
    <Autocomplete
 defaultValue={defaultValue}
              freeSolo
              id="free-solo-2-demo"
              disableClearable
              options={items}
              getOptionLabel={option => `${(option as InputComboItem).lable}`}
              value={selectedItem} 
              onChange={handleSelectedItemChanged}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ width: "100%", height:"100%", label: { color: "#2196f3" }, ml: { sm: 1 }, }}
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