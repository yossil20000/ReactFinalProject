
import { useEffect, useState,useId } from 'react'
import { useFetchAllDevicesQuery } from '../../features/Device/deviceApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import IDevice, { DEVICE_MET, DEVICE_STATUS } from '../../Interfaces/API/IDevice'
import InputCombo, { InputComboItem } from '../Buttons/InputCombo'

interface ComboProps {
  onChanged: (item: InputComboItem) => void;
}
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
  const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>();
  
  const onSelectedItem = (item : InputComboItem) => {
    setSelectedItem(item);
    console.log("DeviceStatusCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <InputCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem}  items={getInputItems()} /* handleComboChange={handleDeviceOnChange} */ title={`Device Status`} />
  )
}

export default DeviceStatusCombo