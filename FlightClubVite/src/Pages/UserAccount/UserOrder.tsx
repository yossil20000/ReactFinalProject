import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useAppSelector } from '../../app/hooks';
import OrderTable from '../../Components/OrderTable';
import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container'

function UserOrderTab() {
  const login = useAppSelector((state) => state.authSlice);
  return (
    <ContainerPage>
    <>
      <ContainerPageHeader>
        <Box>
        <Typography>{`Open Orders for ${login.member.family_name} ${login.member.first_name} ${login.member.member_id}`}</Typography>
        </Box>
        
      </ContainerPageHeader>
      <ContainerPageMain><OrderTable hideAction={true} filter={{member: login.member._id}} selectedClubAccount={null}/></ContainerPageMain>
      <ContainerPageFooter><></></ContainerPageFooter>
    </>

  </ContainerPage>
  )
}

export default UserOrderTab