import { Grid,  TextField,Theme,styled } from '@mui/material'
import DeviceTypeEngienCombo from '../../../Components/Devices/DeviceTypeEngienCombo'
import { InputComboItem } from '../../../Components/Buttons/InputCombo'
import  { useContext, useState } from 'react'
import IDeviceType, { CategoryType, EngienType, SurfaceType } from '../../../Interfaces/API/IDeviceType'
import { useFetchAllDeviceTypesQuery } from '../../../features/DeviceTypes/deviceTypesApiSlice'
import { DeviceTypesContext, DeviceTypesContextType } from './DeviceTypeTab'
import { setProperty } from '../../../Utils/setProperty'
import DeviceTypeSurfaceCombo from '../../../Components/Devices/DeviceTypeSurfaceCombo'
import DeviceTypeCategoryCombo from '../../../Components/Devices/DeviceTypeCategoryCombo'

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
  const { selected, setSelected } = useContext(DeviceTypesContext) as DeviceTypesContextType;


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("DeviceTabItem/handleChange", event.target.name, event.target.value)
    const newObj: IDeviceType = SetProperty(selected, event.target.name, event.target.value) as IDeviceType;

    setSelected(newObj)
  };
  const onComboChanged = (item: InputComboItem, prop:string): void => {
    console.log("onComboChanged/item", item, prop);
    const newObj: IDeviceType = SetProperty(selected, prop, item.lable) as IDeviceType;
    setSelected(newObj)
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
          <TextField onChange={handleChange} fullWidth={true} variant='standard' label="Type name" name="name" value={selected?.name}/>
        </Grid>
        <Grid item xs={12} sm={12} >
        <TextField onChange={handleChange}  fullWidth={true} variant='standard' label="Description" name="description" value={selected?.description}/>
        </Grid>
        <Grid item xs={12}>
         <DeviceTypeCategoryCombo onChanged={(item) => onComboChanged(item,"category")}/>
        </Grid>        
        <Grid item xs={12}>
         <DeviceTypeEngienCombo onChanged={(item) => onComboChanged(item,"class.engien")}/>
        </Grid>
        <Grid item xs={12}>
         <DeviceTypeSurfaceCombo onChanged={(item) => onComboChanged(item,"class.surface")}/>
        </Grid>
      </Grid>
 
  )
}

export default DeviceTypeItem