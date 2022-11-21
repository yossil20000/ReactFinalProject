import { Accordion, AccordionDetails, AccordionSummary, Grid, TextField, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContext } from "react";
import { DevicesContext, DevicesContextType } from "../../../app/Context/DevicesContext";
import { MembersContext, MembersContextType } from "../../../app/Context/MemberContext";
import { InputComboItem } from "../../../Components/Buttons/ControledCombo"
import { LabelType } from "../../../Components/Buttons/MultiOptionCombo";
import { IMemberAdmin, Role } from "../../../Interfaces/API/IMember";
import { setProperty } from "../../../Utils/setProperty";
const source = "admin/member/general"

const SetProperty = (obj: any, path: string, value: any): any => {
  let newObj = { ...obj };
  newObj = setProperty(newObj, path, value);
  console.log("SetProperty/newobj", newObj)
  return newObj;
}
function Addreses() {

  const { setSelectedItem, selectedItem, members } = useContext(MembersContext) as MembersContextType;
  const { membersCombo } = useContext(DevicesContext) as DevicesContextType;


  const handleTimeChange = (newValue: Date | null | undefined, name: string) => {
    console.log(`handleTimeChange/newValue , key`, newValue, name);
    if (newValue === null || newValue === undefined)
      return;

    const newObj: IMemberAdmin = SetProperty(selectedItem, name, newValue) as IMemberAdmin;

    setSelectedItem(newObj)
  };
  const onComboChanged = (item: InputComboItem, prop: string): void => {
    console.log("onComboChanged/item", item, prop);
    const newObj: IMemberAdmin = SetProperty(selectedItem, prop, item.lable) as IMemberAdmin;
    setSelectedItem(newObj)
  }
  const onRoleChanged = (item: LabelType[], prop: string): void => {
    console.log("onComboChanged/item", item, prop);
    const newObj: IMemberAdmin = SetProperty(selectedItem, prop, item.map((i) => i.name)) as IMemberAdmin;
    setSelectedItem(newObj)
  }
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

  const navLableItems = labelsFromRole();
  const getSelectedRoles = (): LabelType[] => {

    if (selectedItem !== undefined && selectedItem && selectedItem.role !== undefined) {
      const initial = selectedItem.role.roles.map((item) => {
        return item.toString();
      });
      const result = navLableItems.filter((item) => (initial.includes(item.name)))
      return result;

    }
    return [];
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("DeviceTabItem/handleChange", event.target.name, event.target.value)
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
                value={selectedItem?.contact.billing_address.line1} required
                helperText="" error={false} />
            </Grid>

            <Grid item xs={2} md={2}>
              <TextField fullWidth={true} onChange={handleChange} id="billing_line2" name="contact.billing_address.line2"
                label="Description" placeholder="Line 1" variant="standard"
                value={selectedItem?.contact.billing_address.line2} required
                helperText="" error={false} multiline />
            </Grid>
            <Grid item xs={1}>

              <TextField fullWidth onChange={handleChange} id="billing_city" label="City"
                name="contact.billing_address.city" placeholder="City" variant="standard"
                value={selectedItem?.contact.billing_address.city} />
            </Grid>
            <Grid item xs={1}>
              <TextField fullWidth onChange={handleChange} id="billing_postcode" label="Postcode"
                name="contact.billing_address.postcode" placeholder="Postcode" variant="standard"
                value={selectedItem?.contact.billing_address.postcode} />
            </Grid>
            <Grid item xs={1}>
              <TextField fullWidth onChange={handleChange} id="billing_province" label="Province"
                name="contact.billing_address.province" placeholder="Province" variant="standard"
                value={selectedItem?.contact.billing_address.province} />
            </Grid>
            <Grid item xs={1}>
              <TextField fullWidth onChange={handleChange} id="billing_state" label="State"
                name="contact.billing_address.state" placeholder="State" variant="standard"
                value={selectedItem?.contact.billing_address.state} />
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
                value={selectedItem?.contact.shipping_address.line1} required
                helperText="" error={false} />
            </Grid>

            <Grid item xs={2} md={2}>
              <TextField fullWidth={true} onChange={handleChange} id="shipping_line2" name="contact.shipping_address.line2"
                label="Description" placeholder="Line 1" variant="standard"
                value={selectedItem?.contact.shipping_address.line2} required
                helperText="" error={false} multiline />
            </Grid>
            <Grid item xs={1}>

              <TextField fullWidth onChange={handleChange} id="shipping_city" label="City"
                name="contact.shipping_address.city" placeholder="City" variant="standard"
                value={selectedItem?.contact.shipping_address.city} />
            </Grid>
            <Grid item xs={1}>
              <TextField fullWidth onChange={handleChange} id="shipping_postcode" label="Postcode"
                name="contact.shipping_address.postcode" placeholder="Postcode" variant="standard"
                value={selectedItem?.contact.shipping_address.postcode} />
            </Grid>
            <Grid item xs={1}>
              <TextField fullWidth onChange={handleChange} id="shipping_province" label="Province"
                name="contact.shipping_address.province" placeholder="Province" variant="standard"
                value={selectedItem?.contact.shipping_address.province} />
            </Grid>
            <Grid item xs={1}>
              <TextField fullWidth onChange={handleChange} id="shipping_state" label="State"
                name="contact.shipping_address.state" placeholder="State" variant="standard"
                value={selectedItem?.contact.shipping_address.state} />
            </Grid>

          </Grid>
        </AccordionDetails>
      </Accordion>
      <Grid container spacing={0.5} padding={1} columns={{ xs: 4 }}>
        <Grid item xs={4}>
          <Typography sx={{ width: "100%", flexShrink: 0 }}>Phone: {`+${selectedItem?.contact.phone.country}${selectedItem?.contact.phone.area.replace(/^0+/, '')}${selectedItem?.contact.phone.number}`}</Typography>
        </Grid>
        <Grid item xs={1}>
          <TextField fullWidth onChange={handleChange} id="country" label="Country"
            name="contact.phone.country" placeholder="Country Code" variant="standard"
            value={selectedItem?.contact.phone.country} />
        </Grid>
        <Grid item xs={1}>
        <TextField fullWidth onChange={handleChange} id="area" label="Area"
                name="contact.phone.area" placeholder="Area code" variant="standard"
                value={selectedItem?.contact.phone.area} />
        </Grid>
        <Grid item xs={2}>
        <TextField fullWidth onChange={handleChange} id="number" label="Number"
                name="contact.phone.number" placeholder="Phone Number" variant="standard"
                value={selectedItem?.contact.phone.number} />
        </Grid>
      </Grid>
    </>
  )
}

export default Addreses