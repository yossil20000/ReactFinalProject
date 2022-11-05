import { Box, Paper } from '@mui/material'
import React from 'react'
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
  return (

    <Box  marginTop={1} height={"100%"} >
      <ScrollableTabs items={items} value={value} setValue={setValue} handleChange={handleChange} />

      {value === 0 && <>Genneral </>}
        {value === 1 && (<>Address</>)}
        {value === 2 && (<>Permissions</>)}
        {value === 3 && (<>dd</>)}
    </Box>
  )
}

export default MemberTab