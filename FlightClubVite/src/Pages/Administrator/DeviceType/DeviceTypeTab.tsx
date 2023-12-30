import { Grid, styled, Box } from '@mui/material'
import IDeviceType, { CategoryType, EngienType, newDeviceType, SurfaceType } from '../../../Interfaces/API/IDeviceType'
import { useCreateDeviceTypeMutation, useFetchAllDeviceTypesQuery, useUpdateDeviceTypeMutation, useUpdateStatusDeviceTypeMutation } from '../../../features/DeviceTypes/deviceTypesApiSlice'
import useLocalStorage from '../../../hooks/useLocalStorage'
import DeviceTypesCombo from '../../../Components/Devices/DeviceTypesCombo'
import DeviceTypeItem from './DeviceTypeItem'
import { DeviceTypesContext, DeviceTypesContextType } from '../../../app/Context/DeviceTypesContext'
import ActionButtons,{ EAction} from '../../../Components/Buttons/ActionButtons'
import { InputComboItem } from '../../../Components/Buttons/ControledCombo'
import { useContext, useState } from 'react'
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
  const { selectedItem, setSelectedItem } = useContext(DeviceTypesContext) as DeviceTypesContextType;
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const { data: items, isError, isLoading, isSuccess, error } = useFetchAllDeviceTypesQuery();
  const [updateDeviceType] = useUpdateDeviceTypeMutation();
  const [createDeviceType] = useCreateDeviceTypeMutation();
  const [updateStatusDeviceType] = useUpdateStatusDeviceTypeMutation();
  const { refetch } = useFetchAllDeviceTypesQuery();
  
  
  const onValidationAlertClose = () => {
    setValidationAlert([]);
  }
  
  const onDeviceTypeChanged = (item: InputComboItem) => {
    const foundItem = items?.data.find((i) => item._id === i._id);
    if (foundItem && foundItem !== null) {
      setSelectedItem(foundItem);
      CustomLogger.info("onDeviceTypeChanged/foundItem", foundItem)
    }
  }
  async function onSave(): Promise<void> {
    let payLoad: any;
    try {
      setValidationAlert([]);
      if (selectedItem?._id.length == 0) {
        let newDevice: IDeviceType;
        newDevice = { ...selectedItem };
        CustomLogger.info("DeviceTypeTab/OnCreate/newDevice", newDevice);
        payLoad = await createDeviceType(newDevice).unwrap();
        CustomLogger.info("DeviceTypeTab/OnCreate/payload", payLoad);
      }
      else if (selectedItem) {
        payLoad = await updateDeviceType(selectedItem).unwrap();
        CustomLogger.info("DeviceTypeTab/OnUpdate/payload", payLoad);
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
      if (selectedItem?._id) {
        const updateStatus: IStatus = {
          _id: selectedItem?._id,
          status: Status.Suspended
        }
        payLoad = await updateStatusDeviceType(updateStatus);
        console.error("DeviceTypeTab/onDelete/error", payLoad)  
        if(payLoad.error){
          setValidationAlert(getValidationFromError(payLoad.error, onValidationAlertClose));
        }
        else{
          refetch();
          setSelectedItem(null)
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
    CustomLogger.log("ActionButtons/onAction", event?.target, action)
    switch (action) {
      case EAction.ADD:
        setSelectedItem(newDeviceType);
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
        <Grid container>
            {validationAlert.map((item) => (
              <Grid item xs={12}>

                <ValidationAlert {...item} />

              </Grid>
            ))}
          </Grid>
          <Box className='yl__action_button'>
            <ActionButtons OnAction={onAction} show={[EAction.SAVE,EAction.ADD]} item={""}/>
          </Box>

        </div>
      </div>
  )
}

export default DeviceTypeTab