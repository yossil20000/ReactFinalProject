import { Box, Button, Grid, Paper, TextField } from '@mui/material';
import { IPageNavigate } from '../../Interfaces/IPageNavigate';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import IMemberUpdate from '../../Interfaces/IMemberInfo';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


function ShippingAddress({ numPage ,page, setPage, formData,setFormData }: IPageNavigate<IMemberUpdate>) {
  const handleContactChange = (prop: any) => (event: any) => {
    setFormData(prev => ({...prev, contact: { ...prev.contact, shipping_address: {...prev.contact.shipping_address, [prop]: event.target.value}} }));
    console.log("formData", formData)
  };
  const handleTimeChange = (newValue: Date | null ) => {
    if(newValue === null  )
      return;
    setFormData({...formData,date_of_birth:newValue});
    console.log("formData", formData)
  };
 
  return (
    <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={2}>
    <Grid item xs={12}>
        <Typography variant="h5" component="div" align='center'>
        Shipping Address
      </Typography>
        </Grid>
      <Grid item xs={12} md={12}>
        <Item>
        <TextField sx={{ width: "100%", margin: "auto" }}
              required
              id="line1"
              label="Line1"
              value={formData.contact.shipping_address.line1}
              onChange={handleContactChange("line1")}
            />
        </Item>
      </Grid>
      <Grid item xs={12}>
        <Item>
        <TextField sx={{ width: "100%", margin: "auto" }}
              required
              id="line2"
              label="line2"
              value={formData.contact.shipping_address.line2}
              onChange={handleContactChange("line2")}
            />
        </Item>
      </Grid>
      <Grid item xs={6}>
        <Item>
        <TextField sx={{ width: "100%", margin: "auto" }}
              required
              id="city"
              label="City"
              value={formData.contact.shipping_address.city}
              onChange={handleContactChange("city")}
            />
        </Item>
      </Grid>
      <Grid item xs={6}>
        <Item>
        <TextField sx={{ width: "100%", margin: "auto" }}
              required
              id="postcode"
              label="Postcode"
              value={formData.contact.shipping_address.postcode}
              onChange={handleContactChange("postcode")}
            />
        </Item>
      </Grid>
      <Grid item xs={6}>
        <Item>
        <TextField sx={{ width: "100%", margin: "auto" }}
              
              id="province"
              label="Province"
              value={formData.contact.shipping_address.province}
              onChange={handleContactChange("province")}
            />
        </Item>
      </Grid>
      <Grid item xs={6}>
        <Item>
        <TextField sx={{ width: "100%", margin: "auto" }}
             required 
              id="state"
              label="State"
              value={formData.contact.shipping_address.state}
              onChange={handleContactChange("state")}
            />
        </Item>
      </Grid>
      <Grid item xs={6}>
          <Item><Button
            onClick={() => {
              setPage((page) => { return page <= 0 ? numPage - 1 : page - 1 });
            }}>
            Previous
          </Button></Item>
        </Grid>
        <Grid item xs={6}>
          <Item><Button
            onClick={() => {
              setPage(page + 1 == numPage ? 0 : page + 1);
            }}>
            Next
          </Button></Item>
        </Grid>
    </Grid>
  </Box>

  )
}



export default ShippingAddress