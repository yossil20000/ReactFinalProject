import { Grid, TextField } from "@mui/material"
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { useContext, useState } from "react";
import { DevicesContext, DevicesContextType } from "../../../app/Context/DevicesContext";
import { MembersContext, MembersContextType } from "../../../app/Context/MemberContext";
import { EAction } from "../../../Components/Buttons/ActionButtons";
import CheckSelect from "../../../Components/Buttons/CheckSelect";
import { InputComboItem } from "../../../Components/Buttons/ControledCombo"
import { LabelType } from "../../../Components/Buttons/MultiOptionCombo";
import { IValidationAlertProps } from "../../../Components/Buttons/TransitionAlert";
import MembersCombo from "../../../Components/Members/MembersCombo"
import StatusCombo from "../../../Components/Members/StatusCombo";
import MemberRoleCombo from "../../../Components/Members/StatusCombo";
import { useFetchAllDevicesQuery } from "../../../features/Device/deviceApiSlice";
import { useCreateMemberMutation, useDeleteMemberMutation, useUpdateMemberMutation } from "../../../features/Users/userSlice";
import IMember, { IMemberAdmin, MemberType, Role, Status } from "../../../Interfaces/API/IMember";
import { NewMembership } from "../../../Interfaces/API/IMembership";
import IMemberCreate from "../../../Interfaces/IMemberCreate";
import IMemberUpdate from "../../../Interfaces/IMemberInfo";
import { getValidationFromError } from "../../../Utils/apiValidation.Parser";
import { Enum2ComboItem } from "../../../Utils/enums";
import { getSelectedItem, setProperty } from "../../../Utils/setProperty";
const source = "admin/member/general"

const SetProperty = (obj: any, path: string, value: any): any => {
  let newObj = { ...obj };
  newObj = setProperty(newObj, path, value);
  console.log("SetProperty/newobj", newObj)
  return newObj;
}
function Permissions() {

  const { setSelectedItem, selectedItem, members } = useContext(MembersContext) as MembersContextType;
  const { membersCombo } = useContext(DevicesContext) as DevicesContextType;


  const handleTimeChange = (newValue: Date | null | undefined, name: string) => {
    console.log(`handleTimeChange/newValue , key`, newValue, name);
    if (newValue === null || newValue === undefined)
      return;

    const newObj: IMemberAdmin = SetProperty(selectedItem, name, newValue) as IMemberAdmin;

    setSelectedItem(newObj)
  };
  const onComboChanged = (item: InputComboItem, prop: string): void => {
    console.log("onComboChanged/item", item, prop);
    const newObj: IMemberAdmin = SetProperty(selectedItem, prop, item.lable) as IMemberAdmin;
    setSelectedItem(newObj)
  }
  const onRoleChanged = (item: LabelType[], prop: string): void => {
    console.log("onComboChanged/item", item, prop);
    const newObj: IMemberAdmin = SetProperty(selectedItem, prop, item.map((i) => i.name)) as IMemberAdmin;
    setSelectedItem(newObj)
  }
  const labelsFromRole = (): LabelType[] => {
    const lables: LabelType[] = Object.keys(Role).filter((v) => isNaN(Number(v))).
      map((name, index) => {
        return {
          name: name,
          color: Role[name as keyof typeof Role].toString(),
          description: name,
          _id: ""
        }
      })
    return lables;
  }

  const navLableItems = labelsFromRole();
  const getSelectedRoles = (): LabelType[] => {

    if (selectedItem !== undefined && selectedItem && selectedItem.role !== undefined) {
      const initial = selectedItem.role.roles.map((item) => {
        return item.toString();
      });
      const result = navLableItems.filter((item) => (initial.includes(item.name)))
      return result;

    }
    return [];
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("DeviceTabItem/handleChange", event.target.name, event.target.value)
    const newObj: IMemberAdmin = SetProperty(selectedItem, event.target.name, event.target.value) as IMemberAdmin;

    setSelectedItem(newObj)
  };
  return (
    <>
      <Grid container width={"100%"} height={"100%"} rowSpacing={2} columnSpacing={1} columns={12} alignContent={'start'}>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <MobileDatePicker
              label="Date of join"
              value={selectedItem?.date_of_join === null ? new Date() : selectedItem?.date_of_join}
              onChange={(newValue) => handleTimeChange(newValue, "date_of_join")}
              renderInput={(params) => <TextField {...params} fullWidth={true} />}
            />
          </LocalizationProvider>
        </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <MobileDatePicker
                label="Date of leave"
                value={selectedItem?.date_of_leave === null ? new Date() : selectedItem?.date_of_leave}
                onChange={(newValue) => handleTimeChange(newValue, "date_of_leave")}
                renderInput={(params) => <TextField {...params} fullWidth={true} />}
              />
            </LocalizationProvider>
          </Grid>
        <Grid item xs={12} sm={6}>
          <StatusCombo onChanged={(item) => onComboChanged(item, "status")} source={source} selectedItem={getSelectedItem(selectedItem?.status.toString())} />
        </Grid>
        <Grid item xs={12} sm={12}>

          <CheckSelect selectedItems={getSelectedRoles()} items={labelsFromRole()} onSelected={onRoleChanged} label={"Roles"} property={'role.roles'} />
        </Grid>


      </Grid>
    </>
  )
}

export default Permissions