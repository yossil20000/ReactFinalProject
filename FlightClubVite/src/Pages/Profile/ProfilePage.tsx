import { Password } from '@mui/icons-material';
import { Box, Grid, Step, StepLabel, Stepper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import IMemberInfo from '../../Interfaces/IMemberInfo';
import ContanctInfo from '../Resistration/ShippingAddress';
import PersonalInfo from '../Resistration/PersonalInfo';
import SubmitRegistration from '../Resistration/SubmitRegistration';
import HomeAddress from '../Resistration/HomeAddress';
import ShippingAddress from '../Resistration/ShippingAddress';
import { useGetMemberByIdQuery } from '../../features/Users/userSlice';
import { authSlice, selectCurrentId } from '../../features/Auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import SubmitProfile from './SubmitProfile';
import { Gender, Role } from '../../Interfaces/API/IMember';
import IMemberCreate from '../../Interfaces/IMemberCreate';
import IMemberUpdate from '../../Interfaces/IMemberInfo';

function ProfilePage() {
  const steps = [
    '33%',
    '66%',
    '100%',
    'Submit',
  ];

  const initialForm: IMemberUpdate = {
    _id: "",
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
    image: "",
    gender: Gender.other
  }
  const login = useAppSelector((state) => state.authSlice);
  const { data: member, isError,isLoading,isSuccess,error } = useGetMemberByIdQuery(login.member._id);

  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState<IMemberUpdate>(initialForm);
  console.log("formData", login.member)
  const numPage = 4;
  const componentList = [
    <PersonalInfo numPage={numPage} page={page} setPage={setPage} formData={formData} setFormData={setFormData} />,
    <HomeAddress numPage={numPage} page={page} setPage={setPage} formData={formData} setFormData={setFormData} />,
    <ShippingAddress numPage={numPage} page={page} setPage={setPage} formData={formData} setFormData={setFormData} />,
    <SubmitProfile numPage={numPage} page={page} setPage={setPage} formData={formData} setFormData={setFormData} />
  ]

  useEffect(() => {
    console.log('UseEffect/ProfilePage', member?.data,isSuccess);
    if (member?.data) {
      setFormData(member.data as IMemberUpdate);
      console.log('UseEffect/ProfilePage', member.data);
    }
  }, [isSuccess]);
  

  return (
    <div className='main' style={{ width: "99%", margin: "1% auto" ,overflow:"auto"}}>
      <Grid container spacing={2}>
        <Grid item xs={12} >
          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={page} alternativeLabel>
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