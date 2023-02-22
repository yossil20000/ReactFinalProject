
import { Box, Grid } from '@mui/material';
import ClubAccountsCombo from '../../Components/Accounts/ClubAccountsCombo';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import OrderTable from '../../Components/OrderTable';

import useLocalStorage from '../../hooks/useLocalStorage';
import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container';
function AccountOrdersTab() {
  const [selectedClubAccount, setSelectedClubAccount] = useLocalStorage<InputComboItem | null>("_accountOrder/selectedClubAccoun",null)
  const OnSelectedClubAccount = (item: InputComboItem): void => {
 console.log("AccountOrdersTab/OnSelectedClubAccount/item",item)
    setSelectedClubAccount(item);
    
  }
  return (
    <ContainerPage>
      <>
        <ContainerPageHeader>
          <Box marginTop={2}>
            <Grid container width={"100%"} height={"100%"} gap={0} columns={12}>

              <Grid item xs={4}  >
                <ClubAccountsCombo onChanged={OnSelectedClubAccount} source={"_accountOrder/selectedClubAccoun"} />

              </Grid >
            </Grid>
          </Box>
        </ContainerPageHeader>
        <ContainerPageMain>
          <OrderTable selectedClubAccount={selectedClubAccount}/>
        </ContainerPageMain>
        <ContainerPageFooter>
          <>
            footer
          </>
        </ContainerPageFooter>
      </>

    </ContainerPage>
  )
}

export default AccountOrdersTab
