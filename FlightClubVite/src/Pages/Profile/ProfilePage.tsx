import { Box, Grid, Step, StepLabel, Stepper } from '@mui/material';
import { useEffect, useState } from 'react'
import PersonalInfo from '../Resistration/PersonalInfo';
import HomeAddress from '../Resistration/HomeAddress';
import ShippingAddress from '../Resistration/ShippingAddress';
import { useGetMemberByIdQuery } from '../../features/Users/userSlice';
import { useAppSelector } from '../../app/hooks';
import SubmitProfile from './SubmitProfile';
import { Gender } from '../../Interfaces/API/IMember';
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
    id_number: '',
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
  CustomLogger.log("formData", login.member)
  const numPage = 4;
  const componentList = [
    <PersonalInfo numPage={numPage} page={page} setPage={setPage} formData={formData} setFormData={setFormData} />,
    <HomeAddress numPage={numPage} page={page} setPage={setPage} formData={formData} setFormData={setFormData} />,
    <ShippingAddress numPage={numPage} page={page} setPage={setPage} formData={formData} setFormData={setFormData} />,
    <SubmitProfile numPage={numPage} page={page} setPage={setPage} formData={formData} setFormData={setFormData} />
  ]

  useEffect(() => {
    CustomLogger.info('UseEffect/ProfilePage', member?.data,isSuccess);
    if (member?.data) {
      setFormData(member.data as IMemberUpdate);
      CustomLogger.info('UseEffect/ProfilePage', member.data);
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