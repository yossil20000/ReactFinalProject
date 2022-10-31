
import {  useState } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage';
import {  DEVICE_MT } from '../../Interfaces/API/IDevice'
import ControledCombo, { ComboProps } from '../Buttons/ControledCombo';
import { InputComboItem } from '../Buttons/InputCombo'


const getInputItems= () => {
  const items : InputComboItem[] = Object.keys(DEVICE_MT).filter((v) => isNaN(Number(v))).
  map((name) => {
    return {
      _id: DEVICE_MT[name as keyof typeof DEVICE_MT].toString(),
      description: "",
      lable: name
    }
  })
  console.log("DeviceMTCombo/items",items)
  return items;
}
function DeviceMTCombo(props : ComboProps) {
  const {onChanged} = props
  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>("admin_service_type",undefined);
  
  const onSelectedItem = (item : InputComboItem) => {
    setSelectedItem(item);
    console.log("DeviceMTCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem}  items={getInputItems()}  title={`Service Type`} />
    
  )
}

export default DeviceMTCombo