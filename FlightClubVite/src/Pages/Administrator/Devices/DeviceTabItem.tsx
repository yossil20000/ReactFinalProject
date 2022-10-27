import { ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Grid, Paper, styled, TextField, Typography } from '@mui/material'
import React, { useContext } from 'react'
import IDevice from '../../../Interfaces/API/IDevice'
import { DevicesContext, DevicesContextType } from './DeviceTab'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useId from '@mui/material/utils/useId'
import { setProperty, SetObjPro } from '../../../Utils/setProperty'
import PriceMeterCombo from '../../../Components/Devices/PriceMeterCombo'
import { InputComboItem } from '../../../Components/Buttons/InputCombo'
import { DatePicker, LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import DeviceStatusCombo from '../../../Components/Devices/DeviceStatusCombo'
export type DeviceTabItemProps = {
  item: React.RefObject<IDevice> | null
}
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function DeviceTabItem() {
  const id = useId();
  const { setSelectedItem, selectedItem } = useContext(DevicesContext) as DevicesContextType;

  console.log("DeviceTabItem/deviceItem.current", selectedItem?.description);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("DeviceTabItem/handleChange", event.target.name, event.target.value)
    const newObj: IDevice = SetProperty(selectedItem, event.target.name, event.target.value) as IDevice;

    setSelectedItem(newObj)
  };
  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    console.log("SetProperty/newobj", newObj)
    return newObj;
  }
  const onPriceComboChanged = (item: InputComboItem): void => {
    console.log("onPriceComboChanged/item", item);
    const newObj: IDevice = SetProperty(selectedItem, "price.meter", item.lable) as IDevice;
    setSelectedItem(newObj)
  }
  const onDeviceStatusComboChanged = (item: InputComboItem): void => {
    console.log("onPriceComboChanged/item", item);
    const newObj: IDevice = SetProperty(selectedItem, "device_status", item.lable) as IDevice;
    setSelectedItem(newObj)
  }
  return (
    <>
      <Accordion >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="general-content"
          id="general-header"
        ><Grid container spacing={0.5} padding={1} columns={{ xs: 2 }}>
            <Grid item xs={2}>
              <Typography sx={{ width: "100%", flexShrink: 0 }}>General Device {selectedItem?.device_id}</Typography>
            </Grid>
          </Grid>



        </AccordionSummary>

        <AccordionDetails>

          <Grid container spacing={0.5} padding={1} columns={{ xs: 2, md: 4 }}>

            <Grid item xs={1}>
              <TextField
                required
                error
                id="device_id"
                name="device_id"
                label="Device Id"
                placeholder="4xcgc"
                variant="standard"
                value={selectedItem?.device_id}
                helperText="Helper"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
                required
                error
                id="description"
                name="description"
                label="Description"
                placeholder="description"
                variant="standard"
                value={selectedItem?.description}
                helperText="Helper"
                onChange={handleChange}
                multiline
              />
            </Grid><Grid item xs={1}>
              <Item>
                <TextField
                  id="hobbs_meter"
                  label="Hobbs"
                  name="hobbs_meter"
                  placeholder="Hobbs meter"
                  value={selectedItem?.hobbs_meter}
                  variant="standard"
                  onChange={handleChange}
                />
              </Item>
            </Grid>
            <Grid item xs={1}>
              <Item>
                <TextField
                  id="engien_meter"
                  label="Engien"
                  name="engien_meter"
                  placeholder="Engien meter"
                  value={selectedItem?.engien_meter}
                  variant="standard"
                  onChange={handleChange}
                />
              </Item>
            </Grid>
            <Grid item xs={1}>
              <Item>
                <TextField
                  id="hobbs_meter"
                  label="Hobbs"
                  name="hobbs_meter"
                  placeholder="Hobbs meter"
                  value={selectedItem?.hobbs_meter}
                  variant="standard"
                  onChange={handleChange}
                />
              </Item>
            </Grid>
            <Grid item xs={1}>
              <Item>
                <TextField
                  id="hobbs_meter"
                  label="Hobbs"
                  name="hobbs_meter"
                  placeholder="Hobbs meter"
                  value={selectedItem?.hobbs_meter}
                  variant="standard"
                  onChange={handleChange}
                />
              </Item>
            </Grid>
            <Grid item xs={1}>
              <Item>
                <TextField
                  id="hobbs_meter"
                  label="Hobbs"
                  name="hobbs_meter"
                  placeholder="Hobbs meter"
                  value={selectedItem?.hobbs_meter}
                  variant="standard"
                />
              </Item>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="general-content"
          id="general-header"
        ><Grid container spacing={0.5} padding={1} columns={{ xs: 2 }}>
            <Grid item xs={2}>
              <Typography sx={{ width: "100%", flexShrink: 0 }}>Status Next Service: {selectedItem?.maintanance.next_meter} ({selectedItem?.engien_meter})</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={0.5} padding={1} columns={{ xs: 2, md: 4 }}>
            <Grid item xs={1}>
            <DeviceStatusCombo onChanged={onDeviceStatusComboChanged}/>
              <TextField
                required
                error
                id="next_meter"
                name="maintanance.next_meter"
                label="Next meter"
                placeholder="Next maintanance"
                variant="standard"
                value={selectedItem?.maintanance.next_meter}
                helperText="Helper"
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={1}>
              
              <LocalizationProvider dateAdapter={AdapterLuxon}>
                <MobileDatePicker
                  label="Next Service"
                  value={selectedItem?.due_date === null ? new Date() : selectedItem?.due_date }
                  onChange={()=> {}}
                  renderInput={(params) => <TextField {...params} />}
                />
                </LocalizationProvider>
              
            </Grid>
            <Grid item xs={1}>
            <TextField
                required
                error
                id="next_meter"
                name="maintanance.next_meter"
                label="Next meter"
                placeholder="Next maintanance"
                variant="standard"
                value={selectedItem?.maintanance.next_meter}
                helperText="Helper"
                onChange={handleChange}
              />
                
             
            </Grid>
            <Grid item xs={1}>
              <Item>
                <TextField
                  id="hobbs_meter"
                  label="Hobbs"
                  name="hobbs_meter"
                  placeholder="Hobbs meter"
                  value={selectedItem?.hobbs_meter}
                  variant="standard"
                  onChange={handleChange}
                />
              </Item>
            </Grid>
            <Grid item xs={1}>
              <Item>
                <TextField
                  id="hobbs_meter"
                  label="Hobbs"
                  name="hobbs_meter"
                  placeholder="Hobbs meter"
                  value={selectedItem?.hobbs_meter}
                  variant="standard"
                  onChange={handleChange}
                />
              </Item>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="general-content"
          id="general-header"
        ><Grid container spacing={0.5} padding={1} columns={{ xs: 2 }}>
            <Grid item xs={1}>
              <Typography sx={{ width: "40%", flexShrink: 0 }}>Property</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>

        <AccordionDetails>
          <Grid container spacing={0.5} padding={1} columns={{ xs: 2, md: 4 }}>
            <Grid item xs={2}>

              <PriceMeterCombo onChanged={onPriceComboChanged} />
            </Grid>
            <Grid item xs={1}>
              <TextField
                required
                name="price.base"
                label="Base Price"
                placeholder="Base price"
                variant="standard"
                value={selectedItem?.price.base}
                helperText="Helper"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
                required
                disabled
                name="price.base"
                label="Base Price"
                placeholder="Price Method"
                variant="standard"
                value={selectedItem?.price.meter}

              />
            </Grid>
            <Grid item xs={1}>
              <Item>
                <TextField
                  id="hobbs_meter"
                  label="Hobbs"
                  name="hobbs_meter"
                  placeholder="Hobbs meter"
                  value={selectedItem?.hobbs_meter}
                  variant="standard"
                  onChange={handleChange}
                />
              </Item>
            </Grid>
            <Grid item xs={1}>
              <Item>
                <TextField
                  id="engien_meter"
                  label="Engien"
                  name="engien_meter"
                  placeholder="Engien meter"
                  value={selectedItem?.engien_meter}
                  variant="standard"
                  onChange={handleChange}
                />
              </Item>
            </Grid>
            <Grid item xs={1}>
              <Item>
                <TextField
                  id="hobbs_meter"
                  label="Hobbs"
                  name="hobbs_meter"
                  placeholder="Hobbs meter"
                  value={selectedItem?.hobbs_meter}
                  variant="standard"
                  onChange={handleChange}
                />
              </Item>
            </Grid>
            <Grid item xs={1}>
              <Item>
                <TextField
                  id="hobbs_meter"
                  label="Hobbs"
                  name="hobbs_meter"
                  placeholder="Hobbs meter"
                  value={selectedItem?.hobbs_meter}
                  variant="standard"
                  onChange={handleChange}
                />
              </Item>
            </Grid>
            <Grid item xs={1}>
              <Item>
                <TextField
                  id="hobbs_meter"
                  label="Hobbs"
                  name="hobbs_meter"
                  placeholder="Hobbs meter"
                  value={selectedItem?.hobbs_meter}
                  variant="standard"
                  onChange={handleChange}
                />
              </Item>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  )
}

export default DeviceTabItem