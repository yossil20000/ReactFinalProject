import { Box, Grid, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { MembersContext, MembersContextType } from '../../../app/Context/MemberContext';
import { MembershipContext } from '../../../app/Context/MembershipContext';
import ActionButtons, { EAction } from '../../../Components/Buttons/ActionButtons';
import { InputComboItem } from '../../../Components/Buttons/ControledCombo';
import ScrollableTabs, { ScrollableTabsItem } from '../../../Components/Buttons/ScrollableTabs'
import { IValidationAlertProps, ValidationAlert } from '../../../Components/Buttons/TransitionAlert';
import MembersCombo from '../../../Components/Members/MembersCombo';
import { useFetchAllMembershipQuery } from '../../../features/membership/membershipApiSlice';
import { useFetcAllMembersQuery, useUpdateMemberMutation, useUpdateStatusMutation } from '../../../features/Users/userSlice';
import { Gender, IMemberAdmin, IMemberStatus, MemberType, Role, Status } from '../../../Interfaces/API/IMember';
import IMembership, { NewMembership } from '../../../Interfaces/API/IMembership';
import IMemberUpdate from '../../../Interfaces/IMemberInfo';
import { getValidationFromError } from '../../../Utils/apiValidation.Parser';
import AddresesTab from './AddresesTab';
import GeneralTab from './GeneralTab';
import PermissionsTab from './PermissionsTab';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../Types/Urls';

const items: ScrollableTabsItem[] = [
  { id: 0, label: "General" },
  { id: 1, label: "Address" },
  { id: 2, label: "Permissions" }

];

function MemberTab() {
  const navigate = useNavigate();
  const { setSelectedItem, selectedItem, members } = useContext(MembersContext) as MembersContextType;
  const [selecteMembership, setSelecteMembership] = useState<IMembership | null>();
  const [value, setValue] = React.useState(0);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [statusMember] = useUpdateStatusMutation();
  const [updateMember] = useUpdateMemberMutation();
  const { refetch } = useFetcAllMembersQuery();
  const { data: memberships, isError, isLoading, isFetching, isSuccess, error } = useFetchAllMembershipQuery();
  const [isSave, setIsSaved] = useState(false)


  useEffect(() => {

    if (isError) {
      CustomLogger.error("MemberTab/useEffect/iserror", error)
    }
  }, [isError])

  const onValidationAlertClose = () => {
    setValidationAlert([]);
  }
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    CustomLogger.log("MemberPage/newValue", newValue)
  }

  const handleMemberChange = (item: InputComboItem) => {
    CustomLogger.log("MemberTab/General/handleChange/item", item)
    const member = members?.find((member) => item._id == member._id)
    CustomLogger.info("MemberTab/General/member", member)
    setSelectedItem(member === undefined ? null : member);
  };

  function newMember(): IMemberAdmin {
    const newMember: IMemberAdmin = {
      _id: "",
      status: Status.Suspended,
      member_type: MemberType.Member,
      role: {
        roles: [Role.guest]
      },
      date_of_birth: new Date(),
      date_of_join: new Date(),
      date_of_leave: null,
      membership: NewMembership,
      member_id: "",
      id_number: "",
      family_name: "",
      first_name: "",
      gender: Gender.other,
      username: "",
      image: "",
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
  async function onDelete(newStatus: Status): Promise<void> {
    let payLoad: any;
    try {
      if (selectedItem?._id) {
        const status: IMemberStatus = {
          _id: selectedItem?._id,
          status: newStatus
        }
        payLoad = await statusMember(status);
        if (payLoad.error) {
          setValidationAlert(getValidationFromError(payLoad.error, onValidationAlertClose));
        }
        else {
          refetch();
          setSelectedItem(null)
        }
      }
    }
    catch (error) {
      console.error("DeviceTab/OnSave/error", error);
      setValidationAlert(getValidationFromError([error], onValidationAlertClose));
    }
  }
  async function onSave(): Promise<void> {
    let payLoad: any;
    setIsSaved(true)
    try {
      setValidationAlert([]);
      if (selectedItem !== undefined && selectedItem?._id !== "") {
        payLoad = await updateMember(selectedItem as unknown as IMemberUpdate).unwrap();
        CustomLogger.info("General/OnUpdate/payload", payLoad);
        if (payLoad.error) {
          setValidationAlert(getValidationFromError(payLoad.error, onValidationAlertClose));
        }
        setIsSaved(false)
      }
      else {
        throw new Error("Selected Member Un Defined");
      }
    }
    catch (error) {
      console.error("DeviceTab/OnSave/error", error);
      setValidationAlert(getValidationFromError(error, onValidationAlertClose));

    }
    finally {
      refetch();
      setIsSaved(false)
    }

  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event?.defaultPrevented
    CustomLogger.log("ActionButtons/onAction", event?.target, action)
    switch (action) {
      case EAction.ADD:
        setSelectedItem(newMember());
        break;
      case EAction.SAVE:
        onSave()
        break;
      case EAction.ADD:
        navigate("registration")
        break;
    }
  }

  return (
    <MembershipContext.Provider value={{ membership: memberships?.data ?? [], selectedItem: selecteMembership, setSelectedItem: setSelecteMembership }}>
      <div className='yl__container' style={{ height: "100%", position: "relative" }}>
        <div className='header'>
          <Box marginTop={1}>
            <Grid container columns={12}>
{/*               <Grid item xs={12} md={6}>
              <ActionButtons OnAction={onAction} show={[EAction.ADD]} item={""} display={[{ key: EAction.ADD, value: "Add Member" }]} disable={[{ key: EAction.SAVE, value: isSave }]} />
              </Grid> */}
              <Grid item xs={12} md={6}>
                <MembersCombo onChanged={handleMemberChange} source={"source"} filter={{}} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  disabled
                  type={"text"}
                  sx={{ marginLeft: "0px", width: "100%", fontSize: 25 }}
                  name=""
                  id="member_info"
                  variant="standard"
                  key={"member_info"}
                  value={`${selectedItem?.family_name} ${selectedItem?.first_name} / ${selectedItem?.member_id} ${selectedItem?.member_type} `}
                  InputLabelProps={{ shrink: true }}
                  label="Member Info"

                />
              </Grid>
              <Grid item xs={12}>
                <ScrollableTabs items={items} value={value} setValue={setValue} handleChange={handleChange} />
              </Grid>
            </Grid>
          </Box>
        </div>
        <div className='main' style={{ overflow: "auto", height: "100%" }}>
          <Box marginTop={1} height={"100%"} >
            {value === 0 && <GeneralTab />}
            {value === 1 && (<AddresesTab />)}
            {value === 2 && (<PermissionsTab />)}
          </Box>
        </div>
        <div className='footer'>
          <Grid container>
            {validationAlert.map((item) => (
              <Grid item xs={12}>

                <ValidationAlert {...item} />

              </Grid>
            ))}
          </Grid>
          <Box className='yl__action_button'>
            <ActionButtons OnAction={onAction} show={[EAction.SAVE]} item={""} disable={[{ key: EAction.SAVE, value: isSave }]} />
          </Box>

        </div>
      </div>
    </MembershipContext.Provider>
  )
}

export default MemberTab