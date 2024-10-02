import { useEffect, useState } from 'react'
import { useFetchDevicCanReservQuery } from '../../features/Device/deviceApiSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';
import { useAppSelector } from '../../app/hooks';
interface ComboPropsEx extends ComboProps {
  selectedDepended: InputComboItem;
  title?: string;
  getAllItems?(members: InputComboItem[]): void;
  requestItems?: boolean;
}
function DeviceMemberCombo(props: ComboPropsEx) {
  const login = useAppSelector((state) => state.authSlice);
  const { requestItems = false, getAllItems, onChanged, source, filter, selectedDepended, title = "Select Member",selectedItem } = props
  const { data, isError, isLoading, error } = useFetchDevicCanReservQuery(selectedDepended._id);

  const [deviceCanreservItems, setDeviceCanreservItems] = useState<InputComboItem[]>([]);
  const [selectedDeviceCanreserv, setSelectedDeviceCanreserv] = useLocalStorage<InputComboItem | undefined>(`_${source}/DeviceCanreserv`, undefined);

  CustomLogger.log("DeviceMemberCombo/selectedDevice", selectedDepended)
  useEffect(() => {
    CustomLogger.log("DeviceMemberCombo/ Devices.data", data?.data)
    let items: InputComboItem[] = []
    data?.data.map((item) => item.can_reservs.filter((i) => filter.showAllMemebers ? true : i._id == login.member._id).map((can_reserv) => (items.push(({ lable: `${can_reserv.family_name}.${can_reserv.first_name.at(0)} ${can_reserv.member_id}`, _id: can_reserv._id, description: "" }) as InputComboItem))));
    /* let items  =   devicesToItemCombo(data?.data[0] === undefined ? [] : data?.data[0]); */
    CustomLogger.info("DeviceMemberCombo/ DeviceItem", items)
    if (items !== undefined)
    {
      setDeviceCanreservItems(items);
      
    }
    if (isError) {
      CustomLogger.error("DeviceMemberCombo/error", error)
    }
  }, [data?.data, isError,filter])
  useEffect(() => {
    if(!selectedDeviceCanreserv?._id)
      setSelectedDeviceCanreserv(deviceCanreservItems[0])
  }, [deviceCanreservItems])

  useEffect(() => {
    if(selectedItem)
    onSelectedItem(selectedItem)
    if (selectedDeviceCanreserv)
      onChanged(selectedDeviceCanreserv)
  }, [selectedItem])

  useEffect(() => {

    if (requestItems && getAllItems !== undefined)
      getAllItems(deviceCanreservItems)
  }, [requestItems])

  const onSelectedItem = (item: InputComboItem) => {
    setSelectedDeviceCanreserv(item);
    CustomLogger.log("DeviceMemberCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <ControledCombo onSelectedItem={onSelectedItem} selectedItem={selectedDeviceCanreserv === undefined ? null : selectedDeviceCanreserv} items={deviceCanreservItems} /* handleComboChange={handleDeviceOnChange} */ title={title} />
  )
}

export default DeviceMemberCombo