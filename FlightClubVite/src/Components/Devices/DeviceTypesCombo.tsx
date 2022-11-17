
import { useEffect, useState,useId } from 'react'
import { useFetchAllDeviceTypesQuery } from '../../features/DeviceTypes/deviceTypesApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import IDeviceType from '../../Interfaces/API/IDeviceType';
import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';



function DeviceTypesCombo(props : ComboProps) {
 
  const {onChanged,source} = props
  const { data, isError, isLoading, error } = useFetchAllDeviceTypesQuery();
  
  const [devicesItems,setDevicesItem] = useState<InputComboItem[]>([]);
  const [selectedDevice, setSelectedDevice] = useLocalStorage<InputComboItem | undefined>(`_${source}/DeviceTypes}`,undefined);
  function getDeviceDetailed(_id: string | undefined) : string {
    console.log("getDeviceDetailed", _id)
    if(_id === undefined)
      return "";
     const device : IDeviceType | undefined = data?.data?.find((i) => i._id == _id);
     if(device)
     {
      console.log("getDeviceTypeDetailed/dvice",device)
      return `engien_meter: ${device.category} next_meter: ${device.name}`
     }
      
     return "";
  }
  const devicesToItemCombo = (input: IDeviceType): InputComboItem => {
    return {  lable: input.name, _id: input._id,description: getDeviceDetailed(input._id) }
  }
  console.log("DeviceTypesCombo/selectedDevice" , selectedDevice)
  useEffect(() => {
    console.log("DeviceTypesCombo/ Devices.data", data?.data)
    
    let items  =   data?.data.map((item) => devicesToItemCombo(item));
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