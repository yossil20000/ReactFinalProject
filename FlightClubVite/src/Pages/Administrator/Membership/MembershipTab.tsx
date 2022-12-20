import { Box, Grid, TextField } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import ActionButtons, { EAction } from '../../../Components/Buttons/ActionButtons'
import { InputComboItem } from '../../../Components/Buttons/ControledCombo';
import StatusCombo from '../../../Components/Buttons/StatusCombo';
import { IValidationAlertProps, ValidationAlert } from '../../../Components/Buttons/TransitionAlert'
import MembershipCombo from '../../../Components/Membership/MembershipCombo';
import {  useFetchAllMembershipQuery, useUpdateMembershipMutation } from '../../../features/membership/membershipApiSlice';
import useLocalStorage from '../../../hooks/useLocalStorage';
import IMembership, { NewMembership } from '../../../Interfaces/API/IMembership';
import { getValidationFromError } from '../../../Utils/apiValidation.Parser';
import { getSelectedItem, setProperty } from '../../../Utils/setProperty';
const source = "MembershipTab/status"
function MembershipTab() {
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [selectedItem, setSelectedItem] = useLocalStorage<IMembership>("MembershipTab/selectedItem", NewMembership);
  const {data,isError,error} = useFetchAllMembershipQuery();

  const [updateMembership] = useUpdateMembershipMutation();
  const { refetch } = useFetchAllMembershipQuery();

  useEffect(() => {
    if(error){
      console.log("MembershipTab/errors",error);
    }
  },[isError])
  useEffect(() => {
    if(data){
      console.log("MembershipTab/data",data);
      setSelectedItem(data.data[0])
    }
  },[data])
  const onValidationAlertClose = () => {
    setValidationAlert([]);
  }
  async function onSave(): Promise<void> {
    let payLoad: any;
    try {
      setValidationAlert([]);
      if (selectedItem !== undefined && selectedItem?._id !== "") {
        payLoad = await updateMembership(selectedItem as unknown as IMembership).unwrap();
        console.log("MembershipTab/OnSave/payload", payLoad);
        if (payLoad.error) {
          setValidationAlert(getValidationFromError(payLoad.error, onValidationAlertClose));
        }

      }
      else {
        throw new Error("Selected Membership UnDefined");
      }
    }
    catch (error) {
      console.error("DeviceTab/OnSave/error", error);
      setValidationAlert(getValidationFromError(error, onValidationAlertClose));

    }
    finally {
      refetch();
    }

  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event?.defaultPrevented
    console.log("ActionButtons/onAction", event?.target, action)
    switch (action) {
      case EAction.ADD:
        setSelectedItem(NewMembership);
        break;
      case EAction.SAVE:
        onSave()
        break;
    }
  }

  const onMemberTypeChanged = (item: InputComboItem) => {
    console.log("onMemberTypeChanged/Item", item)
    const foundItem = data?.data.find((i) => item._id === i._id);
    if (foundItem && foundItem !== null) {
      setSelectedItem(foundItem);
     /* console.log("onMemberTypeChanged/foundItem", foundItem) */

    } 

  }

  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    console.log("SetProperty/newobj", newObj)
    return newObj;
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("DeviceTabItem/handleChange", event.target.name, event.target.value)
    const newObj: IMembership = SetProperty(selectedItem, event.target.name, event.target.value) as IMembership;

    setSelectedItem(newObj)
  };
  const onComboChanged = useCallback((item: InputComboItem, prop: string): void => {
    console.log("onComboChanged/item", item, prop);
    const newObj: IMembership = SetProperty(selectedItem, prop, item.lable) as IMembership;
    setSelectedItem(newObj)
  },[selectedItem])
  return (
    <div className='yl__container' style={{ height: "100%", position: "relative" }}>
      <div className='header'>
        <Box marginTop={2}>
          <Grid container width={"100%"} height={"100%"} gap={2}>
            <Grid item xs={12}>
              <MembershipCombo onChanged={onMemberTypeChanged} source={"MembershipCombo"} />
            </Grid>
          </Grid>
        </Box>
      </div>
      <div className='main' style={{ overflow: "auto", height: "100%" }}>
        <Box marginTop={3} >
          <Grid container width={"100%"} height={"100%"} rowSpacing={2} columnSpacing={1} columns={12} margin={0}>
            <Grid item xs={12} sm={12} >
              <TextField type={"text"} fullWidth onChange={handleChange} name="name" label="Name" placeholder="Name" variant="standard" value={selectedItem?.name} InputLabelProps={{ shrink: true }}/>
            </Grid>
            <Grid item xs={12}>
              <TextField type={"number"} fullWidth onChange={handleChange} name="entry_price" label="Entry Price" placeholder="Intitial Entry Price" variant="standard" value={selectedItem?.entry_price} InputLabelProps={{ shrink: true }}/>
            </Grid>
            <Grid item xs={12}>
              <TextField type={"number"} fullWidth onChange={handleChange} name="montly_price" label="Montly Price" placeholder="Montly Price" variant="standard" value={selectedItem?.montly_price} InputLabelProps={{ shrink: true }}/>
            </Grid>
            <Grid item xs={12}>
              <TextField type={"number"} fullWidth onChange={handleChange} name="hour_disc_percet" label="Discount" placeholder="Discount %" variant="standard" value={selectedItem?.hour_disc_percet} InputLabelProps={{ shrink: true }}/>
            </Grid>
            <Grid item xs={12}>
            <StatusCombo onChanged={(item) => onComboChanged(item, "status")} selectedItem={getSelectedItem(selectedItem?.status.toString())} source={source}/>
            </Grid>
          </Grid>

        </Box>
      </div>
      <div className='footer'>

        <Box className='yl__action_button'>
          <ActionButtons OnAction={onAction} show={[EAction.SAVE]} />
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
  )
}

export default MembershipTab