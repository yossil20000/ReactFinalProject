import { Box, Checkbox, FormControlLabel, Grid, TablePagination } from '@mui/material'
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
import { MemberType } from '../../Interfaces/API/IMember'
import { Status } from '../../Interfaces/API/IStatus'
import ContainerPage, { ContainerPageFooter, ContainerPageHeader, ContainerPageMain } from '../Layout/Container'
import AddAccountToBankDialog from './AddAccountToBankDialog'
import CreateAccountDialog from './CreateAccountDialog'
import UpdateAccountDialog from './UpdateAccountDialog'


interface Data {
  bank: React.ReactNode,
  _id: string;
  account_id: string;
  member_type: MemberType;
  name: string;
  balance: number;
  status: Status;
  description: string,
  render?: React.ReactNode
}

function createData(
  bank: React.ReactNode,
  _id: string,
  account_id: string,
  member_type: MemberType,
  name: string,
  balance: number,
  status: Status,
  description: string,
  render?: React.ReactNode
): Data {

  return { bank, _id, account_id, member_type, name, balance, status, description, render };
}
;


interface IAccountFilter {
  account_id: string;
  active_only: boolean;
}
function AccountsTab() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
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
    { id: 'member_type', label: 'Type', minWidth: 170, isCell: true, align: 'left' },
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
      id: 'description',
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
  const { data: bankAccounts } = useClubAccountQuery(true);
  const [filterData, setFilterData] = useState({ account_id: "", active_only: false } as IAccountFilter)
  const getData = useMemo(() => {
    let bankFound: IClubAccount | undefined = undefined;
    if (bankAccounts?.data !== undefined && bankAccounts?.data.length > 0) {
      bankFound = bankAccounts?.data.find((bank) => (bank.club.brand === "BAZ" && bank.club.branch === "HAIFA"))
      setBank(bankFound)
    }
    console.log("getData/bankAccounts,bank", bankAccounts, bank);

    const rows = data?.data.map((row) => {
      let bankRow: React.ReactNode = <><ActionButtons OnAction={onBankAction} show={[EAction.ADD]} item={row.account_id} /></>;

      let foundAccount: IAccount | undefined = undefined

      if (bankFound !== undefined) {
        console.log("getData/bank,row", bankFound.accounts, row.account_id);
        foundAccount = bankFound.accounts.find((account) => account.account_id == row.account_id)
        console.log("getData/foundAccount", foundAccount);
        if (foundAccount)
          bankRow = <Box><div>{bankFound.club.brand}/{bankFound.club.branch}</div><div>{bankFound.club.account_id}</div></Box>
      }
      return createData(bankRow, row._id, row.account_id, row.member?.member_type, row.member?.family_name, row.balance, row.status, row.description, <><ActionButtons OnAction={onAction} show={[EAction.EDIT]} item={row.account_id} /></>)
    })
    console.log("Account/getData", rows)
    return rows === undefined ? [] : rows;
  }, [data, bankAccounts, bank])

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
  const OnSelectedClubAccount = (item: InputComboItem): void => {
    let bankFound: IClubAccount | undefined = undefined;
    if (bankAccounts?.data !== undefined && bankAccounts?.data.length > 0) {
      bankFound = bankAccounts?.data.find((bank) => (bank._id === item._id))
      console.log("Account/OnSelectedClubAccount/item,bank", item, bankFound)
      setBank(bankFound)
    }

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
  const onBankAccountChange = (item: InputComboItem) => {
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
  const RenderClubAccount = useMemo(() => {

    return (
      <Box>
        {bank !== undefined ? (<>{bank.club.brand}/{bank.club.branch}/{bank.club.account_id} {bank.balance}</>) : (<>Undefined</>)}
      </Box>
    )
  }, [bank])

  return (
    <ContainerPage>
      <>
        <ContainerPageHeader>

          <Box marginTop={2}>
            <Grid container width={"100%"} height={"100%"} gap={0} columns={12}>
              <Grid item xs={12}>
                {RenderClubAccount}
              </Grid>

              <Grid item xs={4}  >
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
            {(openAddToBank == true && bank !== undefined && selectedAccount !== undefined) ? (<AddAccountToBankDialog value={selectedAccount} onClose={handleAddOnClose} onSave={handleAddOnSave} open={openAddToBank} bank={bank} />) : (null)}
            {openAccountAdd == true ? (<CreateAccountDialog onClose={handleAddOnClose} onSave={handleAddOnSave} open={openAccountAdd} />) : (null)}
            {(openAccountEdit == true && selectedAccount !== undefined) ? (<UpdateAccountDialog value={selectedAccount} onClose={handleAddOnClose} onSave={handleAddOnSave} open={openAccountEdit} />) : (null)}
            <ColumnGroupingTable page={page} rowsPerPage={rowsPerPage} rows={getData.filter(filterAccont)} columns={columns} header={[]} action={{ show: [], OnAction: onAction, item: "" }} />
          </>


        </ContainerPageMain>
        <ContainerPageFooter>
          <>

            <Grid container>
              <Grid item xs={12}>
                <TablePagination
                  rowsPerPageOptions={[1,5, 10, 25, 100]}
                  component="div"
                  count={getData.filter(filterAccont).length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Grid>
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