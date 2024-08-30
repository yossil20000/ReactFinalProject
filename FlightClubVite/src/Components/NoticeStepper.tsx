import '../Types/date.extensions';
import '../index.css'
import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import IClubNotice from '../Interfaces/API/IClubNotice';
import { Role } from '../Interfaces/API/IMember';
import { TextField } from '@mui/material';
import styled from '@emotion/styled';
import { red } from '@mui/material/colors';


const CssTextField = styled(TextField)({
  "& .MuiInputBase-root.Mui-disabled": {
    color: '#5E07A0' // (default alpha is 0.38)
  },
  '& input.Mui-disabled': {
      color: "blue"
  },
  '& label.Mui-focused': {
      color: '#5E07A0'
  },
  '& .MuiFilledInput-root': {
      backgroundColor: '#ffff',
      borderRadius: '12px'
  },
  '& .MuiFilledInput-root.Mui-focused': {
      backgroundColor:'#ffff',
      border: '1px solid #8000C7',
      boxSizing: 'border-box'
  },
  '& .MuiFilledInput-root:hover': {
      backgroundColor:'#ffff',
      border: '1px solid #8000C7',
      boxSizing: 'border-box'
  },
  '& .MuiFilledInput-root.Mui-disabled': {
      backgroundColor:'#E5E5E5',
      border: '1px solid #8000C7',
      boxSizing: 'border-box'
  },
  '& .MuiFormHelperText-root': {
      color: '#F53938',
  }
})
export interface INoticeStepperProps{
  header: string;
  steppers : IClubNotice[];
  role: Role;
  editMode: boolean;
  children: JSX.Element;
}
export default function NoticeStepper({header ,steppers,editMode,role,children} : INoticeStepperProps) {

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  if(steppers === null )
  return (<div></div>)
  const maxSteps = steppers.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) > maxSteps-1 ? 0 : prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1) < 0 ? maxSteps-1 : prevActiveStep - 1);
  };
  CustomLogger.info("NoticeStepper/stepper/,",maxSteps,activeStep,steppers)
  return (
    <Box sx={{ width: '100%', flexGrow: 1}}>
      <Typography sx={{ height: "3ex", textAlign: "center" }}>{header}</Typography>
      <Paper
        square
        elevation={2}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: 30,
          pl: 2,
          bgcolor: 'background.default',
        }}
      >
        <Typography>{steppers[activeStep]?.title}</Typography>
       
        
      </Paper>
      <Box sx={{  height: "auto" ,width: '100%', p: 2 ,"-webkit-text-fill-color": "#000000"}}>
      <TextField
            variant="standard"
            sx={{ marginLeft: "0px", width: "100%" ,height:"100%" ,"-webkit-text-fill-color": "#000000", "& .Mui-disabled": {
              color: '#500DB0' // (default alpha is 0.38)
            },"& .MuiInputBase-input-MuiInput-input.Mui-disabled":{color: '#5A0DB0'}}}
            name="description"
            
            helperText={`Issue Date: ${steppers[activeStep]?.issue_date ?  steppers[activeStep]?.issue_date.getDisplayDate() : "-----"} , Due Date: ${steppers[activeStep]?.due_date ? steppers[activeStep]?.due_date.getDisplayDate() : "-----"}`}
            value={steppers[activeStep]?.description}
            
            multiline
            fullWidth
            
          />
      </Box>
     
      {/* <BasicCard title={steps[activeStep].label} description={steps[activeStep].description} ></BasicCard> */}
      <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep > maxSteps}
          >
            Next
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep < 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
       
    </Box>
  );
}
