import '../../Types/date.extensions'
import { Box, Grid, TablePagination } from '@mui/material'
import React, { useMemo, useState } from 'react'
import ActionButtons, { EAction } from '../../Components/Buttons/ActionButtons'
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert'
import ColumnGroupingTable, { Column } from '../../Components/ColumnGroupingTable'
import { useFetchExpenseQuery } from '../../features/Account/accountApiSlice'
import { OrderStatus } from '../../Interfaces/API/IAccount'
import { IExpense } from '../../Interfaces/API/IExpense'
import IMember, { Role } from '../../Interfaces/API/IMember'
import { Status } from '../../Interfaces/API/IStatus'
import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container'
import CreateExpenseDialog from './CreateExpenseDialog'
import CreateTransactionDialog from './CreateTransactionDialog'
import DeleteExpenseDialog from './DeleteExpenseDialog'
import UpdateExpenseDialog from './UpdateExpenseDialog'
import FullScreenLoader from '../../Components/FullScreenLoader'
import { UseIsAuthorized } from '../../Components/RequireAuth';
import ReportDialog from '../../Components/Report/Exel/ReportDialog'
import { CExpenseToReport } from '../../Interfaces/API/IAccountReport'
import ExpenseTable from '../../Components/ExpensesTable'

interface Data {
  _id: string,
  date: Date,
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
  return { _id, date, units, pricePeUnit, amount, category, type, utilizated, description, status, source, destination, render }
}


function AccountExpenseTab() {
  const isAuthorized = UseIsAuthorized({ roles: [Role.desk, Role.admin, Role.account] })
  const columns: Column[] = [
    { id: '_id', label: 'id', minWidth: 50, isCell: false, align: 'left' },
    { id: 'date', label: 'Date', minWidth: 30, isCell: true, align: 'left', format: (value: Date) => new Date(value).getDisplayDate() },
    { id: 'units', label: 'Units', minWidth: 40, align: 'left', isCell: true },
    { id: 'pricePeUnit', label: 'Per Unit', minWidth: 90, align: 'center', format: (value: number) => value.toLocaleString('en-BR'), isCell: true },
    { id: 'amount', label: 'Amount', minWidth: 70, align: 'left', isCell: true },
    { id: 'category', label: 'Category', minWidth: 70, align: 'left', isCell: true },
    { id: 'type', label: 'Type', minWidth: 70, align: 'left', isCell: true },
    { id: 'utilizated', label: 'Utilizated', minWidth: 70, align: 'left', isCell: true },
    { id: 'description', label: 'Description', minWidth: 170, align: 'left', isCell: true },
    { id: 'status', label: 'Status', minWidth: 70, align: 'left', format: (value: Status) => value.toLocaleUpperCase(), isCell: true },
    { id: 'source', label: 'Source', minWidth: 170, align: 'left', isCell: true },
    { id: 'destination', label: 'Destination', minWidth: 170, align: 'left', isCell: true },
    { id: 'render', label: '', minWidth: 70, align: 'center', render: (<> <ActionButtons OnAction={onAction} show={[EAction.ADD, EAction.SAVE]} display={[{ key: EAction.SAVE, value: "Export" }]} item={""} disable={[{ key: EAction.SAVE, value: !isAuthorized }]} /></>), isCell: true }
  ];


  const { data, refetch, isLoading, error } = useFetchExpenseQuery({});
  const [openExpenseAdd, setOpenExpenseAdd] = useState(false);
  const [openExpenseSave, setOpenExpenseSave] = useState(false);
  const [openExpenseEdit, setOpenExpenseEdit] = useState(false);
  const [openAddTransaction, setOpenAddTransaction] = useState(false);
  const [openDeleteExpense, setOpenDeleteExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<IExpense | undefined>(undefined);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const getData = useMemo(() => {
    CustomLogger.info("AccountExpenseTab/getData/expense/data", data);
    let rows = data?.data.map((row) => {
      return createData(row._id, row.date, row.units, row.pricePeUnit, row.amount, row.expense.category, row.expense.type, row.expense.utilizated, row.description, row.status, row.source.display, row.destination.display,
        <>{row.status == OrderStatus.CREATED ? (<>
          <Box display={'flex'} flexDirection={'column'} gap={1}>
            <ActionButtons OnAction={onAction} show={[EAction.EDIT]} item={row._id} display={[{ key: EAction.EDIT, value: "Edit" }]} disable={[{ key: EAction.EDIT, value: !isAuthorized }]} />
            <ActionButtons OnAction={onAction} show={[EAction.PAY]} item={row._id} display={[{ key: EAction.PAY, value: "Transact" }]} disable={[{ key: EAction.PAY, value: !isAuthorized }]} />
            <ActionButtons OnAction={onAction} show={[EAction.DELETE]} item={row._id} display={[{ key: EAction.DELETE, value: "Delete" }]} disable={[{ key: EAction.DELETE, value: !isAuthorized }]} />
          </Box>
        </>) : (<></>)}
        </>)
    });
    CustomLogger.info("AccountExpenseTab/getData/rows", rows)
    rows = rows === undefined ? [] : rows;
    setCount(rows.length);
    return rows;
  }, [data,isAuthorized])


  const OnSelectedAccount = (item: string): void => {
    const found = data?.data.find((expense) => expense._id === item);
    CustomLogger.log("AccountExpenseTab/OnSelectedAccount", found);
    setSelectedExpense(found);
  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    CustomLogger.log("AccountExpenseTab/onAction", event?.target, action, item)
    switch (action) {
      case EAction.ADD:
        setOpenExpenseAdd(true)
        break;
      case EAction.SAVE:
        setOpenExpenseSave(true);
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
        if (item !== undefined) {
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
    setOpenExpenseSave(false);
  }
  const handleAddOnSave = () => {
    refetch();
    setValidationAlert([])
    setOpenExpenseAdd(false);
    setOpenExpenseEdit(false);
    setOpenAddTransaction(false);
    setOpenDeleteExpense(false);

  }
  if (isLoading) {
    CustomLogger.info('AccountExpenseTab/isLoading', isLoading)
    return (
      <div className='main' style={{ overflow: 'auto' }}>
        <FullScreenLoader />
      </div>
    )
  }

  if (error) {
    if ('status' in error) {
      // you can access all properties of `FetchBaseQueryError` here
      const errMsg = 'error' in error ? error.error : JSON.stringify(error.data)
      CustomLogger.error('AccountExpenseTab/error', errMsg)
      return (
        <div>
          <div>AccountExpenseTab</div>
          <div>An error has occurred:</div>
          <div>{errMsg}</div>
        </div>
      )
    } else {
      // you can access all properties of `SerializedError` here
      return <div>{error.message}</div>
    }
  }
  return (
    <Box fontSize={{ xs: "1rem", md: "1.2rem" }} height={'100%'}>
      <ContainerPage>
        <>
          <ContainerPageHeader>
            <Box marginTop={2}>
              <Grid container width={"100%"} height={"100%"} gap={0} columns={12}>
              <ActionButtons OnAction={onAction} show={[EAction.ADD, EAction.SAVE]} display={[{ key: EAction.SAVE, value: "Export" }]} item={""} disable={[{ key: EAction.SAVE, value: !isAuthorized }]} />
              </Grid>
            </Box>
          </ContainerPageHeader>
          <ContainerPageMain>
            <>
            {openExpenseSave && <ReportDialog onClose={handleAddOnClose} open={openExpenseSave} table={(new CExpenseToReport(data?.data ? data.data : [])).getExpesesToExel()} action="ExpenseExport" />}
              
              {openExpenseAdd == true ? (<CreateExpenseDialog onClose={handleAddOnClose} onSave={handleAddOnSave} open={openExpenseAdd} />) : (null)}
              {(openExpenseEdit == true && selectedExpense !== undefined) ? (<UpdateExpenseDialog value={selectedExpense} onClose={handleAddOnClose} onSave={handleAddOnSave} open={openExpenseEdit} />) : (null)}
              {(openAddTransaction == true && selectedExpense !== undefined) ? (<CreateTransactionDialog value={selectedExpense} onClose={handleAddOnClose} onSave={handleAddOnSave} open={openAddTransaction} />) : (null)}
              {(openDeleteExpense == true && selectedExpense !== undefined) ? (<DeleteExpenseDialog value={selectedExpense} onClose={handleAddOnClose} onSave={handleAddOnSave} open={openDeleteExpense} />) : (null)}
              {/* <ColumnGroupingTable page={page} rowsPerPage={rowsPerPage} rows={getData} columns={columns} header={[]} action={{ show: [], OnAction: onAction, item: "", disable: [] }} /> */}
              <ExpenseTable  hideAction={false} filter={{}} onAction={onAction} />
            </>
          </ContainerPageMain>
          <ContainerPageFooter>
            <>
              <Grid container>
                <Grid item xs={12}>
{/*                   <TablePagination
                    rowsPerPageOptions={[1, 5, 10, 25, 100]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  /> */}
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
    </Box>
  )
}

export default AccountExpenseTab