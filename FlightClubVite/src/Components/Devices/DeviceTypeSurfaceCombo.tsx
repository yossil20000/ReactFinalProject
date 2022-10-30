
import { useEffect, useState,useId } from 'react'
import { useFetchAllDevicesQuery } from '../../features/Device/deviceApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import IDevice, { DEVICE_MET, DEVICE_STATUS } from '../../Interfaces/API/IDevice'
import { EngienType, SurfaceType } from '../../Interfaces/API/IDeviceType';
import InputCombo, { InputComboItem } from '../Buttons/InputCombo'

interface ComboProps {
  onChanged: (item: InputComboItem) => void;
}
const getInputItems= () => {
  const items : InputComboItem[] = Object.keys(SurfaceType).filter((v) => isNaN(Number(v))).
  map((name) => {
    return {
      _id: SurfaceType[name as keyof typeof SurfaceType].toString(),
      description: "",
      lable: name
    }
  })
  console.log("DeviceTypeSurfaceCombo/items",items)
  return items;
}
function DeviceTypeSurfaceCombo(props : ComboProps) {
  const {onChanged} = props
  const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>();
  
  const onSelectedItem = (item : InputComboItem) => {
    setSelectedItem(item);
    console.log("DeviceTypeSurfaceCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <InputCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem}  items={getInputItems()} /* handleComboChange={handleDeviceOnChange} */ title={`Surface Type`} />
  )
}

export default DeviceTypeSurfaceCombo