import { iteratorSymbol } from 'immer/dist/internal';
import { useEffect, useState,useId } from 'react'
import { useFetchAllDeviceTypesQuery } from '../../features/DeviceTypes/deviceTypesApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import IDeviceType from '../../Interfaces/API/IDeviceType';
import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';

export  const deviceTypeToItemCombo = (input: IDeviceType | any): InputComboItem => {
  console.log("DeviceTypesCombo/deviceTypeToItemCombo", input)
  return {  lable: input?.name, _id: input?._id,description: input?.name } as InputComboItem
}

function DeviceTypesCombo(props : ComboProps) {
  const {onChanged,source,selectedItem} = props
  const { data, isError, isLoading, error } = useFetchAllDeviceTypesQuery();
  
  const [devicesItems,setDevicesItem] = useState<InputComboItem[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<InputComboItem | undefined>(undefined);
  
useEffect(() => {
  const found = devicesItems.find((item) => item._id === selectedItem?._id)
  if(found !== undefined)
    setSelectedDevice(found)
},[selectedItem])
  console.log("DeviceTypesCombo/selectedDevice" , selectedDevice)
  useEffect(() => {
    console.log("DeviceTypesCombo/ Devices.data", data?.data)
    
    let items  =   data?.data.map((item : IDeviceType) => deviceTypeToItemCombo(item));
    console.log("DeviceTypesCombo/useEffect", items)
    if (items !== undefined){
      
      setDevicesItem(items);
/*       if(items.length > 0){
        setSelectedDevice(items?.at(0))
      } */
    }
    

      if(isError){
        console.log("DeviceTypesCombo/error", error)
      }
  }, [data?.data,isError])

  const onSelectedItem = (item : InputComboItem) => {
    setSelectedDevice(item);
    console.log("DeviceTypesCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedDevice === undefined ? null : selectedDevice}  items={devicesItems} /* handleComboChange={handleDeviceOnChange} */ title="Device Types" />
  )
}

export default DeviceTypesCombo