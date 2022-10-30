import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel, Grid, Paper, styled, TextField, Typography } from '@mui/material'
import React, { useContext } from 'react'
import IDevice from '../../../Interfaces/API/IDevice'
import { DevicesContext, DevicesContextType } from './DeviceTab'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useId from '@mui/material/utils/useId'
import { setProperty } from '../../../Utils/setProperty'
import PriceMeterCombo from '../../../Components/Devices/PriceMeterCombo'
import { InputComboItem } from '../../../Components/Buttons/InputCombo'
import {  LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import DeviceStatusCombo from '../../../Components/Devices/DeviceStatusCombo'
import DeviceMTCombo from '../../../Components/Devices/DeviceMTCombo'
import DeviceFuelUnitCombo from '../../../Components/Devices/DeviceFuelUnitCombo'

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
  const handleBoolainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("DeviceTabItem/handleBoolainChange", event.target.name, event.target.checked)
    const newObj: IDevice = SetProperty(selectedItem, event.target.name, event.target.checked) as IDevice;

    setSelectedItem(newObj)
  };


  const onComboChanged = (item: InputComboItem, prop: string): void => {
    console.log("onComboChanged/item", item, prop);
    const newObj: IDevice = SetProperty(selectedItem, prop, item.lable) as IDevice;
    setSelectedItem(newObj)
  }
  const handleTimeChange = (newValue: Date | null | undefined, name:string) => {
    console.log(`handleTimeChange/newValue , key`, newValue, name);
    if (newValue === null || newValue === undefined)
      return;
      
      const newObj: IDevice = SetProperty(selectedItem, name, newValue) as IDevice;

      setSelectedItem(newObj)
  };
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
              <TextField onChange={handleChange} id="device_id" name="device_id"
                label="Device Id" placeholder="4xcgc" variant="standard"
                value={selectedItem?.device_id} required
                helperText="Helper" error />
            </Grid>
            <Grid item xs={1}>
              <TextField onChange={handleChange} id="description" name="description"
                label="Description" placeholder="description" variant="standard"
                value={selectedItem?.description} required
                helperText="Helper" error multiline />
            </Grid>
            <Grid item xs={1}>
              <Item>
                <TextField onChange={handleChange} id="hobbs_meter" label="Hobbs"
                  name="hobbs_meter" placeholder="Hobbs meter" variant="standard"
                  value={selectedItem?.hobbs_meter} />
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
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="general-content" id="general-header">
          <Grid container spacing={0.5} padding={1} columns={{ xs: 2 }}>
            <Grid item xs={2}>
              <Typography sx={{ width: "100%", flexShrink: 0 }}>Status Next Service: {selectedItem?.maintanance.next_meter} ({selectedItem?.engien_meter})</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={0.5} padding={1} columns={{ xs: 2, sm: 2 }}>
            <Grid item xs={1}>
              <LocalizationProvider dateAdapter={AdapterLuxon}>
                <MobileDatePicker
                 
                  label="Next Service"
                  value={selectedItem?.due_date === null ? new Date() : selectedItem?.due_date}
                  onChange={(newValue) => handleTimeChange(newValue,"due_date")}
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
              <DeviceStatusCombo onChanged={(item) => onComboChanged(item, "device_status")} />
            </Grid>
            <Grid item xs={1}>
              <TextField disabled id="Device Status" name="device_status"
                label="Device Status" placeholder="Device Status" variant="standard"
                value={selectedItem?.device_status} required
                helperText="Helper" error multiline />
            </Grid>
            <Grid item xs={1}>
              <DeviceMTCombo onChanged={(item) => onComboChanged(item, "maintanance.type")} />
            </Grid>
            <Grid item xs={1}>
              <TextField disabled id="Service Type" name="maintanance.type"
                label="Service Type" placeholder="Service Type" variant="standard"
                value={selectedItem?.maintanance.type} required
                helperText="Helper" error multiline />
            </Grid>
          </Grid>
          <Grid item xs={1} justifySelf={"center"} alignSelf={"center"}>
            <FormControlLabel control={<Checkbox onChange={handleBoolainChange} name={"available"} checked={selectedItem?.available} sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }} />} label="Available" />
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="general-content" id="general-header">
          <Grid container spacing={0.5} padding={1} columns={{ xs: 2 }}>
            <Grid item xs={1}>
              <Typography sx={{ width: "40%", flexShrink: 0 }}>Property</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>

        <AccordionDetails>
          <Grid container spacing={0.5} padding={1} columns={{ xs: 2 }}>
            <Grid item xs={1}>
              <PriceMeterCombo onChanged={(item) => onComboChanged(item, "price.meter")} />
            </Grid>
            <Grid item xs={1}>
              <TextField disabled name="price.meter" label="Price Method" placeholder="Price Method" variant="standard" value={selectedItem?.price.meter} />
            </Grid>
            <Grid item xs={1}>
              <TextField onChange={handleChange} required name="price.base" label="Base Price" placeholder="Base price" variant="standard"
                value={selectedItem?.price.base} helperText="Helper" />
            </Grid>
            <Grid item xs={1}>
              <TextField onChange={handleChange} required name="details.seats" label="Seats" placeholder="Seats" variant="standard"
                value={selectedItem?.details.seats} helperText="Helper" />
            </Grid>
            <Grid container spacing={0.5} padding={1} columns={{ xs: 3 }}>
            <Grid item xs={1}>
              <DeviceFuelUnitCombo onChanged={(item) => onComboChanged(item, "details.fuel.units")} />
            </Grid>
            <Grid item xs={1}>
              <TextField disabled name="details.fuel.units" label="Fuel Units" placeholder="Fuel Units" variant="standard" value={selectedItem?.details.fuel.units} />
            </Grid>
            <Grid item xs={1}>
              <TextField  onChange={handleChange} name="details.fuel.quantity" label="Fuel Quantity" placeholder="Fuel Units" variant="standard" value={selectedItem?.details.fuel.quantity} />
            </Grid>
            </Grid>
            <Grid item xs={1}>
              <TextField  onChange={handleChange} name="details.color" label="Color" placeholder="Fuel Units" variant="standard" value={selectedItem?.details.color} />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  )
}

export default DeviceTabItem