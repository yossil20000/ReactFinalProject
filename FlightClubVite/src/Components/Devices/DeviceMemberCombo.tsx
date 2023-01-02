import { useEffect, useState,useId } from 'react'
import { useFetchDevicCanReservQuery, useFetchDevicsComboQuery } from '../../features/Device/deviceApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import { IDeviceCanReserve, IDeviceCombo, IDeviceComboFilter } from '../../Interfaces/API/IDevice'
import { IMemberCombo } from '../../Interfaces/API/IMember';
import { Status } from '../../Interfaces/API/IStatus';
import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';
interface ComboPropsEx extends ComboProps {
  selectedDepended : InputComboItem
}
function DeviceMemberCombo(props : ComboPropsEx) {
  const {onChanged,source,filter ,selectedDepended} = props
  const { data, isError, isLoading, error } = useFetchDevicCanReservQuery(selectedDepended._id);
  
  const [deviceCanreservItems,setDeviceCanreservItems] = useState<InputComboItem[]>([]);
  const [selectedDeviceCanreserv, setSelectedDeviceCanreserv] = useLocalStorage<InputComboItem | undefined>(`_${source}/DeviceCanreserv`,undefined);
  
  console.log("DeviceMemberCombo/selectedDevice" , selectedDepended)
  useEffect(() => {
    console.log("DeviceMemberCombo/ Devices.data", data?.data)
    let items : InputComboItem[] = []
    data?.data.map((item) => item.can_reservs.map((can_reserv) =>  ( items.push(({  lable: `${can_reserv.family_name} ${can_reserv.member_id}`, _id: can_reserv._id ,description: ""}) as InputComboItem))));
    /* let items  =   devicesToItemCombo(data?.data[0] === undefined ? [] : data?.data[0]); */
    console.log("DeviceMemberCombo/ DeviceItem", items)
    if (items !== undefined)
    setDeviceCanreservItems(items);
    if(isError){
        console.log("DeviceMemberCombo/error", error)
    }
  }, [data?.data,isError])
 useEffect(() => {
  setSelectedDeviceCanreserv({  
    _id: "",
    lable: "",
    description: ""} as InputComboItem)
 },[selectedDepended])
  useEffect(()=> {
    if(selectedDeviceCanreserv)
      onChanged(selectedDeviceCanreserv)
  },[])
  const onSelectedItem = (item : InputComboItem) => {
    setSelectedDeviceCanreserv(item);
    console.log("DeviceMemberCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem}  selectedItem={selectedDeviceCanreserv === undefined ? null : selectedDeviceCanreserv}  items={deviceCanreservItems} /* handleComboChange={handleDeviceOnChange} */ title="Members" />
  )
}

export default DeviceMemberCombo