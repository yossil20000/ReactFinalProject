import { Box, Container, CssBaseline, FormControl, Grid, IconButton, Input, InputLabel, OutlinedInput, Paper, TextField } from '@mui/material';
import { useState } from 'react'
import { IPageNavigate } from '../../Interfaces/IPageNavigate';
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


function PersonalInfo({ numPage, page, setPage, formData, setFormData }: IPageNavigate) {

  const handlePersonChange = (prop: any) => (event: any) => {
    setFormData({ ...formData,  [prop]: event.target.value  });
    console.log("formData", formData)
  };
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
        <Grid item xs={12} md={12}>
          <Item>
            <TextField sx={{ width: "90%", margin: "auto" }}
              required
              id="member_id"
              label="MemberID"
              value={formData.member_id}
              onChange={handlePersonChange("member_id")}
            />
          </Item>
        </Grid>
        <Grid item xs={12} md={12}>
          <Item>
            <TextField sx={{ width: "90%", margin: "auto" }}
              required
              id="family_name"
              label="Family Name"
              value={formData.family_name}
              onChange={handlePersonChange("family_name")}
            />
          </Item>
        </Grid>
        <Grid item xs={12} md={12}>
          <Item>
            <TextField sx={{ width: "90%", margin: "auto" }}
              required
              id="first_name"
              label="First Name"
              value={formData.first_name}
              onChange={handlePersonChange("first_name")}
            />
          </Item>
        </Grid>
        <Grid item xs={12} md={12}>
          <Item>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <MobileDatePicker 
              label="Date Of Birth"
              inputFormat="MM/dd/yyyy"
              value={formData.date_of_birth}
              onChange={handleTimeChange}
              renderInput={(params) => 
              <TextField sx={{ width: "90%", margin: "auto" }} {...params} />}
            />
            </LocalizationProvider>
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

export default PersonalInfo


