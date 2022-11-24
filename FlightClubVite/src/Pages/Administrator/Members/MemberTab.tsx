import { Box, Grid, Paper } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { MembersContext, MembersContextType } from '../../../app/Context/MemberContext';
import { MembershipContext, MembershipContextType } from '../../../app/Context/MembershipContext';
import ActionButtons, { EAction } from '../../../Components/Buttons/ActionButtons';
import { InputComboItem } from '../../../Components/Buttons/ControledCombo';
import ScrollableTabs, { ScrollableTabsItem } from '../../../Components/Buttons/ScrollableTabs'
import { IValidationAlertProps, ValidationAlert } from '../../../Components/Buttons/TransitionAlert';
import MembersCombo from '../../../Components/Members/MembersCombo';
import { useFetchAllDevicesQuery } from '../../../features/Device/deviceApiSlice';
import { useFetchAllMembershipQuery } from '../../../features/membership/membershipApiSlice';
import { useCreateMemberMutation, useFetcAllMembersQuery, useUpdateMemberMutation, useUpdateStatusMutation } from '../../../features/Users/userSlice';
import { IMemberAdmin, IMemberStatus, MemberType, Role, Status } from '../../../Interfaces/API/IMember';
import IMembership, { NewMembership } from '../../../Interfaces/API/IMembership';
import IMemberCreate from '../../../Interfaces/IMemberCreate';
import IMemberUpdate from '../../../Interfaces/IMemberInfo';
import { getValidationFromError } from '../../../Utils/apiValidation.Parser';
import { setProperty } from '../../../Utils/setProperty';
import AddresesTab from './AddresesTab';
import GeneralTab from './GeneralTab';
import PermissionsTab from './PermissionsTab';

const items: ScrollableTabsItem[] = [
  { id: 0, label: "General" },
  { id: 1, label: "Address" },
  { id: 2, label: "Permissions" }

];

function MemberTab() {
  const { setSelectedItem, selectedItem,members } = useContext(MembersContext) as MembersContextType;
  const [selecteMembership,setSelecteMembership] = useState<IMembership | null>();
  const [value, setValue] = React.useState(0);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [createMember] = useCreateMemberMutation();
  const [statusMember] = useUpdateStatusMutation();
  const [updateMember] = useUpdateMemberMutation();
  const {refetch} = useFetcAllMembersQuery();
  const {data: memberships,isError,isLoading,isFetching,isSuccess,error} = useFetchAllMembershipQuery();
   
  

  useEffect(() => {
    
    if(isError){
      console.log("MemberTab/useEffect/iserror", error)
    }
  },[isError])
  
  const onValidationAlertClose = () => {
    setValidationAlert([]);
  }
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    console.log("MemberPage/newValue", newValue)
  }

  const handleMemberChange = (item: InputComboItem) => {
    console.log("MemberTab/General/handleChange/item", item)
    const member = members?.find((member) => item._id == member._id )
    console.log("MemberTab/General/member", member)
    setSelectedItem(member)
  };

  function newMember(): IMemberAdmin {
    const newMember : IMemberAdmin ={
      _id: "",
      status: Status.Suspended,
      member_type: MemberType.Normal,
      role: {
        roles: [Role.guest]
      },
      date_of_birth: new Date(),
      date_of_join: new Date(),
      date_of_leave: null,
      membership: NewMembership,
      member_id: "",
      family_name: "",
      first_name: "",
      contact: {
        billing_address: {
          line1: "",
          line2: "",
          city: "",
          postcode: "",
          province: "",
          state: Status.Suspended
        },
        shipping_address: {
          line2: "",
          line1: "",
          city: "",
          postcode: "",
          province: "",
          state: ""
        },
        phone: {
          country: "",
          area: "",
          number: ""
        },
        email: ""
      }
    } 
    return newMember;
  }
  async function onDelete(newStatus: Status) : Promise<void> {
    let payload: any;
    try{
      if(selectedItem?._id){
        const status : IMemberStatus = {
          _id: selectedItem?._id,
          status: newStatus
        }
        payload = await statusMember(status);
        refetch();
        setSelectedItem(null)
      }
    }
    catch(error){
      console.error("DeviceTab/OnSave/error", error);
      setValidationAlert(getValidationFromError(error, onValidationAlertClose));
    }
  }
  async function onSave(): Promise<void> {
    let payLoad: any;
    try {
      if (selectedItem?._id.length == 0) {
        let newDevice: IMemberAdmin;
        newDevice = { ...selectedItem };
        console.log("General/OnCreate/newDevice", newDevice);
        payLoad = await createMember(newDevice as unknown as IMemberCreate).unwrap();
        console.log("General/OnCreate/payload", payLoad);
      }
      else if (selectedItem) {
        payLoad = await updateMember(selectedItem as unknown as IMemberUpdate).unwrap();
        console.log("General/OnUpdate/payload", payLoad);
      }
      refetch();
    }
    catch (error) {
      console.error("DeviceTab/OnSave/error", error);
      setValidationAlert(getValidationFromError(error, onValidationAlertClose));
    }

  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event?.defaultPrevented
    console.log("ActionButtons/onAction", event?.target, action)
    switch (action) {
      case EAction.ADD:
        setSelectedItem(newMember());
        break;
      case EAction.SAVE:
        onSave()
        break;
    }
  }
  
  return (
    <MembershipContext.Provider value={{membership: memberships?.data ?? [], selectedItem: selecteMembership,setSelectedItem: setSelecteMembership}}>
    <div className='yl__container' style={{ height: "100%", position: "relative" }}>
      <div className='header'>
        <Box marginTop={1}>
          <Grid container columns={12}>
            <Grid item xs={12}>
            <MembersCombo onChanged={handleMemberChange} source={"source"}/>
            </Grid>
            <Grid item xs={12}>
            <ScrollableTabs items={items} value={value} setValue={setValue} handleChange={handleChange} />
            </Grid>
          </Grid>
        
        
          

        </Box>
      </div>
      <div className='main' style={{ overflow: "auto" ,height:"100%"}}>
        <Box marginTop={1} height={"100%"} >

          {value === 0 && <GeneralTab/>}
          {value === 1 && (<AddresesTab/>)}
          {value === 2 && (<PermissionsTab/>)}
        </Box>

      </div>
      <div className='footer'>

      <Box className='yl__action_button'>
            <ActionButtons OnAction={onAction} show={[EAction.DELETE,EAction.SAVE]}/>
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
    </MembershipContext.Provider>
  )
}

export default MemberTab