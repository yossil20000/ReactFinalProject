import React, { useEffect } from 'react'
import TitlebarBelowMasonryImageList from '../../Components/Masonry/TitlebarImages';
import Stepper,{IStepperProps,IStepper} from '../../Components/Stepper'
import imege1 from '../../Asset/TileBar/IMG-20190715-WA0002.jpg';
import imege2 from '../../Asset/TileBar/IMG-20200222-WA0010.jpg';
import imege3 from '../../Asset/TileBar/IMG-20200221-WA0098.jpg';
import { getMembersAndDevicesCombo } from '../../Utils/fetchData';
const itemData = [
  {
    img: imege1,
    title: 'Yosef And Alex',
    author: 'Yosef Levy',
  },
  {
    img: imege3,
    title: 'Near Haifa',
    author: 'Yosef Levy',
  },
  {
    img: imege2,
    title: 'Moskin',
    author: 'Yosef Levy',
  },
];

function HomePage() {
/*   useEffect(() => {
   getMembersAndDevicesCombo(); 
  }) */
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
    <TitlebarBelowMasonryImageList imageList={itemData}/>
    </div>
  )
}

export default HomePage