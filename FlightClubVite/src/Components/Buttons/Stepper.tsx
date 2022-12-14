import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import { MobileStepper, Button, useTheme } from '@mui/material'
import { useEffect, useState } from 'react';

export interface IStepper{
  leftButton: string;
  rightButton: string;
  maxSteps: number;
  onStepChange: (step: number) =>  void;
  initialStep : number;
}
function Stepper({initialStep, leftButton,maxSteps,rightButton,onStepChange} : IStepper) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(initialStep);
   
  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) > maxSteps-1 ? 0 : prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1) < 0 ? maxSteps-1 : prevActiveStep - 1);

  };
  useEffect(() => {
    onStepChange(activeStep);
  },[activeStep])
  useEffect(() => {
    const newStep = maxSteps === 0 ? -1 : 0; 
    setActiveStep(newStep);
    if(activeStep === 0)
      onStepChange(newStep);
  },[maxSteps])

  return (
    <>
          <MobileStepper
          style={{width:"100%"}}
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={maxSteps === 0}
          >
            {rightButton}
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={maxSteps === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            {leftButton}
          </Button>
        }
      />
    </>
  )
}

export default Stepper