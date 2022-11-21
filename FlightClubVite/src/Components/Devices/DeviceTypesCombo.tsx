import { useEffect, useState,useId } from 'react'
import { useFetchAllDeviceTypesQuery } from '../../features/DeviceTypes/deviceTypesApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import IDeviceType from '../../Interfaces/API/IDeviceType';
import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';

export  const deviceTypeToItemCombo = (input: IDeviceType | any): InputComboItem => {
  return {  lable: input?.name, _id: input?._id,description: input?.name }
}

function DeviceTypesCombo(props : ComboProps) {
  const {onChanged,source,selectedItem} = props
  const { data, isError, isLoading, error } = useFetchAllDeviceTypesQuery();
  
  const [devicesItems,setDevicesItem] = useState<InputComboItem[]>([]);
  const [selectedDevice, setSelectedDevice] = useLocalStorage<InputComboItem | undefined>(`_${source}/DeviceTypes}`,undefined);
  

  console.log("DeviceTypesCombo/selectedDevice" , selectedDevice)
  useEffect(() => {
    console.log("DeviceTypesCombo/ Devices.data", data?.data)
    
    let items  =   data?.data.map((item) => deviceTypeToItemCombo(item));
    console.log("DeviceTypesCombo/ DeviceItem", items)
    if (items !== undefined)
      setDevicesItem(items);
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