
import { useState } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage';
import { DEVICE_STATUS } from '../../Interfaces/API/IDevice'
import ControledCombo, { ComboProps } from '../Buttons/ControledCombo';
import { InputComboItem } from '../Buttons/InputCombo'


const getInputItems= () => {
  const items : InputComboItem[] = Object.keys(DEVICE_STATUS).filter((v) => isNaN(Number(v))).
  map((name) => {
    return {
      _id: DEVICE_STATUS[name as keyof typeof DEVICE_STATUS].toString(),
      description: "",
      lable: name
    }
  })
  console.log("DeviceStatusCombo/items",items)
  return items;
}
function DeviceStatusCombo(props : ComboProps) {
  const {onChanged} = props
  const [selectedItem, setSelectedItem] = useLocalStorage<InputComboItem | undefined>("admin_device_status",undefined);
  
  const onSelectedItem = (item : InputComboItem) => {
    setSelectedItem(item);
    console.log("DeviceStatusCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem === undefined ? null : selectedItem} items={getInputItems()} /* handleComboChange={handleDeviceOnChange} */ title={`Device Status`} />
  )
}

export default DeviceStatusCombo