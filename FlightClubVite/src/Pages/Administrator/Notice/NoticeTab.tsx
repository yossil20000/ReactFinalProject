import { Box, Grid, TextField } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import ActionButtons, { EAction } from '../../../Components/Buttons/ActionButtons'
import { InputComboItem } from '../../../Components/Buttons/ControledCombo';
import StatusCombo from '../../../Components/Buttons/StatusCombo';
import { IValidationAlertProps, ValidationAlert } from '../../../Components/Buttons/TransitionAlert'
import MembershipCombo from '../../../Components/Membership/MembershipCombo';
import { useCreateNoticeMutation, useUpdateNoticeMutation } from '../../../features/clubNotice/noticeApiSlice';
import { useCreateMembershipMutation, useFetchAllMembershipQuery, useUpdateMembershipMutation } from '../../../features/membership/membershipApiSlice';
import { useFetchAllClubNoticeQuery } from '../../../features/Users/userSlice';
import useLocalStorage from '../../../hooks/useLocalStorage';
import IClubNotice, { NewNotice } from '../../../Interfaces/API/IClubNotice';
import IMembership, { IMembershipBase, NewMembership } from '../../../Interfaces/API/IMembership';
import IMemberUpdate from '../../../Interfaces/IMemberInfo';
import { getValidationFromError } from '../../../Utils/apiValidation.Parser';
import { getSelectedItem, setProperty } from '../../../Utils/setProperty';
const source = "NoticeTab/status"
function NoticeTab() {
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [selectedItem, setSelectedItem] = useLocalStorage<IClubNotice>("NoticeTab/selectedItem", NewNotice);
  const {data,isError,error} = useFetchAllClubNoticeQuery();

  const [updateNotice] = useUpdateNoticeMutation();
  const [createNotice] = useCreateNoticeMutation()
  const { refetch } = useFetchAllClubNoticeQuery();

  useEffect(() => {
    if(error){
      console.log("NoticeTab/errors",error);
    }
  },[isError])
  useEffect(() => {
    if(data){
      console.log("NoticeTab/data",data);
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
        payLoad = await updateNotice(selectedItem as unknown as IClubNotice).unwrap();
        console.log("NoticeTab/OnSave/payload", payLoad);
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
        setSelectedItem(NewNotice);
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
    const newObj: IClubNotice = SetProperty(selectedItem, event.target.name, event.target.value) as IClubNotice;

    setSelectedItem(newObj)
  };
  return (
    <div className='yl__container' style={{ height: "100%", position: "relative" }}>
      <div className='header'>
        <Box marginTop={2}>
          <Grid container width={"100%"} height={"100%"} gap={2}>
            <Grid item xs={12}>
    
            </Grid>
          </Grid>
        </Box>
      </div>
      <div className='main' style={{ overflow: "auto", height: "100%" }}>
        <Box marginTop={3} >
    
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

export default NoticeTab