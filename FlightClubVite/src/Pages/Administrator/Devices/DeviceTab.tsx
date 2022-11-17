import { Box, Grid } from '@mui/material'
import { useContext, useState } from 'react';
import { DevicesContext, DevicesContextType } from '../../../app/Context/DevicesContext';
import { DeviceTypesContext, DeviceTypesContextType } from '../../../app/Context/DeviceTypesContext';
import DevicesCombo from '../../../Components/Devices/DevicesCombo';
import { useCreateDeviceMutation, useUpdateDeviceMutation } from '../../../features/Device/deviceApiSlice'
import IDevice, { DEVICE_MET, DEVICE_MT, DEVICE_STATUS, IDeviceCreate } from '../../../Interfaces/API/IDevice';
import { FuelUnits } from '../../../Types/FuelUnits';
import DeviceTabItem from './DeviceTabItem';
import ActionButtons, { EAction } from '../../../Components/Buttons/ActionButtons';
import { getValidationFromError } from '../../../Utils/apiValidation.Parser';
import { IValidationAlertProps, ValidationAlert } from '../../../Components/Buttons/TransitionAlert';
import { InputComboItem } from '../../../Components/Buttons/ControledCombo';
const source: string = "DeviceTab"
function newDevice(): IDevice {
  let newDevice: IDevice = {
    _id: '',
    device_id: 'newDevice',
    device_type: '',
    description: '',
    available: false,
    device_status: DEVICE_STATUS.NOT_EXIST,
    due_date: new Date(),
    hobbs_meter: 0,
    engien_meter: 0,
    maintanance: {
      type: DEVICE_MT['50hr'],
      next_meter: 0
    },
    price: {
      base: 0,
      meter: DEVICE_MET.HOBBS
    },
    details: {
      image: '',
      color: '',
      seats: 0,
      fuel: {
        quantity: 0,
        units: FuelUnits.galon
      },
      instruments: []
    },
    location_zone: '',
    can_reservs: [],
    flights: [],
    flight_reservs: []
  }
  return newDevice;
}

function DeviceTab() {
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);

  const { selectedItem: selectedDevice, setSelectedItem: setSelectedDevice, devices } = useContext(DevicesContext) as DevicesContextType;
  const { selectedItem: selectedDeviceTypes, setSelectedItem: setSelectedDeviceTypes, deviceTypes } = useContext(DeviceTypesContext) as DeviceTypesContextType

  const [updateDevice] = useUpdateDeviceMutation();
  const [createDevice] = useCreateDeviceMutation()
  const onValidationAlertClose = () => {
    setValidationAlert([]);
  }
  if (devices) {
    console.log("DevicesTab/devices", devices);
  }
  const onDeviceChange = (item: InputComboItem) => {
    const foundItem = devices?.find((i) => item._id === i._id);
    if (foundItem && foundItem !== null) {
      setSelectedDevice(foundItem);
      console.log("onDeviceChange/foundItem", foundItem)

    }

  }
  async function onSave(): Promise<void> {
    let payLoad: any;
    try {
      if (selectedDevice?._id.length == 0) {
        let newDevice: IDeviceCreate;
        newDevice = { ...selectedDevice };
        console.log("DeviceTab/OnCreate/newDevice", newDevice);
        payLoad = await createDevice(newDevice).unwrap();
        console.log("DeviceTab/OnCreate/payload", payLoad);
      }
      else if (selectedDevice) {
        payLoad = await updateDevice(selectedDevice).unwrap();
        console.log("DeviceTab/OnUpdate/payload", payLoad);
      }
    }
    catch (error) {
      console.log("DeviceTab/OnSave/error", error);
      setValidationAlert(getValidationFromError(error, onValidationAlertClose));
    }

  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event?.defaultPrevented
    console.log("ActionButtons/onAction", event?.target, action)
    switch (action) {
      case EAction.ADD:
        setSelectedDevice(newDevice());
        break;
      case EAction.DELETE:
        break;
      case EAction.SAVE:
        onSave()
        break;
    }
  }
  return (
    <>
      <div className='yl__container' style={{ height: "100%", position: "relative" }}>
        <div className='header'>
          <Box marginTop={2}>
            <Grid container width={"100%"} height={"100%"} gap={2}>
              <Grid item xs={12}>
                <DevicesCombo onChanged={onDeviceChange} source={source} />
              </Grid>

            </Grid>
          </Box>
        </div>
        <div className='main' style={{ overflow: "auto", height: "100%" }}>
          <Box marginTop={1} height={"100%"}>
            <DeviceTabItem />

          </Box>

        </div>
        <div className='footer' >

          <Box className='yl__action_button' >
            <ActionButtons OnAction={onAction} />

          </Box>
          <Grid container>
              {validationAlert.map((item) => (
                <Grid item xs={12}>

                  <ValidationAlert {...item} />

                </Grid>
              ))}
            </Grid>
        </div>
      </div>

    </>
  )
}



export default DeviceTab