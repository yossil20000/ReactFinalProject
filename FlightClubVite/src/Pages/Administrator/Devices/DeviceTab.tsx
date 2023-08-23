import { Box, Grid } from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import { DevicesContext, DevicesContextType } from '../../../app/Context/DevicesContext';
import DevicesCombo from '../../../Components/Devices/DevicesCombo';
import { useCreateDeviceMutation, useFetchAllDevicesQuery, useUpdateDeviceMutation, useUpdateStatusDeviceMutation } from '../../../features/Device/deviceApiSlice'
import IDevice, { DEVICE_MET, DEVICE_MT, DEVICE_STATUS, IDeviceCreate } from '../../../Interfaces/API/IDevice';
import { FuelUnits } from '../../../Types/FuelUnits';
import DeviceTabItem from './DeviceTabItem';
import ActionButtons, { EAction } from '../../../Components/Buttons/ActionButtons';
import { getValidationFromError } from '../../../Utils/apiValidation.Parser';
import { IValidationAlertProps, ValidationAlert } from '../../../Components/Buttons/TransitionAlert';
import { InputComboItem } from '../../../Components/Buttons/ControledCombo';
import { IStatus, Status } from '../../../Interfaces/API/IStatus';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setDirty } from '../../../features/Admin/adminPageSlice';

const source: string = "DeviceTab"
const dairtyDeviceTabItem = "DeviceTabItem";
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
    flight_reservs: [],
    status: Status.Suspended,
    has_hobbs: false
  }
  return newDevice;
}
export type ActionState = "init" | 'start' | "stop"

function DeviceTab() {
  
  const setDirtyDispatch = useAppDispatch();
  const dairtyAdminFlag = useAppSelector((state) => state.setDairty);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [operationState, setOprerationState] = useState<ActionState>('init');
  const { selectedItem: selectedDevice, setSelectedItem: setSelectedDevice, devices } = useContext(DevicesContext) as DevicesContextType;

  const [updateDevice] = useUpdateDeviceMutation();
  const [createDevice] = useCreateDeviceMutation();
  const [updateStatuseDevice] = useUpdateStatusDeviceMutation();
  const { refetch } = useFetchAllDevicesQuery();

  useEffect(() => {
    console.log("DeviceTab/useEffect/dairtyAdminFlag:", dairtyAdminFlag)
    if (dairtyAdminFlag[dairtyDeviceTabItem] && dairtyAdminFlag[dairtyDeviceTabItem] == true)
      setOprerationState('init')
  }, [dairtyAdminFlag])

  console.log("DeviceTab/dairtyAdminFlag:", dairtyAdminFlag)

  const SetDirtyFlage = (value: boolean) => {
    CustomLogger.info("SetDirtyFlage/dirtyFlag", source, true);

    setDirtyDispatch(setDirty({ key: dairtyDeviceTabItem, value: value }))
  }
  const onValidationAlertClose = () => {
    setValidationAlert([]);
  }

  const onDeviceChange = (item: InputComboItem) => {
    const foundItem = devices?.find((i) => item._id === i._id);
    if (foundItem && foundItem !== null) {
      setSelectedDevice(foundItem);
      CustomLogger.info("DeviceTab/onDeviceChange/foundItem", foundItem)

    }
    else {
      setSelectedDevice(null);
    }

  }
  async function onDelete(): Promise<void> {
    let payload: any;
    try {
      setOprerationState('init')
      if (selectedDevice?._id) {
        const updateStatus: IStatus = {
          _id: selectedDevice?._id,
          status: Status.Suspended
        }
        payload = await updateStatuseDevice(updateStatus);
        if (payload.error) {
          setValidationAlert(getValidationFromError(payload.error, onValidationAlertClose));
        }
        else {
          refetch();
          setSelectedDevice(null)
        }

      }
    }
    catch (error) {
      console.error("DeviceTab/OnSave/error", error);
      setValidationAlert(getValidationFromError([error], onValidationAlertClose));
    }

    finally {
      setOprerationState('stop')
    }
  }
  async function onSave(): Promise<void> {
    let payLoad: any;
    try {
      SetDirtyFlage(false)
      setValidationAlert([]);
      if (selectedDevice?._id.length == 0) {
        let newDevice: IDeviceCreate;
        newDevice = { ...selectedDevice };
        CustomLogger.info("DeviceTab/OnCreate/newDevice", newDevice);
        payLoad = await createDevice(newDevice).unwrap();
        CustomLogger.info("DeviceTab/OnCreate/payload", payLoad);
      }
      else if (selectedDevice) {
        payLoad = await updateDevice(selectedDevice).unwrap();
        CustomLogger.info("DeviceTab/OnUpdate/payload", payLoad);
      }
      CustomLogger.info("DeviceTab/onsave/finished/payload", payLoad);
      if (payLoad.error) {
        setOprerationState('init')
        CustomLogger.error("DeviceTab/onsave/finished/payload.error", payLoad);
        setValidationAlert(getValidationFromError(payLoad.error, onValidationAlertClose));
      }
      setOprerationState('stop')
      refetch();

    }
    catch (error) {
      setOprerationState('init')
      console.error("DeviceTab/OnSave/error", error);
      setValidationAlert(getValidationFromError(error, onValidationAlertClose));
    }
    finally {

    }

  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event?.defaultPrevented
    CustomLogger.info("ActionButtons/onAction/dairtyAdminFlag", action, dairtyAdminFlag)

    switch (action) {
      case EAction.ADD:
        setSelectedDevice(newDevice());
        break;
      case EAction.DELETE:
        setOprerationState('start')
        onDelete();
        break;
      case EAction.SAVE:
        setOprerationState('start')
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
        <div className='footer' style={{ overflow: 'hidden', height: 'auto' }}>
          <Grid container>
            {validationAlert.map((item) => (
              <Grid item xs={12}>
                <ValidationAlert {...item} />
              </Grid>
            ))}
          </Grid>
          <Box className='yl__action_button' >
            <ActionButtons OnAction={onAction}
              show={[EAction.SAVE, EAction.ADD]} item={""}
              display={[{ key: EAction.SAVE, value: (operationState == "init" || operationState == 'start') ? "SAVE" : "SAVED" }]}
              color={[{ key: EAction.SAVE, value: (operationState == "init" || operationState == 'start') ? "primary" : "success" }]}
              disable={[{ key: EAction.SAVE, value: (operationState == "init" || operationState == 'stop') ? false : true }]} />
          </Box>
        </div>
      </div>
    </>
  )
}

export default DeviceTab