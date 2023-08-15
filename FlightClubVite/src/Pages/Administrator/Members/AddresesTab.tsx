import { Accordion, AccordionDetails, AccordionSummary, Grid, TextField, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContext } from "react";
import { MembersContext, MembersContextType } from "../../../app/Context/MemberContext";
import { LabelType } from "../../../Components/Buttons/MultiOptionCombo";
import { IMemberAdmin, Role } from "../../../Interfaces/API/IMember";
import { setProperty } from "../../../Utils/setProperty";
const source = "admin/member/general"

const SetProperty = (obj: any, path: string, value: any): any => {
  let newObj = { ...obj };
  newObj = setProperty(newObj, path, value);
  CustomLogger.info("SetProperty/newobj", newObj)
  return newObj;
}
function AddresesTab() {

  const { setSelectedItem, selectedItem, members } = useContext(MembersContext) as MembersContextType;
  
  const labelsFromRole = (): LabelType[] => {
    const lables: LabelType[] = Object.keys(Role).filter((v) => isNaN(Number(v))).
      map((name, index) => {
        return {
          name: name,
          color: Role[name as keyof typeof Role].toString(),
          description: name,
          _id: ""
        }
      })
    return lables;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    CustomLogger.log("DeviceTabItem/handleChange", event.target.name, event.target.value)
    const newObj: IMemberAdmin = SetProperty(selectedItem, event.target.name, event.target.value) as IMemberAdmin;

    setSelectedItem(newObj)
  };
  return (
    <>
      <Accordion  >
        <AccordionSummary style={{ height: "48px" }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="general-content"
          id="general-header"
        ><Grid container spacing={0.5} padding={1} columns={{ xs: 2 }}>
            <Grid item xs={2}>
              <Typography sx={{ width: "100%", flexShrink: 0 }}>Billing Address </Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={0.5} padding={1} columns={{ xs: 2, md: 4 }}>

            <Grid item xs={2}>
              <TextField fullWidth={true} onChange={handleChange} id="billing_line1" name="contact.billing_address.line1"
                label="Line 1" placeholder="Line 1" variant="standard"
                value={selectedItem?.contact?.billing_address.line1} required
                helperText="" error={false} InputLabelProps={{ shrink: true }} />
            </Grid>

            <Grid item xs={2} md={2}>
              <TextField fullWidth={true} onChange={handleChange} id="billing_line2" name="contact.billing_address.line2"
                label="Description" placeholder="Line 1" variant="standard"
                value={selectedItem?.contact?.billing_address.line2} required
                helperText="" error={false} multiline InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={1}>

              <TextField fullWidth onChange={handleChange} id="billing_city" label="City"
                name="contact.billing_address.city" placeholder="City" variant="standard"
                value={selectedItem?.contact?.billing_address.city} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={1}>
              <TextField fullWidth onChange={handleChange} id="billing_postcode" label="Postcode"
                name="contact.billing_address.postcode" placeholder="Postcode" variant="standard"
                value={selectedItem?.contact?.billing_address.postcode} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={1}>
              <TextField fullWidth onChange={handleChange} id="billing_province" label="Province"
                name="contact.billing_address.province" placeholder="Province" variant="standard"
                value={selectedItem?.contact?.billing_address.province} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={1}>
              <TextField fullWidth onChange={handleChange} id="billing_state" label="State"
                name="contact.billing_address.state" placeholder="State" variant="standard"
                value={selectedItem?.contact?.billing_address.state} InputLabelProps={{ shrink: true }} />
            </Grid>

          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion  >
        <AccordionSummary style={{ height: "48px" }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="general-content"
          id="general-header">
          <Grid container spacing={0.5} padding={1} columns={{ xs: 2 }}>
            <Grid item xs={2}>
              <Typography sx={{ width: "100%", flexShrink: 0 }}>Shipping Address </Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={0.5} padding={1} columns={{ xs: 2, md: 4 }}>
            <Grid item xs={2}>
              <TextField fullWidth={true} onChange={handleChange} id="shipping_line1" name="contact.shipping_address.line1"
                label="Line 1" placeholder="Line 1" variant="standard"
                value={selectedItem?.contact?.shipping_address.line1} required
                helperText="" error={false} InputLabelProps={{ shrink: true }} />
            </Grid>

            <Grid item xs={2} md={2}>
              <TextField fullWidth={true} onChange={handleChange} id="shipping_line2" name="contact.shipping_address.line2"
                label="Description" placeholder="Line 1" variant="standard"
                value={selectedItem?.contact?.shipping_address.line2} required
                helperText="" error={false} multiline InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={1}>

              <TextField fullWidth onChange={handleChange} id="shipping_city" label="City"
                name="contact.shipping_address.city" placeholder="City" variant="standard"
                value={selectedItem?.contact?.shipping_address.city} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={1}>
              <TextField fullWidth onChange={handleChange} id="shipping_postcode" label="Postcode"
                name="contact.shipping_address.postcode" placeholder="Postcode" variant="standard"
                value={selectedItem?.contact?.shipping_address.postcode} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={1}>
              <TextField fullWidth onChange={handleChange} id="shipping_province" label="Province"
                name="contact.shipping_address.province" placeholder="Province" variant="standard"
                value={selectedItem?.contact?.shipping_address.province} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={1}>
              <TextField fullWidth onChange={handleChange} id="shipping_state" label="State"
                name="contact.shipping_address.state" placeholder="State" variant="standard"
                value={selectedItem?.contact?.shipping_address.state} InputLabelProps={{ shrink: true }} />
            </Grid>

          </Grid>
        </AccordionDetails>
      </Accordion>
      <Grid container spacing={0.5} padding={1} columns={{ xs: 4 }}>
        <Grid item xs={4}>
          <Typography sx={{ width: "100%", flexShrink: 0 }}>Phone: {`+${selectedItem?.contact?.phone.country}${selectedItem?.contact?.phone.area.replace(/^0+/, '')}${selectedItem?.contact?.phone.number}`}</Typography>
        </Grid>
        <Grid item xs={1}>
          <TextField fullWidth onChange={handleChange} id="country" label="Country"
            name="contact.phone.country" placeholder="Country Code" variant="standard"
            value={selectedItem?.contact?.phone.country} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={1}>
          <TextField fullWidth onChange={handleChange} id="area" label="Area"
            name="contact.phone.area" placeholder="Area code" variant="standard"
            value={selectedItem?.contact?.phone.area} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={2}>
          <TextField fullWidth onChange={handleChange} id="number" label="Number"
            name="contact.phone.number" placeholder="Phone Number" variant="standard"
            value={selectedItem?.contact?.phone.number} InputLabelProps={{ shrink: true }} />
        </Grid>
      </Grid>
    </>
  )
}

export default AddresesTab