
import { useRef } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import {  DEVICE_MT } from '../../Interfaces/API/IDevice'
import { Enum2ComboItem } from '../../Utils/enums';
import ControledCombo, { ComboProps, InputComboItem, StateComboProps } from '../Buttons/ControledCombo';

function DeviceMTCombo(props : StateComboProps) {
  const {onChanged,selectedItem} = props
  const items = useRef(new Enum2ComboItem(DEVICE_MT).getItems())
  const onSelectedItem = (item : InputComboItem) => {
    
    console.log("DeviceMTCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem}  items={items.current}  title={`Service Type`} />
    
  )
}

export default DeviceMTCombo