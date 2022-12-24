
import { useEffect, useState } from 'react'
import NoticeStepper from '../../Components/NoticeStepper'
import { Role } from '../../Interfaces/API/IMember';
import IClubNotice from '../../Interfaces/API/IClubNotice';
import { useFetchAllNoticesQuery } from '../../features/clubNotice/noticeApiSlice';
import { Box, Typography } from '@mui/material';
import QuiltedImageList from '../../Components/Masonry/QuiltedImageList';
import { useFetchAllImagesQuery } from '../../features/image/imageApiSlice';
import { IImageDisplay } from '../../Interfaces/API/IImage';
import { useAppSelector } from '../../app/hooks';
import { ILoginResult } from '../../Interfaces/API/ILogin';


function HomePage() {
  const login: ILoginResult = useAppSelector((state) => state.authSlice);
  const { data: images } = useFetchAllImagesQuery();
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
  const getFilterImage = () => {
    console.log("homePage/getFilterImage/login",login)
    const found = login.member.roles.find(role => role === Role.guest)
    console.log("homePage/getFilterImage/founsuser",found)
    if(found != undefined)
      return images?.data.filter((image) => image.public);
    else
     return images?.data
    
  }
  getFilterImage();
 
  return (
    
    <div className='main'>
    <Box marginTop={2} display={'flex'} flexDirection={'column'}>
    <NoticeStepper header='Club Messages' steppers={notices} editMode={false} role={Role.guest} children={<></>}/>
    <Box sx={{ width: "100%", height: "50vh"} }>
      <Box><Typography sx={{ height: "4ex", textAlign: "center" }}>Galllery</Typography></Box>
      <Box sx={{ width: "100%", height: "50vh", overflowY: 'scroll' }}>
      <QuiltedImageList images={getFilterImage() as IImageDisplay[]} onEdit={() => {}} onDelete={() => {}} readOnly={true}/>
      </Box>
    </Box>
    
    
    </Box>

    </div>
    
  )
}

export default HomePage