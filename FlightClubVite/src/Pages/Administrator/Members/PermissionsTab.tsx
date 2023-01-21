import { Grid, TextField } from "@mui/material"
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { useCallback, useContext, useMemo } from "react";
import { MembersContext, MembersContextType } from "../../../app/Context/MemberContext";
import CheckSelect from "../../../Components/Buttons/CheckSelect";
import { InputComboItem } from "../../../Components/Buttons/ControledCombo"
import { LabelType } from "../../../Components/Buttons/MultiOptionCombo";
import StatusCombo from "../../../Components/Buttons/StatusCombo";
import MembershipCombo from "../../../Components/Membership/MembershipCombo";
import { IMemberAdmin, Role, Status } from "../../../Interfaces/API/IMember";
import { getSelectedItem, setProperty } from "../../../Utils/setProperty";
const source = "admin/member/general"

const SetProperty = (obj: any, path: string, value: any): any => {
  let newObj = { ...obj };
  newObj = setProperty(newObj, path, value);
  console.log("SetProperty/newobj", newObj)
  return newObj;
}
function PermissionsTab() {

  const { setSelectedItem: setSelectedMember, selectedItem : selectedMember, members } = useContext(MembersContext) as MembersContextType;
  const getSelectedMemberMemberShip = useMemo(() : InputComboItem => {
    console.log("PermissionsTab/getSelectedMemberMemberShip",selectedMember)  
    let initialMembership : InputComboItem = {
        _id: selectedMember?.membership ?  selectedMember?.membership._id : "",
        lable: "",
        description: ""
      }
      console.log("PermissionsTab/getSelectedMemberMemberShip/initial",initialMembership) 
      return initialMembership;
  },[selectedMember])
  const handleTimeChange = useCallback((newValue: Date | null | undefined, name: string) => {
    console.log(`handleTimeChange/newValue , key`, newValue, name);
    if (newValue === null || newValue === undefined)
      return;
    const newObj: IMemberAdmin = SetProperty(selectedMember, name, newValue) as IMemberAdmin;
    setSelectedMember(newObj)
  },[selectedMember]);
  const onComboChanged = useCallback((item: InputComboItem, prop: string): void => {
    console.log("/item", item, prop);
    const newObj: IMemberAdmin = SetProperty(selectedMember, prop, item.lable) as IMemberAdmin;
    setSelectedMember(newObj)
  },[selectedMember])

  const onRoleChanged = useCallback((item: LabelType[], prop: string): void => {
    console.log("onComboChanged/item", item, prop);
    const newObj: IMemberAdmin = SetProperty(selectedMember, prop, item.map((i) => i.name)) as IMemberAdmin;
    setSelectedMember(newObj)
  },[selectedMember]);

  const labelsFromRole = useCallback((): LabelType[] => {
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
  },[])

  const getSelectedRoles = useCallback((): LabelType[] => {

    if (selectedMember !== undefined && selectedMember && selectedMember.role !== undefined) {
      const initial = selectedMember.role.roles.map((item) => {
        return item.toString();
      });
      const result = labelsFromRole().filter((item) => (initial.includes(item.name)))
      return result;

    }
    return [];
  },[labelsFromRole,selectedMember?.role])
 
  const onMemberShipChanged = useCallback((item: InputComboItem) => {
    const newObj: IMemberAdmin = SetProperty(selectedMember, "membership.rank", item.lable) as IMemberAdmin;
    setSelectedMember(newObj)
    console.log("onMemberShipChanged",newObj)
  },[selectedMember])
  return (
    <>
      <Grid container width={"100%"} height={"100%"} rowSpacing={2} columnSpacing={1} columns={12} alignContent={'start'}>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <MobileDatePicker
              label="Date of join"
              value={selectedMember?.date_of_join === null ? new Date() : selectedMember?.date_of_join}
              onChange={(newValue) => handleTimeChange(newValue, "date_of_join")}
              renderInput={(params) => <TextField {...params} fullWidth={true} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} display={selectedMember?.status === Status.Active ? "none" : ""}>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <MobileDatePicker
              label="Date of leave"
              value={selectedMember?.date_of_leave === null ? new Date() : selectedMember?.date_of_leave}
              onChange={(newValue) => handleTimeChange(newValue, "date_of_leave")}
              renderInput={(params) => <TextField {...params} fullWidth={true} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatusCombo onChanged={(item) => onComboChanged(item, "status")} source={source} selectedItem={getSelectedItem(selectedMember?.status === undefined ? "" : selectedMember?.status.toString())} />
        </Grid>
        <Grid item xs={12} sm={12}>

          <CheckSelect selectedItems={getSelectedRoles()} items={labelsFromRole()} onSelected={onRoleChanged} label={"Roles"} property={'role.roles'} />
        </Grid>
        <Grid item xs={12} sm={12}>
          <MembershipCombo onChanged={onMemberShipChanged} source={"Permission/MembershipCombo"} selectedItem={getSelectedMemberMemberShip}/>
        </Grid>

      </Grid>
    </>
  )
}

export default PermissionsTab