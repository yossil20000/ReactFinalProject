import { useRef } from 'react';
import { FuelUnits } from '../../Types/FuelUnits';
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, { InputComboItem, StateComboProps } from '../Buttons/ControledCombo';


function DeviceFuelUnitCombo(props : StateComboProps) {
  const {onChanged,source,selectedItem} = props
  const items = useRef(new Enum2ComboItem(FuelUnits).getItems())
 
  const onSelectedItem = (item : InputComboItem) => {
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem}  items={items.current} title={`Fuel Units`} />
  )
}

export default DeviceFuelUnitCombo