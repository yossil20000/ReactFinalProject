import { Box, Checkbox, FormControlLabel, Grid } from '@mui/material'
import React, { useMemo, useState } from 'react'
import AccountsCombo from '../../Components/Accounts/AccountsCombo'
import ClubAccountsCombo from '../../Components/Accounts/ClubAccountsCombo'
import ActionButtons, { EAction } from '../../Components/Buttons/ActionButtons'
import { InputComboItem } from '../../Components/Buttons/ControledCombo'
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert'
import ColumnGroupingTable, { Column } from '../../Components/ColumnGroupingTable'
import { useClubAccountQuery, useFetchAllAccountsQuery } from '../../features/Account/accountApiSlice'
import { IAccount } from '../../Interfaces/API/IAccount'
import { IClubAccount } from '../../Interfaces/API/IClub'
import { Status } from '../../Interfaces/API/IStatus'
import ContainerPage, { ContainerPageFooter, ContainerPageHeader, ContainerPageMain } from '../Layout/Container'
import AddAccountToBankDialog from './AddAccountToBankDialog'
import CreateAccountDialog from './CreateAccountDialog'
import UpdateAccountDialog from './UpdateAccountDialog'


interface Data {
  bank: React.ReactNode,
  _id: string;
  account_id: string;
  name: string;
  balance: number;
  status: Status;
  desctiption: string,
  render?: React.ReactNode
}

function createData(
  bank: React.ReactNode,
  _id: string,
  account_id: string,
  name: string,
  balance: number,
  status: Status,
  desctiption: string,
  render?: React.ReactNode
): Data {

  return { bank, _id, account_id, name, balance, status, desctiption, render };
}
;


interface IAccountFilter {
  account_id: string;
  active_only: boolean;
}
function AccountsTab() {
  const columns: Column[] = [
    {
      id: 'bank',
      label: 'Bank',
      minWidth: 170,
      align: 'left',
      render: (<> <ActionButtons OnAction={onAction} show={[EAction.ADD]} item={""} /></>),
      isCell: true
    },
    { id: 'account_id', label: 'Account Number', minWidth: 170, isCell: true, align: 'left' },
    { id: 'name', label: 'Name', minWidth: 100, align: 'left', isCell: true },
    {
      id: 'balance',
      label: 'Balance',
      minWidth: 170,
      align: 'center',
      format: (value: number) => value.toLocaleString('en-US'),
      isCell: true
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 170,
      align: 'left',
      format: (value: Status) => value.toLocaleUpperCase(),
      isCell: true
    },
    {
      id: 'desctiption',
      label: 'Description',
      minWidth: 170,
      align: 'left',
      isCell: true
    },
    {
      id: 'render',
      label: '',
      minWidth: 170,
      align: 'center',
      render: (<> <ActionButtons OnAction={onAction} show={[EAction.ADD]} item={""} /></>),
      isCell: true
    }
  ];
  const [openAccountAdd, setOpenAccountAdd] = useState(false);
  const [openAddToBank, setOpenAddToBank] = useState(false);
  const [openAccountEdit, setOpenAccountEdit] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<IAccount | undefined>(undefined);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [bank, setBank] = useState<IClubAccount | undefined>();
  const { data, refetch } = useFetchAllAccountsQuery({});
  const { data: bankAccounts } = useClubAccountQuery();
  const [filterData, setFilterData] = useState({ account_id: "", active_only: false } as IAccountFilter)
  const getData = useMemo(() => {
    let bankFound : IClubAccount | undefined = undefined;
    if (bankAccounts?.data !== undefined && bankAccounts?.data.length > 0) {
      bankFound = bankAccounts?.data.find((bank) => (bank.club.brand === "BAZ" && bank.club.branch === "HAIFA"))
      setBank(bankFound)
    }
    const rows = data?.data.map((row) => {
      let bankRow: React.ReactNode = <><ActionButtons OnAction={onBankAction} show={[EAction.ADD]} item={row.account_id} /></>;
      console.log("getData/bank", bankAccounts);
      
      let foundAccount : IAccount | undefined = undefined
      
      if (bankFound !== undefined) {
        console.log("getData/bank,row", bankFound.accounts,row.account_id);
        foundAccount = bankFound.accounts.find((account) => account.account_id == row.account_id)
        console.log("getData/foundAccount", foundAccount);
        if(foundAccount)
        bankRow = <Box><div>{bankFound.club.brand}/{bankFound.club.branch}</div><div>{bankFound.club.account_id}</div></Box>
      }
      return createData(bankRow, row._id, row.account_id, row.member?.family_name, row.balance, row.status, row.desctiption, <><ActionButtons OnAction={onAction} show={[EAction.EDIT]} item={row.account_id} /></>)
    })
    console.log("Account/getData", rows)
    return rows === undefined ? [] : rows;
  }, [data, bankAccounts])

  const filterAccont = (item: Data): boolean => {
    let filter: boolean = true;
    if (filterData.account_id != "") {
      if (filterData.account_id !== item._id) {
        filter = false;
        return filter;
      }
    }
    if (filterData.active_only) {
      filter = item.status === Status.Active
    }

    return filter;
  }
  const OnSelectedAccount = (item: string): void => {
    const found = data?.data.find((account) => account.account_id === item);

    setSelectedAccount(found);
  }
  function onBankAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    console.log("Account/ActionButtons/onBankAction", event?.target, action, item)
    switch (action) {
      case EAction.ADD:
        if (item !== undefined) {
          OnSelectedAccount(item);
          setOpenAddToBank(true)
        }
        break;
    }
  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    console.log("Account/ActionButtons/onAction", event?.target, action, item)
    switch (action) {
      case EAction.ADD:

        setOpenAccountAdd(true)
        break;
      case EAction.EDIT:
        if (item !== undefined) {
          OnSelectedAccount(item);
          setOpenAccountEdit(true);
        }
        break;
      case EAction.SAVE:
        /* onSave() */
        break;
    }
  }
  const onAccountChange = (item: InputComboItem) => {
    const filter: IAccountFilter = filterData;
    filter.account_id = item._id;
    console.log("Account/onAccountChange/filter", filter)
    setFilterData((prev) => ({ ...prev, account_id: item._id }));

  }
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Account/handleBoolainChange", event.target.name, event.target.checked)

    setFilterData((prev: any) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };
  const handleAddOnClose = () => {
    setOpenAccountAdd(false);
    setOpenAccountEdit(false);
    setOpenAddToBank(false)
  }
  const handleAddOnSave = (value: IAccount) => {
    refetch();
    setOpenAccountAdd(false);
    setOpenAccountEdit(false);
    setOpenAddToBank(false)
    console.log("Account/handleAddOnSave/value", value);

  }


  return (
    <ContainerPage>
      <>
        <ContainerPageHeader>
          <Box marginTop={2}>
            <Grid container width={"100%"} height={"100%"} gap={0} columns={12}>

              <Grid item xs={4}  >
                <ClubAccountsCombo onChanged={onAccountChange} source={"_accounts"} />
                <AccountsCombo onChanged={onAccountChange} source={"_accounts"} />

              </Grid >
              <Grid item xs={4}>
                <FormControlLabel control={<Checkbox onChange={handleFilterChange} name={"active_only"} checked={filterData?.active_only} sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }} />} label="Active Only" />
              </Grid>
            </Grid>
          </Box>
        </ContainerPageHeader>
        <ContainerPageMain>
          <>
          {(openAddToBank == true && bank !== undefined && selectedAccount !== undefined) ? (<AddAccountToBankDialog value={selectedAccount} onClose={handleAddOnClose} onSave={handleAddOnSave} open={openAddToBank} bank={bank}/>) : (null)}
            {openAccountAdd == true ? (<CreateAccountDialog onClose={handleAddOnClose} onSave={handleAddOnSave} open={openAccountAdd} />) : (null)}
            {(openAccountEdit == true && selectedAccount !== undefined) ? (<UpdateAccountDialog value={selectedAccount} onClose={handleAddOnClose} onSave={handleAddOnSave} open={openAccountEdit} />) : (null)}
            <ColumnGroupingTable rows={getData.filter(filterAccont)} columns={columns} header={[]} action={{ show: [], OnAction: onAction, item: "" }} />
          </>


        </ContainerPageMain>
        <ContainerPageFooter>
          <>

            <Grid container>
              {validationAlert.map((item) => (
                <Grid item xs={12}>

                  <ValidationAlert {...item} />

                </Grid>
              ))}
            </Grid></>
        </ContainerPageFooter>
      </>

    </ContainerPage>
  )
}

export default AccountsTab