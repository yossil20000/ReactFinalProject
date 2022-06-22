import '../../../index.css'
import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { ClubMessage } from '../../../Types/ClubMessages';
import { useQuery } from 'react-query';
import ClubMessagesService from '../../../api/services/ClubMessages/ClubMessagesService';
import { textAlign } from '@mui/system';

let stepses = [
  {
    title: 'Select campaign settings',
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
  },
  {
    title: 'Create an ad group',
    description:
      'An ad group contains one or more ads which target a shared set of keywords.',
  },
  {
    title: 'Create an ad',
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
];

export default function TextMobileStepper() {
    const [steps,setSteps] = React.useState<ClubMessage[] | null>(null);
    const {isLoading, data,error,status} = useQuery<ClubMessage[],Error>(
      "ClubMessages",
      async () => {
        
        const data = await ClubMessagesService.getAll()
        console.log("Data Wellcome", data);
        setSteps(data)
        return data;
      }
      
     );
  
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  if(steps === null )
  return (<div></div>)
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) > maxSteps-1 ? 0 : prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1) < 0 ? maxSteps-1 : prevActiveStep - 1);
  };

  return (
    <Box sx={{ width: '100%', flexGrow: 1 }}>
      <Typography sx={{ height: "4ex", align: "center" }}>Message</Typography>
      <Paper
        square
        elevation={10}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 30,
          pl: 2,
          bgcolor: 'background.default',
        }}
      >
        <Typography>{steps[activeStep]?.title}</Typography>
      </Paper>
      <Box sx={{ height: "15ex", maxWidth: 400, width: '100%', p: 2 }}>
        {steps[activeStep]?.description}
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
