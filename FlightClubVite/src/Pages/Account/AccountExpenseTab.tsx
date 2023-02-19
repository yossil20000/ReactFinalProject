import { Box, Grid } from '@mui/material'
import React, { useMemo, useState } from 'react'
import ActionButtons, { EAction } from '../../Components/Buttons/ActionButtons'
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert'
import ColumnGroupingTable, { Column } from '../../Components/ColumnGroupingTable'
import { useFetchExpenseQuery } from '../../features/Account/accountApiSlice'
import { OrderStatus } from '../../Interfaces/API/IAccount'
import { IExpense, IExpenseBase } from '../../Interfaces/API/IExpense'
import IMember from '../../Interfaces/API/IMember'
import { IStatus, Status } from '../../Interfaces/API/IStatus'
import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container'
import CreateExpenseDialog from './CreateExpenseDialog'
import CreateTransactionDialog from './CreateTransactionDialog'
import DeleteExpenseDialog from './DeleteExpenseDialog'
import UpdateExpenseDialog from './UpdateExpenseDialog'

interface Data {
  _id: string,
  date: Date,
  units: number,
  pricePeUnit: number,
  amount: number,
  category: string,
  type: string,
  utilizated:string,
  description: string,
  status: OrderStatus,
  source: IMember | string,
  destination: IMember | string,
  render?: React.ReactNode
}
function createData(_id: string, date: Date,
  units: number,
  pricePeUnit: number,
  amount: number,
  category: string,
  type: string,
  utilizated: string,
  description: string,
  status: OrderStatus,
  source: IMember | string,
  destination: IMember | string,
  render?: React.ReactNode): Data {
  return { _id, date, units, pricePeUnit, amount, category ,type,utilizated, description, status, source, destination, render }
}


function AccountExpenseTab() {
  const columns: Column[] = [
    { id: '_id', label: 'id', minWidth: 50, isCell: false, align: 'left' },
    { id: 'date', label: 'Date', minWidth: 30, isCell: true, align: 'left', format: (value: Date) => new Date(value).toLocaleDateString() },
    { id: 'units', label: 'Units', minWidth: 40, align: 'left', isCell: true },
    {
      id: 'pricePeUnit',
      label: 'Per Unit',
      minWidth: 90,
      align: 'center',
      format: (value: number) => value.toLocaleString('en-US'),
      isCell: true
    },
    { id: 'amount', label: 'Amount', minWidth: 70, align: 'left', isCell: true },
    { id: 'category', label: 'Category', minWidth: 70, align: 'left', isCell: true },
    { id: 'type', label: 'Type', minWidth: 70, align: 'left', isCell: true },
    { id: 'utilizated', label: 'Utilizated', minWidth: 70, align: 'left', isCell: true },
    { id: 'description', label: 'Description', minWidth: 170, align: 'left', isCell: true },
    { id: 'status', label: 'Status', minWidth: 70, align: 'left', format: (value: Status) => value.toLocaleUpperCase(), isCell: true },
    { id: 'source', label: 'Source', minWidth: 170, align: 'left', isCell: true },
    { id: 'destination', label: 'Destination', minWidth: 170, align: 'left', isCell: true },
    { id: 'render', label: '', minWidth: 70, align: 'center', render: (<> <ActionButtons OnAction={onAction} show={[EAction.ADD]} item={""} /></>), isCell: true }
  ];


  const { data, refetch } = useFetchExpenseQuery({});
  const [openExpenseAdd, setOpenExpenseAdd] = useState(false);
  const [openExpenseEdit, setOpenExpenseEdit] = useState(false);
  const [openAddTransaction, setOpenAddTransaction] = useState(false);
  const [openDeleteExpense,setOpenDeleteExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<IExpense | undefined>(undefined);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [filterData, setFilterData] = useState({})
  const getData = useMemo(() => {
    console.log("AccountExpenseTab/getData/expense/data", data);
    const rows = data?.data.map((row) => {
      return createData(row._id, row.date, row.units, row.pricePeUnit, row.amount, row.expense.category, row.expense.type,row.expense.utilizated, row.description, row.status, row.source.display, row.destination.display,
        <>{row.status == OrderStatus.CREATED ? (<>
          <Box display={'flex'} flexDirection={'column'} gap={1}>
            <ActionButtons OnAction={onAction} show={[EAction.EDIT]} item={row._id} display={[{ key: EAction.EDIT, value: "Edit" }]} />
            <ActionButtons OnAction={onAction} show={[EAction.PAY]} item={row._id} display={[{ key: EAction.PAY, value: "Transact" }]} />
            <ActionButtons OnAction={onAction} show={[EAction.DELETE]} item={row._id} display={[{ key: EAction.DELETE, value: "Delete" }]} />
          </Box>
        </>) : (<></>)}
        </>)
    });
    console.log("AccountExpenseTab/getData/rows", rows)
    return rows === undefined ? [] : rows;
  }, [data])

  const filterAccont = (item: Data): boolean => {
    let filter: boolean = true;
    /* if (filterData.account_id != "") {
      if (filterData.account_id !== item._id) {
        filter = false;
        return filter;
      }
    }
    if (filterData.active_only) {
      filter = item.status === Status.Active
    } */

    return filter;
  }

  const OnSelectedAccount = (item: string): void => {
    const found = data?.data.find((expense) => expense._id === item);
    console.log("AccountExpenseTab/OnSelectedAccount", found);
    setSelectedExpense(found);
  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    console.log("AccountExpenseTab/onAction", event?.target, action, item)
    switch (action) {
      case EAction.ADD:

        setOpenExpenseAdd(true)
        break;
      case EAction.EDIT:
        if (item !== undefined) {
          OnSelectedAccount(item);
          setOpenExpenseEdit(true);
        }
        break;
      case EAction.PAY:
        if (item !== undefined) {
          OnSelectedAccount(item);
          setOpenAddTransaction(true);
        }
        break;
      case EAction.DELETE:
        if(item !== undefined){
          OnSelectedAccount(item);
          setOpenDeleteExpense(true);
        }
    }
  }
  const handleAddOnClose = () => {
    setOpenExpenseAdd(false);
    setOpenExpenseEdit(false);
    setOpenAddTransaction(false);
    setOpenDeleteExpense(false)
  }
  const handleAddOnSave = () => {
    refetch();
    setOpenExpenseAdd(false);
    setOpenExpenseEdit(false);
    setOpenAddTransaction(false);
    setOpenDeleteExpense(false);
    
  }
  return (
    <Box fontSize={{ xs: "1rem", md: "1.2rem" }}>
      <ContainerPage>
        <>
          <ContainerPageHeader>

            <Box marginTop={2}>
              <Grid container width={"100%"} height={"100%"} gap={0} columns={12}>

              </Grid>
            </Box>
          </ContainerPageHeader>
          <ContainerPageMain>
            <>
              {openExpenseAdd == true ? (<CreateExpenseDialog onClose={handleAddOnClose} onSave={handleAddOnSave} open={openExpenseAdd} />) : (null)}
              {(openExpenseEdit == true && selectedExpense !== undefined) ? (<UpdateExpenseDialog value={selectedExpense} onClose={handleAddOnClose} onSave={handleAddOnSave} open={openExpenseEdit} />) : (null)}
              {(openAddTransaction == true && selectedExpense !== undefined) ? (<CreateTransactionDialog value={selectedExpense} onClose={handleAddOnClose} onSave={handleAddOnSave} open={openAddTransaction} />) : (null)}
              {(openDeleteExpense == true && selectedExpense !== undefined) ? (<DeleteExpenseDialog value={selectedExpense} onClose={handleAddOnClose} onSave={handleAddOnSave} open={openDeleteExpense} />) : (null)}
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
    </Box>
  )
}

export default AccountExpenseTab