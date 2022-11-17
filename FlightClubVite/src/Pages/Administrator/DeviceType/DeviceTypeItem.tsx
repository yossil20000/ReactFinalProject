import { Grid,  TextField,Theme,styled } from '@mui/material'
import DeviceTypeEngienCombo from '../../../Components/Devices/DeviceTypeEngienCombo'
import  { useContext, useState } from 'react'
import IDeviceType, { CategoryType, EngienType, SurfaceType } from '../../../Interfaces/API/IDeviceType'
import { useFetchAllDeviceTypesQuery } from '../../../features/DeviceTypes/deviceTypesApiSlice';
import { getSelectedItem, setProperty } from '../../../Utils/setProperty'
import DeviceTypeSurfaceCombo from '../../../Components/Devices/DeviceTypeSurfaceCombo'
import DeviceTypeCategoryCombo from '../../../Components/Devices/DeviceTypeCategoryCombo'
import { DeviceTypesContext, DeviceTypesContextType } from '../../../app/Context/DeviceTypesContext'
import { InputComboItem } from '../../../Components/Buttons/ControledCombo';
const source: string = "DeviceTypeItem"
const initialValues: IDeviceType = {
  _id: "",
  name: '',
  category: CategoryType.Airplane,
  class: {
    engien: EngienType.SingleEngien,
    surface: SurfaceType.Land
  },
  description: ''
}


//emotion
/* const StyledFrom = styled.div`

& .MuiFormControl-root {
 
  width: 80%;
  background-color: pink;
  
}
` */
const StyledGrid = styled(Grid)(({theme}) => ({
color: theme?.palette.primary.main,
}))

const inlineStyle = {
  fontSize: '1rem',
  backgroundColor: '#f5f5dc',

}

function DeviceTypeItem() {
  const { selectedItem, setSelectedItem } = useContext(DeviceTypesContext) as DeviceTypesContextType;


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("DeviceTabItem/handleChange", event.target.name, event.target.value)
    const newObj: IDeviceType = SetProperty(selectedItem, event.target.name, event.target.value) as IDeviceType;

    setSelectedItem(newObj)
  };
  const onComboChanged = (item: InputComboItem, prop:string): void => {
    console.log("onComboChanged/item", item, prop);
    const newObj: IDeviceType = SetProperty(selectedItem, prop, item.lable) as IDeviceType;
    setSelectedItem(newObj)
  }

  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    console.log("SetProperty/newobj", newObj)
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
      </Grid>
 
  )
}

export default DeviceTypeItem