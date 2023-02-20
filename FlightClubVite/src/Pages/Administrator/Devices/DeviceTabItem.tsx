import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControlLabel, Grid, Paper, styled, TextField, Typography } from '@mui/material'
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import IDevice, { DEVICE_INS, DEVICE_MET } from '../../../Interfaces/API/IDevice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getSelectedItem, setProperty } from '../../../Utils/setProperty'
import PriceMeterCombo from '../../../Components/Devices/PriceMeterCombo'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import DeviceStatusCombo from '../../../Components/Devices/DeviceStatusCombo'
import DeviceMTCombo from '../../../Components/Devices/DeviceMTCombo'
import DeviceFuelUnitCombo from '../../../Components/Devices/DeviceFuelUnitCombo'
import { LabelType } from '../../../Components/Buttons/MultiOptionCombo';
import DeviceTypesCombo, { deviceTypeToItemCombo } from '../../../Components/Devices/DeviceTypesCombo';
import { DevicesContext, DevicesContextType } from '../../../app/Context/DevicesContext';
import { DeviceTypesContext, DeviceTypesContextType } from '../../../app/Context/DeviceTypesContext';
import MultiOptionCombo from '../../../Components/Buttons/MultiOptionCombo';
import { InputComboItem } from '../../../Components/Buttons/ControledCombo';
import IDeviceType from '../../../Interfaces/API/IDeviceType';
import StatusCombo from '../../../Components/Buttons/StatusCombo';
import { blue } from '@mui/material/colors';
import { resizeFileTobase64 } from '../../../Utils/files';
const source: string = "DeviceTabItem"
const labelsFromDEVICE_INS = (): LabelType[] => {
  const lables: LabelType[] = Object.keys(DEVICE_INS).filter((v) => isNaN(Number(v))).
    map((name, index) => {
      return {
        name: name,
        color: DEVICE_INS[name as keyof typeof DEVICE_INS].toString(),
        description: name,
        _id: index.toString()
      }
    })
  return lables;
}
const navLableItems = labelsFromDEVICE_INS();


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function DeviceTabItem() {
  

  const { setSelectedItem, selectedItem ,membersCombo} = useContext(DevicesContext) as DevicesContextType;
  const { selectedItem: selectdDeviceTypes, setSelectedItem: setSelectedDeviceTypes, deviceTypes } = useContext(DeviceTypesContext) as DeviceTypesContextType
 
  const memberCanReserve = useMemo(() : (LabelType[] ) => {
      const labels : (LabelType[] | undefined) = membersCombo?.map((item,index) => ({_id: item._id,name: `${item.family_name} ${item.member_id}`, description: "", color: blue[700]} ));
      console.log("memberCanReserve/labels",labels)
      if(labels === undefined || labels === null)
        return []
      return labels;
  },[membersCombo])
 

  console.log("DeviceTabItem/deviceItem.CanReserve", selectedItem?.can_reservs);
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

  const handleHasHobbsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("DeviceTabItem/handleHasHobbsChange", event.target.name, event.target.checked)
    let newObj: IDevice = SetProperty(selectedItem, event.target.name, event.target.checked) as IDevice;
    if(!event.target.checked){
      /* newObj.price.meter = DEVICE_MET.ENGIEN */
      newObj = SetProperty(newObj,"price.meter",  DEVICE_MET.ENGIEN) as IDevice;
    }
    setSelectedItem(newObj)
  };
  const onComboChanged = (item: InputComboItem, prop: string): void => {
    console.log("onComboChanged/item", item, prop);
    const newObj: IDevice = SetProperty(selectedItem, prop, item.lable) as IDevice;
    setSelectedItem(newObj)
  }
  const onComboPriceMethodChanged = (item: InputComboItem, prop: string): void => {
    console.log("onComboPriceMethodChanged/item", item, prop);
    
    if(!selectedItem?.has_hobbs && item.lable === DEVICE_MET.HOBBS) 
   {
    const newObj: IDevice = SetProperty(selectedItem, prop, DEVICE_MET.HOBBS) as IDevice;
    setSelectedItem(newObj)
   }
   else{
    const newObj: IDevice = SetProperty(selectedItem, prop, item.lable) as IDevice;
    setSelectedItem(newObj)
   }
    
  }
  const handleTimeChange = (newValue: Date | null | undefined, name: string) => {
    console.log(`handleTimeChange/newValue , key`, newValue, name);
    if (newValue === null || newValue === undefined)
      return;

    const newObj: IDevice = SetProperty(selectedItem, name, newValue) as IDevice;

    setSelectedItem(newObj)
  };
  const onSelecteAditionaSystem = (items: LabelType[], property: string) => {
    console.log("onSelecteAditionaSystem/items", items);
    const newValues = items.map((item) => (
      item.name
    )) as DEVICE_INS[];
    console.log("onSelecteAditionaSystem/newValues", newValues);
    const newObj: IDevice = SetProperty(selectedItem, property, newValues) as IDevice;

    setSelectedItem(newObj)
  }
  const onSelecteCanReserv = (items: LabelType[],property:string) => {
    console.log("onSelecteCanReserv/CanReserve/property", property);
    console.log("onSelecteCanReserv/CanReserve/items", items);
    const newValues = items.map((item) => (
      item._id
    )) as string[];
    console.log("onSelecteCanReserv/CanReserve/newValues", newValues);
    const newObj: IDevice = SetProperty(selectedItem, property, newValues) as IDevice;
    console.log("onSelecteCanReserv/CanReserve/newObj", newObj);
    setSelectedItem(newObj)
  }
  const getSelectedInstrument = (): LabelType[] => {

    if (selectedItem !== undefined && selectedItem) {
      const initial = selectedItem.details.instruments.map((item) => {
        return item.toString();
      });
      const result = navLableItems.filter((item) => (initial.includes(item.name)))
      return result;

    }
    return [];
  }
  const getSelectedCanreserve = (): LabelType[] => {
    let canReserve : string[] = [];
    console.log("getSelectedCanreserve/CanReserve(); selected.canreserv",memberCanReserve,selectedItem?.can_reservs)
    if (selectedItem !== undefined && selectedItem && selectedItem.can_reservs !== undefined) {
      
      
      const initial = selectedItem?.can_reservs.map((item) => {
        if( typeof item === 'string')
         return item;
         return ''
      });
      console.log("getSelectedCanreserve/CanReserve/initial",initial)
      const result = memberCanReserve.filter((item) => (initial.includes(item._id)))
      console.log("getSelectedCanreserve/CanReserve/result",result)
      return result;

    }
    return [];
  }
 
 
  const onDeviceTypeChanged = (item: InputComboItem) => {
    const foundItem = deviceTypes?.find((i) => item._id === i._id);
    if (foundItem && foundItem !== null) {
      setSelectedDeviceTypes(foundItem);
      console.log("onDeviceTypeChanged/foundItem", foundItem)
      const newObj: IDevice = SetProperty(selectedItem, "device_type", foundItem._id) as IDevice;

      setSelectedItem(newObj)
    }

  }

/*   const getSelectedItem = (property: any) : InputComboItem => {
    const prop : string = selectedItem?[property].toString() : "";
    const selected : InputComboItem = {
      lable: selectedItem?[property].toString() : "",
      _id: "",
      description: ""}
      return selected;
  } */
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : "";
    console.log("PersonalInfo/handleImageChange/file", file);
    if (file) {
      /* const base64 = await convertFileTobase64(file); */
      await resizeFileTobase64(file, 300).then((result) => {
        console.log("PersonalInfo/handleImageChange/result", result);
        const newObj: IDevice = SetProperty(selectedItem, "details.image", result as string) as IDevice;
        setSelectedItem(newObj)

      }

      ).catch((error) => {
        console.log("PersonalInfo/handleImageChange/error", error);
      }

      )
      /* console.log("PersonalInfo/handleImageChange/base64", base64) */
    }

  }
    return (
    <>
    {(selectedItem === undefined || selectedItem === null) ? 
    (<>
    <Typography sx={{ width: "100%", flexShrink: 0 }}>Please Select Device</Typography>
    </>
    ) : (
      <>
      <Accordion  >
        <AccordionSummary style={{ height: "48px" }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="general-content"
          id="general-header"
        ><Grid container spacing={0.5} padding={1} columns={{ xs: 2 }}>
            <Grid item xs={2}>
              <Typography sx={{ width: "100%", flexShrink: 0 }}>General Device {selectedItem?.device_id} {(selectedItem?.device_type as IDeviceType)?.name}</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={0.5} padding={1} columns={{ xs: 2, md: 4 }}>

          <Grid item xs={1} >
              <DeviceTypesCombo onChanged={onDeviceTypeChanged} source={source} selectedItem={deviceTypeToItemCombo(selectedItem?.device_type)} />
            </Grid>
            <Grid item xs={1}>
              <TextField fullWidth={true} onChange={handleChange} id="device_id" name="device_id"
                
                label="Device Id" placeholder="4xcgc" variant="standard"
                value={selectedItem?.device_id} required
                helperText="" error={false} InputLabelProps={{ shrink: true }}/>
            </Grid>

            <Grid item xs={2} md={2}>
              <TextField fullWidth={true} onChange={handleChange} id="description" name="description"
                label="Description" placeholder="description" variant="standard"
                value={selectedItem?.description} required
                helperText="" error={false} multiline InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={1}>

              <TextField fullWidth onChange={handleChange} id="hobbs_meter" label="Hobbs"
                name="hobbs_meter" placeholder="Hobbs meter" variant="standard"
                value={selectedItem?.hobbs_meter} InputLabelProps={{ shrink: true }}/>
            </Grid>
            <Grid item xs={1}>
              <TextField fullWidth onChange={handleChange} id="engien_meter" label="Engien"
                name="engien_meter" placeholder="Engien meter" variant="standard"
                value={selectedItem?.engien_meter} InputLabelProps={{ shrink: true }}/>
            </Grid>

          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion >
        <AccordionSummary style={{ height: "48px" }} expandIcon={<ExpandMoreIcon />} aria-controls="general-content" id="general-header">
          <Grid container spacing={0.5} padding={1} columns={{ xs: 2 }}>
            <Grid item xs={2}>
              <Typography sx={{ width: "100%", flexShrink: 0 }}>Status Next Service: {selectedItem?.maintanance.next_meter} ({selectedItem?.engien_meter})</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1} columns={{ xs: 2, sm: 2, md: 3 }}>
            <Grid item xs={1}>
              <LocalizationProvider dateAdapter={AdapterLuxon}>
                <MobileDatePicker
                  label="Next Service"
                  value={selectedItem?.due_date === null ? new Date() : selectedItem?.due_date}
                  onChange={(newValue) => handleTimeChange(newValue, "due_date")}
                  renderInput={(params) => <TextField {...params} fullWidth={true} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={1}>
              <DeviceMTCombo onChanged={(item) => onComboChanged(item, "maintanance.type")} source={source} selectedItem={{lable: selectedItem?.device_status=== undefined ? "" : selectedItem?.maintanance.type.toString(),_id: "",description: ""}}/>
            </Grid>
            <Grid item xs={1}>
              <TextField fullWidth={true} required onChange={handleChange} id="next_meter" name="maintanance.next_meter" label="Next meter"
                placeholder="Next maintanance" variant="standard"
                value={selectedItem?.maintanance.next_meter} error={false} helperText="" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={1}>
              <DeviceStatusCombo onChanged={(item) => onComboChanged(item, "device_status")} source={source} selectedItem={{lable: selectedItem?.device_status=== undefined ? "" : selectedItem?.device_status.toString() ,_id: "",description: ""}}/>
            </Grid>
            <Grid item xs={1} justifySelf={"center"} alignSelf={"center"}>
              <FormControlLabel control={<Checkbox onChange={handleBoolainChange} name={"available"} checked={selectedItem?.available === undefined ? false : selectedItem?.available} sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }} />} label="Available" />
            </Grid>
            <Grid item xs={1} justifySelf={"center"} alignSelf={"center"}>
              <FormControlLabel control={<Checkbox onChange={handleHasHobbsChange} name={"has_hobbs"} checked={selectedItem?.has_hobbs === undefined ? false : selectedItem?.has_hobbs} sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }} />} label="Has Hobbs" />
            </Grid>
            <Grid item xs={1}>
              <StatusCombo onChanged={(item) => onComboChanged(item, "status")} source={source} selectedItem={{lable: selectedItem?.status === undefined ? "" : selectedItem?.status.toString() ,_id: "",description: ""}}/>
            </Grid>
          </Grid>

        </AccordionDetails>
      </Accordion>
      <Accordion >
        <AccordionSummary style={{ height: "48px" }} expandIcon={<ExpandMoreIcon />} aria-controls="general-content" id="general-header">
          <Grid container spacing={0.5} padding={1} columns={{ xs: 2 }}>
            <Grid item xs={1}>
              <Typography sx={{ width: "100%", flexShrink: 0 }}>Property</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>

        <AccordionDetails>
          <Grid container spacing={0.5} padding={1} columns={{ xs: 2, md: 2 }}>
            <Grid item xs={1}>
              <PriceMeterCombo onChanged={(item) => onComboPriceMethodChanged(item, "price.meter")} source={source} selectedItem={{lable: selectedItem?.device_status=== undefined ? "" : selectedItem?.price.meter.toString() ,_id: "",description: ""}}/>
            </Grid>
            <Grid item xs={1}>
                <DeviceFuelUnitCombo onChanged={(item) => onComboChanged(item, "details.fuel.units")} source={source} selectedItem={{lable: selectedItem?.device_status=== undefined ? "" : selectedItem?.details.fuel.units.toString() ,_id: "",description: ""}}/>
              </Grid>
            
            <Grid container spacing={0.5} padding={1} columns={{ xs: 2, md: 2 }}>
            <Grid item xs={1}>
              <TextField type={"number"} fullWidth onChange={handleChange} required name="price.base" label="Base Price" placeholder="Base price" variant="standard"
                value={selectedItem?.price.base} helperText="" InputLabelProps={{ shrink: true }}/>
            </Grid>

              <Grid item xs={1} md={1}>
                <TextField type={"number"} fullWidth onChange={handleChange} name="details.fuel.quantity" label="Fuel Quantity" placeholder="Fuel Units" variant="standard" value={selectedItem?.details.fuel.quantity} InputLabelProps={{ shrink: true }}/>
              </Grid>
              <Grid item xs={1}>
                <TextField type={"number"} fullWidth onChange={handleChange} required name="details.seats" label="Seats" placeholder="Seats" variant="standard"
                  value={selectedItem?.details.seats} helperText="" InputLabelProps={{ shrink: true }}/>
              </Grid>
              <Grid item xs={1}>
                <TextField fullWidth onChange={handleChange} name="details.color" label="Color" placeholder="device out color" variant="standard" value={selectedItem?.details.color} InputLabelProps={{ shrink: true }}/>
              </Grid>

            <Grid item xs={2} justifySelf={"center"}>
              {/* <Typography sx={{ width: "100%", height:"100%" ,flexShrink: 0 ,textAlign: "center",  display:'flex',alignItems:"center"}} >Status Next Service</Typography> */}
              <MultiOptionCombo property={"details.instruments"} label={"Adtional Systems "} selectedItems={getSelectedInstrument()} items={navLableItems} onSelected={onSelecteAditionaSystem} />
            </Grid>
            <Grid item xs={2} justifySelf={"center"}>
              {/* <Typography sx={{ width: "100%", height:"100%" ,flexShrink: 0 ,textAlign: "center",  display:'flex',alignItems:"center"}} >Status Next Service</Typography> */}
              <MultiOptionCombo property={"can_reservs"} label={"Order Permssion"} selectedItems={getSelectedCanreserve()} items={memberCanReserve } onSelected={onSelecteCanReserv} />
            </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion>
      <AccordionSummary style={{ height: "48px" }} expandIcon={<ExpandMoreIcon />} aria-controls="general-content" id="general-header">
          <Grid container spacing={0.5} padding={1} columns={{ xs: 2 }}>
            <Grid item xs={1}>
              <Typography sx={{ width: "100%", flexShrink: 0 }}>Image</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1} columns={{ xs: 2, sm: 2, md: 3 }}>
          <Grid item xs={12}>
          <img src={selectedItem?.details.image} alt="Device Image" />
        </Grid>
          <Grid item xs={12}>
          <Button
            variant="contained"
            component="label"
          >
            Upload File
            <input
              hidden
              type="file"
              name='image'
              id='file-upload'
              accept='.jpg, .png , .jpg'
              onChange={(e) => handleImageChange(e)}
            />
          </Button>

        </Grid>
          </Grid>

        </AccordionDetails>
      </Accordion>
      </>
    )}

    </>
  )
}

export default DeviceTabItem