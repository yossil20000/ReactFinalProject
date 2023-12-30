import { Grid } from "@mui/material"
import { Box } from "@mui/system"
import DevicesCombo from "../../../Components/Devices/DevicesCombo"
import { IValidationAlertProps, ValidationAlert } from "../../../Components/Buttons/TransitionAlert"
import { useState } from "react";
import { InputComboItem } from "../../../Components/Buttons/ControledCombo";
import ServicesTable from "../../../Components/Sevices/ServicesTable";
const source: string = "ServicesTab"

function ServicesTab() {
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<InputComboItem | null>(null)
  const onDeviceChange = (item: InputComboItem) => {
    /* const foundItem = devices?.find((i) => item._id === i._id);
    if (foundItem && foundItem !== null) {
      setSelectedDevice(foundItem);
      CustomLogger.info("DeviceTab/onDeviceChange/foundItem", foundItem)

    }
    else {
      setSelectedDevice(null);
    } */
    setSelectedDevice(item);
  }
  return (
    <div className='yl__container' style={{ height: "100%", position: "relative" }}>
      <div className='header'>
        <Box marginTop={2}>
          <Grid container width={"100%"} height={"100%"} gap={2}>
            <Grid item xs={12}>
              <DevicesCombo onChanged={onDeviceChange} source={source} />
            </Grid>
            
          </Grid>
        </Box>
      </div>
      <div className='main' style={{ overflow: "auto", height: "100%" }}>
      <ServicesTable selectedDevice={selectedDevice} />
      </div>
      <div className='footer' >
        <Grid container>
          {validationAlert.map((item) => (
            <Grid item xs={12}>
              <ValidationAlert {...item} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  )
}

export default ServicesTab