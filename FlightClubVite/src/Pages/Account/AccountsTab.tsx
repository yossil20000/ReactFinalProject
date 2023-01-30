import { Box, Checkbox, FormControlLabel, Grid } from '@mui/material'
import React, { useMemo, useState } from 'react'
import AccountsCombo from '../../Components/Accounts/AccountsCombo'
import ActionButtons, { EAction } from '../../Components/Buttons/ActionButtons'
import { InputComboItem } from '../../Components/Buttons/ControledCombo'
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert'
import ColumnGroupingTable, { Column } from '../../Components/ColumnGroupingTable'
import { useFetchAllAccountsQuery } from '../../features/Account/accountApiSlice'
import { IAccount } from '../../Interfaces/API/IAccount'
import { Status } from '../../Interfaces/API/IStatus'
import ContainerPage, { ContainerPageFooter, ContainerPageHeader, ContainerPageMain } from '../Layout/Container'
import CreateAccountDialog from './CreateAccountDialog'
import UpdateAccountDialog from './UpdateAccountDialog'


interface Data {
  _id: string;
  account_id: string;
  name: string;
  balance: number;
  status: Status;
  desctiption: string,
  render?: React.ReactNode
}

function createData(
  _id: string,
  account_id: string,
  name: string,
  balance: number,
  status: Status,
  desctiption: string,
  render?: React.ReactNode
): Data {

  return { _id, account_id, name, balance, status,desctiption, render };
}
;


interface IAccountFilter {
  account_id: string;
  active_only: boolean;
}
function AccountsTab() {
  const columns: Column[] = [
    { id: 'account_id', label: 'Account Number', minWidth: 170, isCell: true },
    { id: 'name', label: 'Name', minWidth: 100, isCell: true },
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
      align: 'right',
      format: (value: Status) => value.toLocaleUpperCase(),
      isCell: true
    },
    {
      id: 'desctiption',
      label: 'Description',
      minWidth: 170,
      align: 'right',
      isCell: true
    },
    {
      id: 'render',
      label: '',
      minWidth: 170,
      align: 'right',
      render: (<> <ActionButtons OnAction={onAction} show={[EAction.ADD]} item={""} /></>),
      isCell: true
    }
  ];
  const [openAccountAdd, setOpenAccountAdd] = useState(false);
  const [openAccountEdit, setOpenAccountEdit] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<IAccount | undefined>(undefined);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const { data, refetch } = useFetchAllAccountsQuery({});
  const [filterData, setFilterData] = useState({ account_id: "", active_only: false } as IAccountFilter)
  const getData = useMemo(() => {
    const rows = data?.data.map((row) => createData(row._id, row.account_id, row.member?.family_name, row.balance, row.status, row.desctiption ,<><ActionButtons OnAction={onAction} show={[EAction.EDIT]} item={row.account_id} /></>))
    console.log("Account/getData", rows)
    return rows === undefined ? [] : rows;
  }, [data])

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
  }
  const handleAddOnSave = (value: IAccount) => {
    refetch();
    setOpenAccountAdd(false);
    setOpenAccountEdit(false);
    console.log("Account/handleAddOnSave/value", value);

  }


  return (
    <ContainerPage>
      <>
        <ContainerPageHeader>
          <Box marginTop={2}>
            <Grid container width={"100%"} height={"100%"} gap={0} columns={12}>

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