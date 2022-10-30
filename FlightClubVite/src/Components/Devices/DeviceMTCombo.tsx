
import {  useState } from 'react'
import {  DEVICE_MT } from '../../Interfaces/API/IDevice'
import InputCombo, { InputComboItem } from '../Buttons/InputCombo'

interface ComboProps {
  onChanged: (item: InputComboItem) => void;
}
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
  const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>();
  
  const onSelectedItem = (item : InputComboItem) => {
    setSelectedItem(item);
    console.log("DeviceMTCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <InputCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem}  items={getInputItems()} /* handleComboChange={handleDeviceOnChange} */ title={`Service Type`} />
  )
}

export default DeviceMTCombo