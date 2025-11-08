  import {useEffect, useState} from 'react'; 
  
import IClubNotice from '../Interfaces/API/IClubNotice';
import { useFetchAllNoticesQuery } from '../features/clubNotice/noticeApiSlice';
import { Typography,Alert } from '@mui/material';

function useClubNotices() {
  const { isError, isLoading, isSuccess, isFetching, error, data } = useFetchAllNoticesQuery();

  const [clubNotices, setClubNotices] = useState<IClubNotice[]>([]);
  const [alertView, setAlertView] = useState<JSX.Element[]>([]);
  // Fetch or compute club notices here and update state
    
 useEffect(() => {
    CustomLogger.info("HomePage/data", data?.data)
    
    if (data?.data !== undefined && data?.data !== null) {
      const sortedNotices =[...data.data].sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime());
      setClubNotices(sortedNotices)
      CustomLogger.info("HomePage/setNotices", sortedNotices)
      const alertView = sortedNotices.filter(n => n.isAlert).map((noticeAlert, index) => 
         (<Alert key={index} variant="filled" severity="warning" >
          <Typography key={index} dir="rtl">{noticeAlert.title}: {noticeAlert.description}</Typography>
        </Alert>));
        setAlertView(alertView);
    }
    
  }, [data?.data])

  return [clubNotices, alertView];
}
  export default useClubNotices;