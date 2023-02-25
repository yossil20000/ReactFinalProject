import { Box, Grid, Step, StepLabel, Stepper } from '@mui/material';
import { useState } from 'react'
import PersonalInfo from './PersonalInfo';
import Register from './Register';
import SubmitRegistration from './SubmitRegistration';
import HomeAddress from './HomeAddress';
import ShippingAddress from './ShippingAddress';
import Notification from './Notification';
import { useAppSelector } from '../../app/hooks';
import { Gender, Role } from '../../Interfaces/API/IMember';
import IMemberCreate from '../../Interfaces/IMemberCreate';
import { INotification, newNotification } from '../../Interfaces/API/INotification';

function RegistrationPage() {
  const login = useAppSelector((state) => state.authSlice);
  const initialForm: IMemberCreate = {
    _id: '',
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
    password: "",
    username: "",
    role: {
      roles: [Role.user]
    },
    image: '',
    gender: Gender.male
  }
  const steps = [
    '20%',
    '40%',
    '60%',
    '80%',
    '100%',
    'Submit',
  ];
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState<IMemberCreate>(initialForm);
  const [formNotify,setFormNotify] = useState<INotification>(newNotification)
  console.log("formData", login.member)
  const numPage = 6;
  const componentList = [
    <Register numPage={numPage} page={page} setPage={setPage} formData={formData} setFormData={setFormData} formNotify={formNotify} setFormNotify={setFormNotify}/>,
    <PersonalInfo numPage={numPage} page={page} setPage={setPage} formData={formData} setFormData={setFormData} formNotify={formNotify} setFormNotify={setFormNotify}/>,
    <HomeAddress numPage={numPage} page={page} setPage={setPage} formData={formData} setFormData={setFormData} formNotify={formNotify} setFormNotify={setFormNotify}/>,
    <ShippingAddress numPage={numPage} page={page} setPage={setPage} formData={formData} setFormData={setFormData} formNotify={formNotify} setFormNotify={setFormNotify}/>,
    <Notification numPage={numPage} page={page} setPage={setPage} formData={formData} setFormData={setFormData} formNotify={formNotify} setFormNotify={setFormNotify}/>,
    <SubmitRegistration numPage={numPage} page={page} setPage={setPage} formData={formData} setFormData={setFormData} formNotify={formNotify} setFormNotify={setFormNotify}/>
  ]
  return (
    <div className='main' style={{ width: "99%", margin: "1% auto" ,overflow:"auto"}}>
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

export default RegistrationPage