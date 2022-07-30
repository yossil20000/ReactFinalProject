import { Password } from '@mui/icons-material';
import { Box, Grid, Step, StepLabel, Stepper, Typography } from '@mui/material';
import React, { useState } from 'react'
import IMemberInfo from '../../Interfaces/IMemberInfo';
import ContanctInfo from '../Resistration/ShippingAddress';
import PersonalInfo from '../Resistration/PersonalInfo';
import SubmitRegistration from '../Resistration/SubmitRegistration';
import HomeAddress from '../Resistration/HomeAddress';
import ShippingAddress from '../Resistration/ShippingAddress';

function ProfilePage() {
  const initialForm: IMemberInfo = {
    member_id: '',
    family_name: '',
    first_name: '',
    contact: {
      billing_address: {
        line1: '',
        line2: '',
        city: '',
        postcode: '',
        province: '',
        state: ""
      },
      shipping_address: {
        line2: '',
        line1: '',
        city: '',
        postcode: '',
        province: '',
        state: ''
      },
      phone: {
        country: '',
        area: '',
        number: ''
      },
      email: ''
    },
    date_of_birth: new Date(),
    password: "1234"
  }
  const steps = [
    '33%',
    '66%',
    '100%',
    'Submit',
  ];
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState<IMemberInfo>(initialForm);
  const numPage = 4;
  const componentList = [
    <PersonalInfo numPage={numPage} page={page} setPage={setPage} formData={formData} setFormData={setFormData} />,
    <HomeAddress numPage={numPage} page={page} setPage={setPage} formData={formData} setFormData={setFormData} />,
    <ShippingAddress numPage={numPage} page={page} setPage={setPage} formData={formData} setFormData={setFormData} />,
    <SubmitRegistration numPage={numPage} page={page} setPage={setPage} formData={formData} setFormData={setFormData}/>
  ]
  return (
    <div className='main' style={{ width: "100vw" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} >
          <Box sx={{ width: '100%'}}>
            <Stepper  activeStep={page} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Grid>
{/*         <Grid item xs={12} md={12}>
        <div style={{ width: `${(page + 1) / numPage * 100}%`, backgroundColor: "red", height: "10px" }}></div>
        </Grid> */}
        <Grid item xs={12} md={12} lg={12}>
        <div>{componentList[page]}</div>
        </Grid>
        

        
      </Grid>
    </div>
  )
}

export default ProfilePage