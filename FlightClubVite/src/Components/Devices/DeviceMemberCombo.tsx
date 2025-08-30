import { useEffect, useState } from 'react'
import { useFetchDevicCanReservQuery } from '../../features/Device/deviceApiSlice';
import ControledCombo, { ComboProps, InputComboItem } from '../Buttons/ControledCombo';
import { useAppSelector } from '../../app/hooks';
import { Grid, ToggleButton } from '@mui/material';
import { UseIsAuthorized } from '../RequireAuth';
import { IMemberCombo, Role, Status } from '../../Interfaces/API/IMember';

interface ComboPropsEx extends ComboProps {
  device: InputComboItem
  title?: string;
}

type selectedComboItems = {
  selectedDeviceCanreserv: InputComboItem,
  deviceCanreservItems: InputComboItem[],
  isSelection: boolean
}

function DeviceMemberCombo(props: ComboPropsEx) {
  const login = useAppSelector((state) => state.authSlice);
  const isAuthorized = UseIsAuthorized({ roles: [Role.admin] })
  const [showAllMemebers, setShowAllMembers] = useState(false);
  const { onChanged, device, title = "Select Member" } = props
  const { data, isError, isLoading, error } = useFetchDevicCanReservQuery(device._id);

  /* const [deviceCanreservItems, setDeviceCanreservItems] = useState<InputComboItem[]>([]);
  const [selectedDeviceCanreserv, setSelectedDeviceCanreserv] = useSessionStorage<InputComboItem | undefined>(`_${source}/DeviceCanreserv`, undefined); */
  const filterComboMembers = (member: IMemberCombo) : boolean => { 
    
    return member.status === Status.Active && (showAllMemebers || member._id == login.member._id);
  }
  const [selectedComboItems, setSelectedComboItems] = useState<selectedComboItems>(
    {
      selectedDeviceCanreserv: { _id: "", label: "", description: "", key: "", key2: "" },
      deviceCanreservItems: [],
      isSelection: false
    });
  CustomLogger.log("DeviceMemberCombo/selectedDevice", device)
  useEffect(() => {
    CustomLogger.log("DeviceMemberCombo/ Devices.data", data?.data)
    let items: InputComboItem[] = []
    data?.data.map((item) => item.can_reservs.filter(filterComboMembers).map((can_reserv) => (items.push(({ label: `${can_reserv.family_name}.${can_reserv.first_name.at(0)} ${can_reserv.member_id}`, _id: can_reserv._id, description: "" }) as InputComboItem))));
    /* let items  =   devicesToItemCombo(data?.data[0] === undefined ? [] : data?.data[0]); */
    CustomLogger.info("DeviceMemberCombo/ DeviceItem", items)
    if (items !== undefined && items.length > 0) {

      setSelectedComboItems((prev) => ({ ...prev, selectedDeviceCanreserv: items[0], deviceCanreservItems: items }));
      onChanged(items[0])

    }
    if (isError) {
      CustomLogger.error("DeviceMemberCombo/error", error)
    }
  }, [data?.data, isError, showAllMemebers])


  useEffect(() => {
    onChanged(selectedComboItems.selectedDeviceCanreserv)
  }, [selectedComboItems.selectedDeviceCanreserv])

  const onSelectedItem = (item: InputComboItem) => {
    setSelectedComboItems((prev: selectedComboItems) => ({ ...prev, selectedDeviceCanreserv: item, isSelection: true }));
    CustomLogger.log("DeviceMemberCombo/ DeviceItem", item)
    onChanged(item)
  }
  return (
    <Grid container>
      <Grid item xs={isAuthorized ? 10 : 12}>
        <ControledCombo onSelectedItem={onSelectedItem} selectedItem={selectedComboItems.selectedDeviceCanreserv === undefined ? null : selectedComboItems.selectedDeviceCanreserv} items={selectedComboItems.deviceCanreservItems} /* handleComboChange={handleDeviceOnChange} */ title={title} />
      </Grid>
      {isAuthorized ?
        (
          <Grid item xs={isAuthorized ? 2 : 0}>
            <ToggleButton sx={{ width: "100%" }} value='check' selected={showAllMemebers} onChange={() => { setShowAllMembers((prev) => !prev) }}>ADMIN</ToggleButton >
          </Grid>
        ) :
        (<></>)      
      }
    </Grid>

  )
}

export default DeviceMemberCombo