
import { useEffect, useState,useId } from 'react'
import { useFetchAllDevicesQuery } from '../../features/Device/deviceApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import IDevice, { DEVICE_MET, DEVICE_STATUS } from '../../Interfaces/API/IDevice'
import { EngienType } from '../../Interfaces/API/IDeviceType';
import InputCombo, { InputComboItem } from '../Buttons/InputCombo'

interface ComboProps {
  onChanged: (item: InputComboItem) => void;
}
const getInputItems= () => {
  const items : InputComboItem[] = Object.keys(EngienType).filter((v) => isNaN(Number(v))).
  map((name) => {
    return {
      _id: EngienType[name as keyof typeof EngienType].toString(),
      description: "",
      lable: name
    }
  })
  console.log("DeviceTypeEngienCombo/items",items)
  return items;
}
function DeviceTypeEngienCombo(props : ComboProps) {
  const {onChanged} = props
  const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>();
  
  const onSelectedItem = (item : InputComboItem) => {
    setSelectedItem(item);
    console.log("DeviceTypeEngienCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <InputCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem}  items={getInputItems()} /* handleComboChange={handleDeviceOnChange} */ title={`Engien Type`} />
  )
}

export default DeviceTypeEngienCombo