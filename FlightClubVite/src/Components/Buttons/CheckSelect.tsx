import { CheckBox } from '@mui/icons-material';
import { Box, Checkbox, Chip, FormControl, InputLabel, ListItemText, MenuItem, Input, OutlinedInput, Select, SelectChangeEvent, TextField, Theme, useTheme } from '@mui/material'
import { style } from '@mui/system';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { InputComboItem } from './ControledCombo';
import { LabelType } from './MultiOptionCombo';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
export type CheckSelectProps = {
  selectedItems: LabelType[];
  onSelected: (items: LabelType[], property: string) => void;
  items: LabelType[];
  label: string;
  property: string;
}

function CheckSelect({ items, label, selectedItems, onSelected, property }: CheckSelectProps) {
  const theme = useTheme();
  const [item, setItem] = useState<LabelType[]>(selectedItems)


  /*   function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
      console.log("handleOnChange", event.target.value as string);
      const newValue = event.target.value as T;
      setItem((prev: T[]) => ({ ...prev, newValue }))
      handlerChange(event.target.value as T, property)
    } */
  const handleChange = (event: SelectChangeEvent<typeof items>) => {
    const { target: { value }, } = event;
    console.log("CheckSelect/handleOnChange/value", event.target.value);

    const newValue = items.find((i) => event.target.value == i.name);
    console.log("CheckSelect/handleOnChange/newValue", newValue);
    console.log("CheckSelect/handleOnChange", event.target.value as string, newValue, items);
    setItem((prev: LabelType[]) => ({ ...prev, newValue }))
    onSelected(event.target.value as LabelType[], property)
  };
  function getStyles(name: LabelType, personName: readonly LabelType[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const handleRoleChange = (event: any) => {
    const { value } = event.target;
    setSelectedRoleIds(value);
    const selected = items.filter((i) => value.includes(i.name) );
    console.log("handleRoleChange/selected", value,items,selected)
    console.log("handleRoleChange/selected", selected)
    onSelected(selected, property)

  };
  useEffect(() => {
    if (selectedItems) {
      setSelectedRoleIds(selectedItems.map((i: any) => i.name));
    }

  }, [selectedItems]);
  return (
    <>

      <FormControl fullWidth>
        <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
        <Select
          multiple
          fullWidth
          value={selectedRoleIds}
          onChange={handleRoleChange}
          variant={"standard"}
          input={<Input id="select-multiple-chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((roleId) => (
                <Chip key={roleId} label={items === undefined ? "" : items?.find(e => e.name === roleId) === undefined ? "" : items?.find(e => e.name === roleId) ? roleId : ""} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {items.map((role) => (
            <MenuItem key={role._id} value={role.name}>
              <Checkbox checked={selectedRoleIds.includes(role.name)} />
              <ListItemText primary={role.name} color={role.color}/>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}

export default CheckSelect