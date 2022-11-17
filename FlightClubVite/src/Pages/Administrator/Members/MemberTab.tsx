import { Box, Paper } from '@mui/material'
import React from 'react'
import ActionButtons, { EAction } from '../../../Components/Buttons/ActionButtons';
import ScrollableTabs, { ScrollableTabsItem } from '../../../Components/Buttons/ScrollableTabs'

const items: ScrollableTabsItem[] = [
  { id: 0, label: "General" },
  { id: 1, label: "Address" },
  { id: 2, label: "Permissions" },
  { id: 3, label: "dd" }

];

function MemberTab() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    console.log("MemberPage/newValue", newValue)
  }
  function onAction(action: EAction , event?:React.MouseEvent<HTMLButtonElement, MouseEvent> ) {
    event?.defaultPrevented
    console.log("ActionButtons/onAction", event?.target ,action)
  }
  return (
    <div className='yl__container' style={{ height: "100%", position: "relative" }}>
      <div className='header'>
        <Box marginTop={1}>
          <ScrollableTabs items={items} value={value} setValue={setValue} handleChange={handleChange} />

        </Box>
      </div>
      <div className='main' style={{ overflow: "auto" ,height:"100%"}}>
        <Box marginTop={1} height={"100%"} >

          {value === 0 && <>Genneral </>}
          {value === 1 && (<>Address</>)}
          {value === 2 && (<>Permissions</>)}
          {value === 3 && (<>dd</>)}
        </Box>

      </div>
      <div className='footer'>

      <Box className='yl__action_button'>
            <ActionButtons OnAction={onAction}/>
          </Box>
      </div>
    </div>
  )
}

export default MemberTab