import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { height } from '@mui/system';
import { useMemo, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import CardTransaction from '../../Components/Accounts/CardTransaction';
import MobileTransaction, { getSign, ShekelIcon } from '../../Components/Accounts/MobileTransaction';
import FullScreenLoader from '../../Components/FullScreenLoader';
import { useFetchAccountSearchQuery } from '../../features/Account/accountApiSlice'
import { IAccount } from '../../Interfaces/API/IAccount';
import { ITransaction } from '../../Interfaces/API/IClub';
import { ILoginResult } from '../../Interfaces/API/ILogin';
import ContainerPage, { ContainerPageFooter, ContainerPageHeader, ContainerPageMain } from '../Layout/Container'

function UserAccountTab() {
  const login: ILoginResult = useAppSelector<ILoginResult>((state) => state.authSlice);
  const [accountFilter, setAccountFilter] = useState({ member: [login.member._id] })
  const { data, isLoading, isError } = useFetchAccountSearchQuery(accountFilter);

  const getTransaction = useMemo((): ITransaction[] | [] => {
    console.log("UserAccountTab/getTransaction/data", data?.data)

    if (data?.data !== null && data?.data !== undefined) {
      console.log("UserAccountTab/getTransaction/dataok", data?.data , login.member._id)
      const account: IAccount | undefined = data?.data.find((a) => a.member._id === login.member._id);
      if (account !== undefined) {
        console.log("UserAccountTab/getTransaction/accountFound", account,account.transactions)
        return account.transactions
      }
    }
    return []
  }, [data])
  const getAccount = useMemo((): IAccount | undefined => {
    if (data?.data !== null && data?.data !== undefined) {
      console.log("UserAccountTab/getAccount/data?.data", data?.data)
      const account: IAccount | undefined = data.data.find((account) => account.member._id === login.member._id);
      if (account !== undefined) {
        return account
      }
    }
    return undefined
  }, [data])
  return (
    <Box fontSize={{ xs: "1rem", md: "1.2rem" }}>
      <ContainerPage >
        <>
          <ContainerPageHeader>
            <Paper >
              <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                <Box gap={1} style={{ display: "flex", alignItems: "baseline", flexDirection: "row" }}>
                  <Box>
                    <Typography sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" }, marginLeft: "2.5%" }}>
                      Balance: 
                    </Typography>
                  </Box>
                  <Box>
                  <ShekelIcon sx={{ fontSize: "0.6rem" }} />
                  </Box>
                  <Box>
                  
                    <Typography noWrap={false} style={{ color: getSign(getAccount?.balance) }}>{getAccount?.balance.toFixed(2)}</Typography>
                  </Box>

                </Box>

                <Typography sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" }, marginLeft: "2.5%" }}>
                  AccountId:  {getAccount?.account_id}
                </Typography>
                <Typography sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" }, marginLeft: "2.5%" }}>
                  Name:  {getAccount?.member.family_name}
                </Typography>
              </Box>

              <Divider />
            </Paper>
          </ContainerPageHeader>

          <ContainerPageMain>
            <>
              {isLoading === true ? "loading" : null}

              {(isError === false && isLoading === false) ? (
                <Grid container sx={{ width: "100%", height: "100%" }} rowGap={1}  gap={1} justifyContent="space-around" columns={12}>
                  {getTransaction.map((transaction) => (
                    <Grid item xs={12} lg={6} mx={{xs: 0, lg:1}} sx={{ maxWidth: { xs: "100%", md: "48%" } }}>
                      <MobileTransaction item={transaction} accountId={getAccount?.account_id}/>
                      
                    </Grid>
                    
                  ))}

                </Grid>
              ) : (
                <></>
              )}
            </>
          </ContainerPageMain>
          <ContainerPageFooter>
            <>
              {isLoading === true ? <FullScreenLoader /> : null}
              {isError === true ? "Error" : null}


            </>
          </ContainerPageFooter>
        </>

      </ContainerPage>
    </Box>
  )
}

export default UserAccountTab