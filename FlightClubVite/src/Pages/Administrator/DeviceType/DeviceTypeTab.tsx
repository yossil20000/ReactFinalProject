import { Grid, styled, Box } from '@mui/material'
import IDeviceType, { CategoryType, EngienType, SurfaceType } from '../../../Interfaces/API/IDeviceType'
import { useFetchAllDeviceTypesQuery } from '../../../features/DeviceTypes/deviceTypesApiSlice'
import useLocalStorage from '../../../hooks/useLocalStorage'
import DeviceTypesCombo from '../../../Components/Devices/DeviceTypesCombo'
import DeviceTypeItem from './DeviceTypeItem'
import { DeviceTypesContext } from '../../../app/Context/DeviceTypesContext'
import ActionButtons,{ EAction} from '../../../Components/Buttons/ActionButtons'
import { InputComboItem } from '../../../Components/Buttons/ControledCombo'
const source: string = "DeviceTypeTab"
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
const StyledGrid = styled(Grid)(({ theme }) => ({
  color: theme?.palette.primary.main,
}))

const inlineStyle = {
  fontSize: '1rem',
  backgroundColor: '#f5f5dc',

}

function DeviceTypeTab() {

  const { data: items, isError, isLoading, isSuccess, error } = useFetchAllDeviceTypesQuery();
  const [selected, setSelected] = useLocalStorage<IDeviceType | null | undefined>('_admin/DeviceTab/DeviceType', null);
  if (items?.data) {
    console.log("DeviceTypeTab/items", items)
  }
  const onDeviceTypeChanged = (item: InputComboItem) => {
    const foundItem = items?.data.find((i) => item._id === i._id);
    if (foundItem && foundItem !== null) {
      setSelected(foundItem);
      console.log("onDeviceTypeChanged/foundItem", foundItem)

    }

  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event?.defaultPrevented
    console.log("ActionButtons/onAction", event?.target, action)
  }
  return (
    <DeviceTypesContext.Provider value={{ deviceTypes: items?.data, selectedItem: selected, setSelectedItem: setSelected }}>
      <div className='yl__container' style={{ height: "100%", position: "relative" }}>
        <div className='header'>
          <Box marginTop={2}>
            <Grid container width={"100%"} height={"100%"} gap={2}>
              <Grid item xs={12}>
                <DeviceTypesCombo onChanged={onDeviceTypeChanged} source={source} />
              </Grid>

            </Grid>
          </Box>
        </div>
        <div className='main' style={{ overflow: "auto", height: "100%" }}>
        <Box marginTop={1}>
          <DeviceTypeItem />

        </Box>
      </div>
        <div className='footer' >

          <Box className='yl__action_button'>
            <ActionButtons OnAction={onAction}/>
          </Box>
        </div>
      </div>
 
      
    </DeviceTypesContext.Provider>
  )
}

export default DeviceTypeTab