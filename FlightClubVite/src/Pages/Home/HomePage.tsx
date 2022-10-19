import React, { useEffect, useState } from 'react'
import TitlebarBelowMasonryImageList from '../../Components/Masonry/TitlebarImages';
import Stepper,{IStepperProps,IStepper} from '../../Components/Stepper'
import imege1 from '../../Asset/TileBar/IMG-20190715-WA0002.jpg';
import imege2 from '../../Asset/TileBar/IMG-20200222-WA0010.jpg';
import imege3 from '../../Asset/TileBar/IMG-20200221-WA0098.jpg';
import { getMembersAndDevicesCombo } from '../../Utils/fetchData';
import IClubNotice from '../../Interfaces/API/IClubNotice';
import { useFetchAllNoticesQuery } from '../../features/clubNotice/noticeApiSlice';
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
  const {isError,isLoading,isSuccess,isFetching,error,data} = useFetchAllNoticesQuery();
  const [notices,setNotices] = useState<IClubNotice[]>([])
   useEffect(() => {
    console.log("HomePage/isLoading", isLoading)
  },[isLoading]) 

  useEffect(() => {
    console.log("HomePage/data", data)
    if(data?.data !== undefined && data?.data !== null){
      setNotices(data.data)
      console.log("HomePage/setNotices", data.data)
    }
        },[data])

  return (
    <div className='main'>
    
    <Stepper header='Club Messages' steppers={notices}/>
    <TitlebarBelowMasonryImageList imageList={itemData}/>
    </div>
  )
}

export default HomePage