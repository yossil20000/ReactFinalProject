import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'
import { useAppSelector } from '../../app/hooks';
import DataTablePro from '../../Components/DataTablePro';
import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container'

function UserOrder() {
  const login = useAppSelector((state) => state.authSlice);
  return (
    <ContainerPage>
    <>
      <ContainerPageHeader>
        <Box>
        <Typography>{`Open Orders for ${login.member.family_name} ${login.member.first_name} ${login.member.member_id}`}</Typography>
        </Box>
        
      </ContainerPageHeader>
      <ContainerPageMain><DataTablePro hideAction={true} filter={{member: login.member._id}}/></ContainerPageMain>
      <ContainerPageFooter><></></ContainerPageFooter>
    </>

  </ContainerPage>
  )
}

export default UserOrder