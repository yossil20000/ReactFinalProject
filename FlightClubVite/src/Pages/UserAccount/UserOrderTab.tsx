import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useMemo } from 'react';
import { useAppSelector } from '../../app/hooks';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import OrderTable from '../../Components/OrderTable';
import { OrderStatus } from '../../Interfaces/API/IAccount';
import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container'

function UserOrderTab() {
  const login = useAppSelector((state) => state.authSlice);
  const getSelectedMember = useMemo(() => {
    const memberItem : InputComboItem = {
      _id: login.member._id,
      label: login.member.member_id,
      description: ''
    }
    return memberItem;
  },[login.member])
  return (
    <ContainerPage>
    <>
      <ContainerPageHeader>
        <Box>
        <Typography>{`Open Orders for ${login.member.family_name} ${login.member.first_name} ${login.member.member_id}`}</Typography>
        </Box>
      </ContainerPageHeader>
      <ContainerPageMain><OrderTable selectedMember={getSelectedMember} hideAction={true} filter={{member: login.member._id, orderStatus: OrderStatus.CREATED}} selectedClubAccount={null}/></ContainerPageMain>
      <ContainerPageFooter><></></ContainerPageFooter>
    </>

  </ContainerPage>
  )
}

export default UserOrderTab