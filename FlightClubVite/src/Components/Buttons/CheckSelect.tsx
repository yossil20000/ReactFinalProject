import { Box, Checkbox, Chip, FormControl, InputLabel, ListItemText, MenuItem, Input, Select, SelectChangeEvent, Theme, useTheme } from '@mui/material'
import { useEffect, useState } from 'react';
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
 
  function getStyles(name: LabelType, personName: readonly LabelType[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleProperyChange = (event: any) => {
    const { value } = event.target;

    const selected = items.filter((i) => value.includes(i.name) );
    console.log("handleProperyChange/selected", value,items,selected)
    console.log("handleProperyChange/selected", selected)
    onSelected(selected, property)
    setSelectedOptions(value);
  };
  useEffect(() => {
    if (selectedItems) {
      setSelectedOptions(selectedItems.map((i: any) => i.name));
    }

  }, [selectedItems]);
  return (
    <>

      <FormControl fullWidth>
        <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
        <Select
          multiple
          fullWidth
          value={selectedOptions}
          onChange={handleProperyChange}
          variant={"standard"}
          input={<Input id="select-multiple-chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((property) => (
                <Chip key={property} label={items === undefined ? "" : items?.find(e => e.name === property) === undefined ? "" : items?.find(e => e.name === property) ? property : ""} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {items.map((property) => (
            <MenuItem key={property._id} value={property.name}>
              <Checkbox checked={selectedOptions.includes(property.name)} />
              <ListItemText primary={property.name} color={property.color}/>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}

export default CheckSelect