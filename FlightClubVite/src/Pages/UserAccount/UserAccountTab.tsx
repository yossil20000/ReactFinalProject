import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { height } from '@mui/system';
import { useMemo, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import MobileTransaction, { getSign, ShekelIcon } from '../../Components/Accounts/MobileTransaction';
import FullScreenLoader from '../../Components/FullScreenLoader';
import { useFetchAccountSearchQuery } from '../../features/Account/accountApiSlice'
import { IAccount } from '../../Interfaces/API/IAccount';
import { ITransaction } from '../../Interfaces/API/IClub';
import { ILoginResult } from '../../Interfaces/API/ILogin';
import ContainerPage, { ContainerPageFooter, ContainerPageHeader, ContainerPageMain } from '../Layout/Container'

function UserAccountTab() {
  const login: ILoginResult = useAppSelector<ILoginResult>((state) => state.authSlice);
  const [accountFilter, setAccountFilter] = useState({ member: [login.member._id ]})
  const { data, isLoading, isError } = useFetchAccountSearchQuery(accountFilter);
  const getTransaction = useMemo(() : ITransaction[] | []=> {
    if(data?.data !== null  && data?.data !== undefined){
      const account : IAccount | undefined = data.data.find((account) => account.member._id === login.member._id);  
       if(account !== undefined){
           return account.transactions 
       }
    }
    return []
  }, [data])
  const getAccount = useMemo(() : IAccount | undefined=> {
    if(data?.data !== null  && data?.data !== undefined){
      console.log("UserAccountTab/getAccount/data?.data",data?.data)
      const account : IAccount | undefined = data.data.find((account) => account.member._id === login.member._id);  
       if(account !== undefined){
           return account 
       }
    }
    return undefined
  }, [data])
  return (
    <Box fontSize={{xs: "1rem", md:"1.2rem"}}>
    <ContainerPage >
      <>
        <ContainerPageHeader>
          <Paper >
            <Box style={{display: "flex" , alignItems: "center"}}>
            <Typography sx={{fontSize: {xs: "1.1rem", md:"1.3rem"}, marginLeft: "2.5%"}}>
            Balance: <ShekelIcon sx={{ fontSize: "0.8rem" }}/>
          </Typography>
          <Typography style={{color: getSign(getAccount?.balance)}}>{getAccount?.balance}</Typography>
            </Box>
          
          <Divider/>
          </Paper>
        </ContainerPageHeader>

        <ContainerPageMain>
          <>
            {isLoading === true ? "loading" : null}
         
          {(isError === false && isLoading === false ) ? (
              <Grid container sx={{ width: "100%", height:"100%" }} gap={0} justifyContent="space-around" columns={12}>
                {getTransaction.map((transaction) => (
                  <Grid item xs={12} md={6} mx={1} sx={{maxWidth: {xs: "95%" ,md:"47%" }}}>
                  <MobileTransaction item={transaction}/>
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