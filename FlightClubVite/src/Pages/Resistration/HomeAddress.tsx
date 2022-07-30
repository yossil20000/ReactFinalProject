import { Box, Grid, Paper, TextField } from '@mui/material';
import { IPageNavigate } from '../../Interfaces/IPageNavigate';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


function HomeAddress({ numPage ,page, setPage, formData,setFormData }: IPageNavigate) {
  const handleContactChange = (prop: any) => (event: any) => {
    setFormData({ ...formData, contact: { ...formData.contact, [prop]: event.target.value } });
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
        Home Address
      </Typography>
        </Grid>
      <Grid item xs={12} md={12}>
        <Item>
        <TextField sx={{ width: "100%", margin: "auto" }}
              required
              id="line1"
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
              onChange={handleContactChange("postcode")}
            />
        </Item>
      </Grid>
      <Grid item xs={6}>
        <Item>
        <TextField sx={{ width: "100%", margin: "auto" }}
              
              id="province"
              label="Province"
              onChange={handleContactChange("postcode")}
            />
        </Item>
      </Grid>
      <Grid item xs={6}>
        <Item>
        <TextField sx={{ width: "100%", margin: "auto" }}
             required 
              id="state"
              label="State"
              onChange={handleContactChange("state")}
            />
        </Item>
      </Grid>
      <Grid item xs={6}>
          <Item><button
            onClick={() => {
              setPage((page) => { return page <= 0 ? numPage - 1 : page - 1 });
            }}>
            Previous
          </button></Item>
        </Grid>
        <Grid item xs={6}>
          <Item><button
            onClick={() => {
              setPage(page + 1 == numPage ? 0 : page + 1);
            }}>
            Next
          </button></Item>
        </Grid>
    </Grid>
  </Box>

  )
}



export default HomeAddress