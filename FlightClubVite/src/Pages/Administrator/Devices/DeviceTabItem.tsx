import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material'
import React, { useContext, useMemo, useState } from 'react';
import IDevice, { CServicesToReport, DEVICE_INS, DEVICE_MET } from '../../../Interfaces/API/IDevice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { setProperty } from '../../../Utils/setProperty'
import PriceMeterCombo from '../../../Components/Devices/PriceMeterCombo'
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers'
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
import { useAppDispatch } from '../../../app/hooks';
import { setDirty } from '../../../features/Admin/adminPageSlice';
import { DateTime } from 'luxon';
import ReportDialog from '../../../Components/Report/Exel/ReportDialog';

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

function DeviceTabItem() {
  const [openExport, setOpenExport] = useState(false);
  const setDirtyDispatch = useAppDispatch()
  const { setSelectedItem, selectedItem, membersCombo } = useContext(DevicesContext) as DevicesContextType;
  const { setSelectedItem: setSelectedDeviceTypes, deviceTypes } = useContext(DeviceTypesContext) as DeviceTypesContextType
  const SetDirtyFlage = () => {
    CustomLogger.info("SetDirtyFlage/dirtyFlag", source, true);
    setDirtyDispatch(setDirty({ key: source, value: true }))
  }
  const handleAddOnClose = () => {
    setOpenExport(false)
  }
  const memberCanReserve = useMemo((): (LabelType[]) => {
    const labels: (LabelType[] | undefined) = membersCombo?.map((item) => ({ _id: item._id, name: `${item.family_name} ${item.member_id}`, description: "", color: blue[700] }));
    CustomLogger.info("memberCanReserve/labels", labels)
    if (labels === undefined || labels === null)
      return []
    return labels;
  }, [membersCombo])


  CustomLogger.info("DeviceTabItem/deviceItem.CanReserve", selectedItem?.can_reservs);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    CustomLogger.log("DeviceTabItem/handleChange", event.target.name, event.target.value)
    const newObj: IDevice = SetProperty(selectedItem, event.target.name, event.target.value) as IDevice;

    setSelectedItem(newObj)
    SetDirtyFlage();
  };
  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    CustomLogger.info("SetProperty/newobj", newObj)
    SetDirtyFlage();
    return newObj;
  }
  const handleBoolainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    CustomLogger.log("DeviceTabItem/handleBoolainChange", event.target.name, event.target.checked)
    const newObj: IDevice = SetProperty(selectedItem, event.target.name, event.target.checked) as IDevice;

    setSelectedItem(newObj)
    SetDirtyFlage();
  };

  const handleHasHobbsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    CustomLogger.log("DeviceTabItem/handleHasHobbsChange", event.target.name, event.target.checked)
    let newObj: IDevice = SetProperty(selectedItem, event.target.name, event.target.checked) as IDevice;
    if (!event.target.checked) {
      /* newObj.price.meter = DEVICE_MET.ENGIEN */
      newObj = SetProperty(newObj, "price.meter", DEVICE_MET.ENGIEN) as IDevice;
    }
    setSelectedItem(newObj)
    SetDirtyFlage();
  };
  const onComboChanged = (item: InputComboItem, prop: string): void => {
    CustomLogger.log("onComboChanged/item", item, prop);
    const newObj: IDevice = SetProperty(selectedItem, prop, item.lable) as IDevice;
    setSelectedItem(newObj)
    SetDirtyFlage();
  }
  const onComboPriceMethodChanged = (item: InputComboItem, prop: string): void => {
    CustomLogger.log("onComboPriceMethodChanged/item", item, prop);

    if (!selectedItem?.has_hobbs && item.lable === DEVICE_MET.HOBBS) {
      const newObj: IDevice = SetProperty(selectedItem, prop, DEVICE_MET.HOBBS) as IDevice;
      setSelectedItem(newObj)

    }
    else {
      const newObj: IDevice = SetProperty(selectedItem, prop, item.lable) as IDevice;
      setSelectedItem(newObj)
    }
    SetDirtyFlage();
  }
  const handleTimeChange = (newValue: Date | null | undefined, name: string) => {
    CustomLogger.log(`handleTimeChange/newValue , key`, newValue, name);
    if (newValue === null || newValue === undefined)
      return;
    const newObj: IDevice = SetProperty(selectedItem, name, newValue) as IDevice;
    setSelectedItem(newObj)
    SetDirtyFlage();
  };
  const onSelecteAditionaSystem = (items: LabelType[], property: string) => {
    CustomLogger.log("onSelecteAditionaSystem/items", items);
    const newValues = items.map((item) => (
      item.name
    )) as DEVICE_INS[];
    CustomLogger.info("onSelecteAditionaSystem/newValues", newValues);
    const newObj: IDevice = SetProperty(selectedItem, property, newValues) as IDevice;

    setSelectedItem(newObj)
    SetDirtyFlage();
  }
  const onSelecteCanReserv = (items: LabelType[], property: string) => {
    CustomLogger.log("onSelecteCanReserv/CanReserve/property", property);
    CustomLogger.log("onSelecteCanReserv/CanReserve/items", items);
    const newValues = items.map((item) => (
      item._id
    )) as string[];
    CustomLogger.info("onSelecteCanReserv/CanReserve/newValues", newValues);
    const newObj: IDevice = SetProperty(selectedItem, property, newValues) as IDevice;
    CustomLogger.info("onSelecteCanReserv/CanReserve/newObj", newObj);
    setSelectedItem(newObj)
    SetDirtyFlage();
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

    CustomLogger.log("getSelectedCanreserve/CanReserve(); selected.canreserv", memberCanReserve, selectedItem?.can_reservs)
    if (selectedItem !== undefined && selectedItem && selectedItem.can_reservs !== undefined) {
      const initial = selectedItem?.can_reservs.map((item) => {
        if (typeof item === 'string')
          return item;
        return ''
      });
      CustomLogger.info("getSelectedCanreserve/CanReserve/initial", initial)
      const result = memberCanReserve.filter((item) => (initial.includes(item._id)))
      CustomLogger.info("getSelectedCanreserve/CanReserve/result", result)
      return result;

    }
    return [];
  }


  const onDeviceTypeChanged = (item: InputComboItem) => {
    const foundItem = deviceTypes?.find((i) => item._id === i._id);
    if (foundItem && foundItem !== null) {
      setSelectedDeviceTypes(foundItem);
      CustomLogger.info("onDeviceTypeChanged/foundItem", foundItem)
      const newObj: IDevice = SetProperty(selectedItem, "device_type", foundItem) as IDevice;
      
      setSelectedItem(newObj)
      SetDirtyFlage();
    }

  }

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : "";
    CustomLogger.log("PersonalInfo/handleImageChange/file", file);
    if (file) {
      /* const base64 = await convertFileTobase64(file); */
      await resizeFileTobase64(file, 300).then((result) => {
        CustomLogger.info("PersonalInfo/handleImageChange/result", result);
        const newObj: IDevice = SetProperty(selectedItem, "details.image", result as string) as IDevice;
        setSelectedItem(newObj)
        SetDirtyFlage();
      }
      ).catch((error) => {
        CustomLogger.error("PersonalInfo/handleImageChange/error", error);
      }
      )
      /* CustomLogger.info("PersonalInfo/handleImageChange/base64", base64) */
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
                    <DeviceTypesCombo onChanged={onDeviceTypeChanged} source={source} selectedItem={deviceTypeToItemCombo(selectedItem?.device_type as IDeviceType)} />
                  </Grid>
                  <Grid item xs={1}>
                    <TextField fullWidth={true} onChange={handleChange} id="device_id" name="device_id"

                      label="Device Id" placeholder="4xcgc" variant="standard"
                      value={selectedItem?.device_id} required
                      helperText="" error={false} InputLabelProps={{ shrink: true }} />
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
                      value={selectedItem?.hobbs_meter} InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={1}>
                    <TextField disabled fullWidth onChange={handleChange} id="engien_meter" label="TACH"
                      name="engien_meter" placeholder="TACH meter" variant="standard"
                      value={selectedItem?.engien_meter} InputLabelProps={{ shrink: true }} />
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
                    <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon}>
                      <MobileDateTimePicker
                        views={['year', 'month', 'day']}
                        label="Next Annual"
                        value={DateTime.fromJSDate(selectedItem?.due_date ? (new Date(selectedItem?.due_date)) : new Date())}
                        onChange={(newValue) => handleTimeChange(newValue?.toJSDate(), "due_date")}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={1}>
                    <DeviceMTCombo onChanged={(item) => onComboChanged(item, "maintanance.type")} source={source} selectedItem={{ lable: selectedItem?.device_status === undefined ? "" : selectedItem?.maintanance.type.toString(), _id: "", description: "" }} />
                  </Grid>
                  <Grid item xs={1}>
                    <TextField fullWidth={true} required onChange={handleChange} id="next_meter" name="maintanance.next_meter" label="Next meter"
                      placeholder="Next maintanance" variant="standard"
                      value={selectedItem?.maintanance.next_meter} error={false} helperText="" InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={1}>
                    <DeviceStatusCombo onChanged={(item) => onComboChanged(item, "device_status")} source={source} selectedItem={{ lable: selectedItem?.device_status === undefined ? "" : selectedItem?.device_status.toString(), _id: "", description: "" }} />
                  </Grid>
                  <Grid item xs={1} justifySelf={"center"} alignSelf={"center"}>
                    <FormControlLabel control={<Checkbox onChange={handleBoolainChange} name={"available"} checked={selectedItem?.available === undefined ? false : selectedItem?.available} sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }} />} label="Available" />
                  </Grid>
                  <Grid item xs={1} justifySelf={"center"} alignSelf={"center"}>
                    <FormControlLabel control={<Checkbox onChange={handleHasHobbsChange} name={"has_hobbs"} checked={selectedItem?.has_hobbs === undefined ? false : selectedItem?.has_hobbs} sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }} />} label="Has Hobbs" />
                  </Grid>
                  <Grid item xs={1}>
                    <StatusCombo onChanged={(item) => onComboChanged(item, "status")} source={source} selectedItem={{ lable: selectedItem?.status === undefined ? "" : selectedItem?.status.toString(), _id: "", description: "" }} />
                  </Grid>
                  <Grid item xs={12}>
                  {openExport && <ReportDialog onClose={handleAddOnClose} open={openExport} table={(new CServicesToReport(selectedItem)).getServicesToExel()} action="ServicesExport" />}
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
                    <PriceMeterCombo onChanged={(item) => onComboPriceMethodChanged(item, "price.meter")} source={source} selectedItem={{ lable: selectedItem?.device_status === undefined ? "" : selectedItem?.price.meter.toString(), _id: "", description: "" }} />
                  </Grid>
                  <Grid item xs={1}>
                    <DeviceFuelUnitCombo onChanged={(item) => onComboChanged(item, "details.fuel.units")} source={source} selectedItem={{ lable: selectedItem?.device_status === undefined ? "" : selectedItem?.details.fuel.units.toString(), _id: "", description: "" }} />
                  </Grid>

                  <Grid container spacing={0.5} padding={1} columns={{ xs: 2, md: 2 }}>
                    <Grid item xs={1}>
                      <TextField type={"number"} fullWidth onChange={handleChange} required name="price.base" label="Base Price" placeholder="Base price" variant="standard"
                        value={selectedItem?.price.base} helperText="" InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField type={"number"} fullWidth onChange={handleChange} required name="price.engine_fund" label="Engine fund" placeholder="Engine Fund" variant="standard"
                        value={selectedItem?.price.engine_fund} helperText="" InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <TextField type={"number"} fullWidth onChange={handleChange} name="details.fuel.quantity" label="Fuel Quantity" placeholder="Fuel Units" variant="standard" value={selectedItem?.details.fuel.quantity} InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField type={"number"} fullWidth onChange={handleChange} required name="details.seats" label="Seats" placeholder="Seats" variant="standard"
                        value={selectedItem?.details.seats} helperText="" InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField fullWidth onChange={handleChange} name="details.color" label="Color" placeholder="device out color" variant="standard" value={selectedItem?.details.color} InputLabelProps={{ shrink: true }} />
                    </Grid>

                    <Grid item xs={2} justifySelf={"center"}>
                      {/* <Typography sx={{ width: "100%", height:"100%" ,flexShrink: 0 ,textAlign: "center",  display:'flex',alignItems:"center"}} >Status Next Service</Typography> */}
                      <MultiOptionCombo property={"details.instruments"} label={"Adtional Systems "} selectedItems={getSelectedInstrument()} items={navLableItems} onSelected={onSelecteAditionaSystem} />
                    </Grid>
                    <Grid item xs={2} justifySelf={"center"}>
                      {/* <Typography sx={{ width: "100%", height:"100%" ,flexShrink: 0 ,textAlign: "center",  display:'flex',alignItems:"center"}} >Status Next Service</Typography> */}
                      <MultiOptionCombo property={"can_reservs"} label={"Order Permssion"} selectedItems={getSelectedCanreserve()} items={memberCanReserve} onSelected={onSelecteCanReserv} />
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