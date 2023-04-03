import { Box, Button, Grid, Paper, TextField } from '@mui/material';
import { IPageNavigate } from '../../Interfaces/IPageNavigate';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import IMemberCreate from '../../Interfaces/IMemberCreate';
import IMemberUpdate from '../../Interfaces/IMemberInfo';
import { INotification } from '../../Interfaces/API/INotification';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function HomeAddress({ numPage, page, setPage, formData, setFormData }: IPageNavigate<IMemberUpdate>) {
  const handleContactChange = (prop: any) => (event: any) => {
    //setFormData({ ...formData, contact: { ...formData.contact, [prop]: event.target.value } });
    setFormData(prev => ({ ...prev, contact: { ...prev.contact, billing_address: { ...prev.contact.billing_address, [prop]: event.target.value } } }));
    CustomLogger.info("formData", formData)
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Typography variant="h5" component="div" align='center'>
            Home Address
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <Button sx={{ m: 1, width: '90%', margin: "auto" }}
              variant={'outlined'}
              onClick={() => {
                setPage((page) => { return page <= 0 ? numPage - 1 : page - 1 });
              }}>
              Previous
            </Button>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <Button sx={{ m: 1, width: '90%', margin: "auto" }}
              variant={'outlined'}
              onClick={() => {
                setPage(page + 1 == numPage ? 0 : page + 1);
              }}>
              Next
            </Button>
          </Item>
        </Grid>
        <Grid item xs={12} md={12}>
          <Item>
            <TextField sx={{ width: "100%", margin: "auto" }}
              required
              id="line1"
              value={formData.contact.billing_address.line1}
              label="Line1"
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
              value={formData.contact.billing_address.line2}
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
              value={formData.contact.billing_address.city}
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
              value={formData.contact.billing_address.postcode}
              onChange={handleContactChange("postcode")}
            />
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <TextField sx={{ width: "100%", margin: "auto" }}

              id="province"
              label="Province"
              value={formData.contact.billing_address.province}
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
              value={formData.contact.billing_address.state}
              onChange={handleContactChange("state")}
            />
          </Item>
        </Grid>
      </Grid>
    </Box>

  )
}



export default HomeAddress