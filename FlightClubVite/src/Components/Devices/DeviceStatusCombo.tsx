
import { useRef } from 'react';
import { DEVICE_STATUS } from '../../Interfaces/API/IDevice'
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, { InputComboItem, StateComboProps } from '../Buttons/ControledCombo';

function DeviceStatusCombo(props : StateComboProps) {
  const {onChanged,selectedItem} = props 
  const items = useRef(new Enum2ComboItem(DEVICE_STATUS).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    console.log("DeviceStatusCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={items.current} /* handleComboChange={handleDeviceOnChange} */ title={`Device Status`} />
  )
}

export default DeviceStatusCombo