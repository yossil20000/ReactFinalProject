import { Grid,  TextField } from '@mui/material'
import DeviceTypeEngienCombo from '../../../Components/Devices/DeviceTypeEngienCombo'
import  { useContext } from 'react'
import IDeviceType, {  } from '../../../Interfaces/API/IDeviceType'
import { getSelectedItem, setProperty } from '../../../Utils/setProperty'
import DeviceTypeSurfaceCombo from '../../../Components/Devices/DeviceTypeSurfaceCombo'
import DeviceTypeCategoryCombo from '../../../Components/Devices/DeviceTypeCategoryCombo'
import { DeviceTypesContext, DeviceTypesContextType } from '../../../app/Context/DeviceTypesContext'
import { InputComboItem } from '../../../Components/Buttons/ControledCombo';
import StatusCombo from '../../../Components/Buttons/StatusCombo';
const source: string = "DeviceTypeItem"


//emotion
/* const StyledFrom = styled.div`

& .MuiFormControl-root {
 
  width: 80%;
  background-color: pink;
  
}
` */


function DeviceTypeItem() {
  const { selectedItem, setSelectedItem } = useContext(DeviceTypesContext) as DeviceTypesContextType;


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("DeviceTabItem/handleChange", event.target.name, event.target.value)
    const newObj: IDeviceType = SetProperty(selectedItem, event.target.name, event.target.value) as IDeviceType;

    setSelectedItem(newObj)
  };
  const onComboChanged = (item: InputComboItem, prop:string): void => {
    console.log("DeviceTypeItem/onComboChanged/item", item, prop,selectedItem);
    const newObj: IDeviceType = SetProperty(selectedItem, prop, item.lable) as IDeviceType;
    setSelectedItem(newObj)
  }

  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    console.log("DeviceTypeItem/SetProperty/newobj", newObj)
    return newObj;
  }
  return (
 
      <Grid container width={"100%"} height={"100%"} rowSpacing={2} columnSpacing={1} columns={12}>
        <Grid item xs={12} sm={12} >
          <TextField onChange={handleChange} fullWidth={true} variant='standard' label="Type name" name="name" value={selectedItem?.name}/>
        </Grid>
        <Grid item xs={12} sm={12} >
        <TextField onChange={handleChange}  fullWidth={true} variant='standard' label="Description" name="description" value={selectedItem?.description}/>
        </Grid>
        <Grid item xs={12}  >
         <DeviceTypeCategoryCombo onChanged={(item) => onComboChanged(item,"category")} source={source} selectedItem={getSelectedItem(selectedItem?.category.toString())}/>
        </Grid>        
        <Grid item xs={12} >
         <DeviceTypeEngienCombo onChanged={(item) => onComboChanged(item,"class.engien")} source={source} selectedItem={getSelectedItem(selectedItem?.class.engien.toString())}/>
        </Grid>
        <Grid item xs={12}>
         <DeviceTypeSurfaceCombo onChanged={(item) => onComboChanged(item,"class.surface")} source={source} selectedItem={getSelectedItem(selectedItem?.class.surface.toString())}/>
        </Grid>
        <Grid item xs={12}>
         <StatusCombo onChanged={(item) => onComboChanged(item, "status")} source={source} selectedItem={getSelectedItem(selectedItem?.status.toString())} />
        </Grid>
      </Grid>
 
  )
}

export default DeviceTypeItem