import { Grid,  TextField,Theme,styled, Box } from '@mui/material'
import DeviceTypeEngienCombo from '../../../Components/Devices/DeviceTypeEngienCombo'
import { InputComboItem } from '../../../Components/Buttons/InputCombo'
import  { createContext, useState } from 'react'
import IDeviceType, { CategoryType, EngienType, SurfaceType } from '../../../Interfaces/API/IDeviceType'
import { useFetchAllDeviceTypesQuery } from '../../../features/DeviceTypes/deviceTypesApiSlice'
import useLocalStorage from '../../../hooks/useLocalStorage'
import DeviceTypesCombo from '../../../Components/Devices/DeviceTypesCombo'
import DeviceTypeItem from './DeviceTypeItem'

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
export type DeviceTypesContextType = {
  selected: IDeviceType | null | undefined;
  setSelected: React.Dispatch<React.SetStateAction<IDeviceType | null | undefined>>;
  items: IDeviceType[] | undefined
}
export const DeviceTypesContext = createContext<DeviceTypesContextType | null | undefined>(null)
function DeviceTypeTab() {

  const {data: items,isError,isLoading,isSuccess,error} = useFetchAllDeviceTypesQuery();
  const [selected, setSelected] = useLocalStorage<IDeviceType | null | undefined>('admin_selectedDeviceType',null);
  if(items?.data){
    console.log("DeviceTypeTab/items",items)
  }
  const onDeviceTypeChanged = (item: InputComboItem) => {
    const foundItem = items?.data.find((i) => item._id === i._id);
    if(foundItem && foundItem !== null) {
      setSelected(foundItem) ;
      console.log("onDeviceTypeChanged/foundItem",foundItem)
      
    }
      
  }

  return (
    <DeviceTypesContext.Provider value={{items: items?.data,selected:selected,setSelected: setSelected}}>
      <Box margin={2}>
      <Grid container width={"100%"} height={"100%"} gap={2}>
        <Grid item xs={12}>
        <DeviceTypesCombo onChanged={onDeviceTypeChanged}/>
        </Grid>
        
        <DeviceTypeItem/>
        </Grid>
      </Box>
    </DeviceTypesContext.Provider>
  )
}

export default DeviceTypeTab