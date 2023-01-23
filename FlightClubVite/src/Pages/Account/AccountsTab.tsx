import { Box, Checkbox, FormControlLabel, Grid } from '@mui/material'
import React, { useMemo, useState } from 'react'
import AccountsCombo from '../../Components/Accounts/AccountsCombo'
import ActionButtons, { EAction } from '../../Components/Buttons/ActionButtons'
import { InputComboItem } from '../../Components/Buttons/ControledCombo'
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert'
import ColumnGroupingTable, { Column } from '../../Components/ColumnGroupingTable'
import { useFetchAllAccountsQuery } from '../../features/Account/accountApiSlice'
import { Status } from '../../Interfaces/API/IStatus'
import ContainerPage, { ContainerPageFooter, ContainerPageHeader, ContainerPageMain } from '../Layout/Container'


interface Data {
  _id: string;
  account_id: string;
  name: string;
  balance: number;
  status: Status;
}

function createData(
  _id: string,
  account_id: string,
  name: string,
  balance: number,
  status: Status,
): Data {

  return { _id, account_id, name, balance, status };
}
;

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
];
interface IAccountFilter {
  account_id: string;
  active_only: boolean;
}
function AccountsTab() {
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const { data } = useFetchAllAccountsQuery();
  const [filterData, setFilterData] = useState({ account_id: "", active_only: false } as IAccountFilter)
  const getData = useMemo(() => {
    const rows = data?.data.map((row) => createData(row._id, row.account_id, row.member?.family_name, row.balance, row.status))
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

  const onValidationAlertClose = () => {
    setValidationAlert([]);
  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event?.defaultPrevented
    console.log("Account/ActionButtons/onAction", event?.target, action)
    switch (action) {
      case EAction.ADD:

        break;
      case EAction.DELETE:
        /* onDelete(); */
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
  return (
    <ContainerPage>
      <>
        <ContainerPageHeader>
          <Box marginTop={2}>
            <Grid container width={"100%"} height={"100%"} gap={0} columns={12}>
              <Grid item xs={12} >
                <Box className='yl__action_button' >
                  <ActionButtons OnAction={onAction} show={[EAction.SAVE, EAction.ADD]} item={""} />
                </Box>
              </Grid>
              <Grid item xs={6}  >
                <AccountsCombo onChanged={onAccountChange} source={"_accounts"} />

              </Grid >
              <Grid item xs={6}>
                <FormControlLabel control={<Checkbox onChange={handleFilterChange} name={"active_only"} checked={filterData?.active_only} sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }} />} label="Active Only" />
              </Grid>
            </Grid>
          </Box>
        </ContainerPageHeader>
        <ContainerPageMain>
          <><ColumnGroupingTable rows={getData.filter(filterAccont)} columns={columns} header={[]} action={{ show: [], OnAction: onAction, item: "" }} /></>
        </ContainerPageMain>
        <ContainerPageFooter>
          <>
            <Box className='yl__action_button' >
              <ActionButtons OnAction={onAction} show={[EAction.SAVE, EAction.ADD]} item={""} />
            </Box>
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