
import { useEffect, useState,useId } from 'react'
import { useFetchAllDevicesQuery } from '../../features/Device/deviceApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import IDevice, { DEVICE_MET } from '../../Interfaces/API/IDevice'
import InputCombo, { InputComboItem } from '../Buttons/InputCombo'

interface ComboProps {
  onChanged: (item: InputComboItem) => void;
}
const getInputItems= () => {
  const items : InputComboItem[] = Object.keys(DEVICE_MET).filter((v) => isNaN(Number(v))).
  map((name) => {
    return {
      _id: DEVICE_MET[name as keyof typeof DEVICE_MET].toString(),
      description: "",
      lable: name
    }
  })
  console.log("PriceMeterCombo/items",items)
  return items;
}
function PriceMeterCombo(props : ComboProps) {
  const id = useId();
  const {onChanged} = props
  
  
  
  const [selectedItem, setSelectedItem] = useState<InputComboItem | undefined>();
  
  const onSelectedItem = (item : InputComboItem) => {
    setSelectedItem(item);
    console.log("PriceMeterCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <InputCombo onSelectedItem={onSelectedItem}  selectedItem={selectedItem}  items={getInputItems()} /* handleComboChange={handleDeviceOnChange} */ title="Price Method" />
  )
}

export default PriceMeterCombo