import { Grid, styled, Box } from '@mui/material'
import IDeviceType, { CategoryType, EngienType, newDeviceType, SurfaceType } from '../../../Interfaces/API/IDeviceType'
import { useCreateDeviceTypeMutation, useFetchAllDeviceTypesQuery, useUpdateDeviceTypeMutation, useUpdateStatusDeviceTypeMutation } from '../../../features/DeviceTypes/deviceTypesApiSlice'
import useLocalStorage from '../../../hooks/useLocalStorage'
import DeviceTypesCombo from '../../../Components/Devices/DeviceTypesCombo'
import DeviceTypeItem from './DeviceTypeItem'
import { DeviceTypesContext } from '../../../app/Context/DeviceTypesContext'
import ActionButtons,{ EAction} from '../../../Components/Buttons/ActionButtons'
import { InputComboItem } from '../../../Components/Buttons/ControledCombo'
import { useState } from 'react'
import { IValidationAlertProps, ValidationAlert } from '../../../Components/Buttons/TransitionAlert'
import { getValidationFromError } from '../../../Utils/apiValidation.Parser'
import { IStatus, Status } from '../../../Interfaces/API/IStatus'
const source: string = "DeviceTypeTab"
const initialValues: IDeviceType = newDeviceType


//emotion
/* const StyledFrom = styled.div`

& .MuiFormControl-root {
 
  width: 80%;
  background-color: pink;
  
}
` */
const StyledGrid = styled(Grid)(({ theme }) => ({
  color: theme?.palette.primary.main,
}))

const inlineStyle = {
  fontSize: '1rem',
  backgroundColor: '#f5f5dc',

}

function DeviceTypeTab() {
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const { data: items, isError, isLoading, isSuccess, error } = useFetchAllDeviceTypesQuery();
  const [updateDeviceType] = useUpdateDeviceTypeMutation();
  const [createDeviceType] = useCreateDeviceTypeMutation();
  const [updateStatusDeviceType] = useUpdateStatusDeviceTypeMutation();
  const { refetch } = useFetchAllDeviceTypesQuery();
  const [selected, setSelected] = useLocalStorage<IDeviceType | null | undefined>('_admin/DeviceTab/DeviceType', null);
  
  const onValidationAlertClose = () => {
    setValidationAlert([]);
  }
  
  const onDeviceTypeChanged = (item: InputComboItem) => {
    const foundItem = items?.data.find((i) => item._id === i._id);
    if (foundItem && foundItem !== null) {
      setSelected(foundItem);
      console.log("onDeviceTypeChanged/foundItem", foundItem)

    }

  }
  async function onSave(): Promise<void> {
    let payLoad: any;
    try {
      setValidationAlert([]);
      if (selected?._id.length == 0) {
        let newDevice: IDeviceType;
        newDevice = { ...selected };
        console.log("DeviceTypeTab/OnCreate/newDevice", newDevice);
        payLoad = await createDeviceType(newDevice).unwrap();
        console.log("DeviceTypeTab/OnCreate/payload", payLoad);
      }
      else if (selected) {
        payLoad = await updateDeviceType(selected).unwrap();
        console.log("DeviceTypeTab/OnUpdate/payload", payLoad);
      }
      if(payLoad.error){
        setValidationAlert(getValidationFromError(payLoad.error, onValidationAlertClose));
      }
      refetch();
    }
    catch (error) {
      console.error("DeviceTypeTab/OnSave/error", error);
      setValidationAlert(getValidationFromError(error, onValidationAlertClose));
    }

  }
  async function onDelete(): Promise<void> {
    let payLoad: any;
    try {
      if (selected?._id) {
        const updateStatus: IStatus = {
          _id: selected?._id,
          status: Status.Suspended
        }
        payLoad = await updateStatusDeviceType(updateStatus);
        console.error("DeviceTypeTab/onDelete/error", payLoad)  
        if(payLoad.error){
          setValidationAlert(getValidationFromError(payLoad.error, onValidationAlertClose));
        }
        else{
          refetch();
          setSelected(null)
        }
        
      }
    }
    catch (error: any) {
      console.error("DeviceTypeTab/onDelete/error", error);
      setValidationAlert(getValidationFromError([error], onValidationAlertClose));
    }
  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event?.defaultPrevented
    console.log("ActionButtons/onAction", event?.target, action)
    switch (action) {
      case EAction.ADD:
        setSelected(newDeviceType);
        break;
      case EAction.DELETE:
        onDelete();
        break;
      case EAction.SAVE:
        onSave()
        break;
    }
  }
  return (
    <DeviceTypesContext.Provider value={{ deviceTypes: items?.data, selectedItem: selected, setSelectedItem: setSelected }}>
      <div className='yl__container' style={{ height: "100%", position: "relative" }}>
        <div className='header'>
          <Box marginTop={2}>
            <Grid container width={"100%"} height={"100%"} gap={2}>
              <Grid item xs={12}>
                <DeviceTypesCombo onChanged={onDeviceTypeChanged} source={source} />
              </Grid>

            </Grid>
          </Box>
        </div>
        <div className='main' style={{ overflow: "auto", height: "100%" }}>
        <Box marginTop={1}>
          <DeviceTypeItem />

        </Box>
      </div>
        <div className='footer' >

          <Box className='yl__action_button'>
            <ActionButtons OnAction={onAction} show={[EAction.SAVE,EAction.ADD]}/>
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
 
      
    </DeviceTypesContext.Provider>
  )
}

export default DeviceTypeTab