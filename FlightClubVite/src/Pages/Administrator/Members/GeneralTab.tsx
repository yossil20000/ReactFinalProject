import { Grid, TextField } from "@mui/material"
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { useContext } from "react";
import { DevicesContext, DevicesContextType } from "../../../app/Context/DevicesContext";
import { MembersContext, MembersContextType } from "../../../app/Context/MemberContext";
import { InputComboItem } from "../../../Components/Buttons/ControledCombo"
import GenderCombo from "../../../Components/Buttons/GenderCombo";
import { LabelType } from "../../../Components/Buttons/MultiOptionCombo";
import { IMemberAdmin,  Role } from "../../../Interfaces/API/IMember";
import { setProperty } from "../../../Utils/setProperty";
const source = "admin/member/general"

const SetProperty = (obj: any, path: string, value: any): any => {
  let newObj = { ...obj };
  newObj = setProperty(newObj, path, value);
  console.log("SetProperty/newobj", newObj)
  return newObj;
}
function GeneralTab() {
  
  const { setSelectedItem, selectedItem} = useContext(MembersContext) as MembersContextType;
   

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
        <Grid item xs={12} sm={6}>
          <TextField  onChange={handleChange} name="first_name" fullWidth value={selectedItem?.first_name} variant={"standard"}  label={"First Name"} InputLabelProps={{ shrink: true }}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField onChange={handleChange} name="family_name" fullWidth value={selectedItem?.family_name} variant={"standard"}  label={"Famaily Name"} InputLabelProps={{ shrink: true }}/>
        </Grid>
        <Grid item xs={12} sm={6}>
        <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterLuxon}>
                <MobileDatePicker
                  label="Date Of Birth"
                  value={selectedItem?.date_of_birth === null ? new Date() : selectedItem?.date_of_birth}
                  onChange={(newValue) => handleTimeChange(newValue, "date_of_birth")}
                  renderInput={(params) => <TextField {...params} fullWidth={true} />}
                />
              </LocalizationProvider>
            </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField onChange={handleChange} name="member_id" fullWidth value={selectedItem?.member_id} variant={"standard"}  label={"Member Id"} InputLabelProps={{ shrink: true }}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField onChange={handleChange} name="contact.email" fullWidth value={selectedItem?.contact?.email} variant={"standard"}  label={"email"} InputLabelProps={{ shrink: true }}/> 
        </Grid>
        <Grid item xs={12} >
          <GenderCombo onChanged={(item) => onComboChanged(item, "gender")} source={source} 
          selectedItem={{lable: selectedItem?.gender === undefined ? "" : selectedItem?.gender.toString() ,_id: "",description: ""}}/>
        </Grid>
        <Grid item xs={12}>

        </Grid>

      </Grid>
    </>
  )
}

export default GeneralTab