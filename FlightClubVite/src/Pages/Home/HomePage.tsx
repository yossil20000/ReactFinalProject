import React from 'react'
import Stepper,{IStepperProps,IStepper} from '../../Components/Stepper'

function HomePage() {
  const steppersArray : Array<IStepper> = [{
    title: "yossi",
    message: "How Are you"
  },
  {
    title: "yossi 1",
    message: "How Are you Tom"
  }];
  const stepper : IStepperProps = {
    header: 'Club Messages',
    steppers: steppersArray,
  }
  return (
    <div className='main'>
    
    <Stepper header='Club Messages' steppers={steppersArray}/>
    </div>
  )
}

export default HomePage