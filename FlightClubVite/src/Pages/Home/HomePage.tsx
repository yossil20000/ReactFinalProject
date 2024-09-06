
import { useEffect, useState } from 'react'
import NoticeStepper from '../../Components/NoticeStepper'
import { Role } from '../../Interfaces/API/IMember';
import IClubNotice from '../../Interfaces/API/IClubNotice';
import { useFetchAllNoticesQuery } from '../../features/clubNotice/noticeApiSlice';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import QuiltedImageList from '../../Components/Masonry/QuiltedImageList';
import { useFetchAllImagesQuery } from '../../features/image/imageApiSlice';
import { IImageDisplay } from '../../Interfaces/API/IImage';
import { useAppSelector } from '../../app/hooks';
import { ILoginResult } from '../../Interfaces/API/ILogin';
import DeviceReport from './DeviceReport';
import { GridExpandMoreIcon } from '@mui/x-data-grid';

function HomePage() {
  const login: ILoginResult = useAppSelector((state) => state.authSlice);
  const { data: images } = useFetchAllImagesQuery();
  const { isError, isLoading, isSuccess, isFetching, error, data } = useFetchAllNoticesQuery();
  const [notices, setNotices] = useState<IClubNotice[]>([])
  useEffect(() => {
    CustomLogger.info("HomePage/isLoading", isLoading)
  }, [isLoading])

  useEffect(() => {
    CustomLogger.info("HomePage/data", data)
    if (data?.data !== undefined && data?.data !== null) {
      setNotices(data.data)
      CustomLogger.info("HomePage/setNotices", data.data)
    }
  }, [data])
  const getFilterImage = () => {
    CustomLogger.log("homePage/getFilterImage/login", login)
    const found = login.member.roles.find(role => role === Role.guest)
    CustomLogger.info("homePage/getFilterImage/founsuser", found)
    if (found != undefined)
      return images?.data.filter((image) => image.public);
    else
      return images?.data

  }
  getFilterImage();

  return (

    <div className='main' style={{overflowY:"auto"}}>
      <Box marginTop={2} display={'flex'} flexDirection={'column'} >
        <Accordion defaultExpanded>
          <AccordionSummary style={{ fontWeight: "bold" }} expandIcon={<GridExpandMoreIcon />} aria-control="club_messages" id='club_messages'>
            Club Messages
          </AccordionSummary>
          <AccordionDetails>
            <NoticeStepper header='Club Messages' steppers={notices} editMode={false} role={Role.guest} children={<></>} />
          </AccordionDetails>
        </Accordion>
        <DeviceReport />
        <Accordion >
          <AccordionSummary style={{ fontWeight: "bold" }} expandIcon={<GridExpandMoreIcon />} aria-control="device-report" id='device_report'>Galllery</AccordionSummary>
          <AccordionDetails >
            <QuiltedImageList images={getFilterImage() as IImageDisplay[]} onEdit={() => { }} onDelete={() => { }} readOnly={true} />
          </AccordionDetails>
        </Accordion>

      </Box>

    </div>

  )
}

export default HomePage