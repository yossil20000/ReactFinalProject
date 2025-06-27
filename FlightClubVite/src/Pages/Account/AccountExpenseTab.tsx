import "../../Types/date.extensions";
import {
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import React, { useState } from "react";
import ActionButtons, { EAction } from "../../Components/Buttons/ActionButtons";
import {
  IValidationAlertProps,
  ValidationAlert,
} from "../../Components/Buttons/TransitionAlert";
import { useFetchExpenseQuery } from "../../features/Account/accountApiSlice";
import { OrderStatus } from "../../Interfaces/API/IAccount";
import { CExpenseGroupToReport, IExpense } from "../../Interfaces/API/IExpense";
import IMember, { Role } from "../../Interfaces/API/IMember";
import ContainerPage, {
  ContainerPageHeader,
  ContainerPageMain,
  ContainerPageFooter,
} from "../Layout/Container";
import CreateExpenseDialog from "./CreateExpenseDialog";
import CreateTransactionDialog from "./CreateTransactionDialog";
import DeleteExpenseDialog from "./DeleteExpenseDialog";
import UpdateExpenseDialog from "./UpdateExpenseDialog";
import FullScreenLoader from "../../Components/FullScreenLoader";
import { UseIsAuthorized } from "../../Components/RequireAuth";
import ReportDialog from "../../Components/Report/Exel/ReportDialog";
import { CExpenseToReport } from "../../Interfaces/API/IAccountReport";
import ExpenseTable from "../../Components/ExpensesTable";
import FilterListIcon from "@mui/icons-material/FilterList";
import { DateRangeIcon } from "@mui/x-date-pickers";
import DatePickerDate from "../../Components/Buttons/DatePickerDate";
import GeneralDrawer from "../../Components/GeneralDrawer";
import { SetProperty } from "../../Utils/setProperty";
import { IDateFilter } from "../../Interfaces/IDateFilter";
import { from_to_year_Filter } from "../../Utils/filtering";
import { getFilter, IFilter } from "../../Interfaces/API/IFilter";
interface Data {
  _id: string;
  date: Date;
  units: number;
  pricePeUnit: number;
  amount: number;
  category: string;
  type: string;
  utilizated: string;
  description: string;
  status: OrderStatus;
  source: IMember | string;
  destination: IMember | string;
  render?: React.ReactNode;
}

function AccountExpenseTab() {
  const isAuthorized = UseIsAuthorized({
    roles: [Role.desk, Role.admin, Role.account],
  });
  const [openFilter, setOpenFilter] = useState(false);
  const [filter, setFilter] = useState<IDateFilter>({currentOffset: 0, from: new Date().getStartOfYear().getMidDayDate(), to: new Date().getEndOfYear().getMidDayDate()} as IDateFilter);
  const { data, refetch, isLoading, error } = useFetchExpenseQuery(filter);
  const [openExpenseAdd, setOpenExpenseAdd] = useState(false);
  const [openExpenseSave, setOpenExpenseSave] = useState(false);
  const [openExpenseUtilizedSave, setOpenExpenseUtilizedSave] = useState(false);
  const [openExpenseCategorySave, setOpenExpenseCategorySave] = useState(false);
  const [openExpenseEdit, setOpenExpenseEdit] = useState(false);
  const [openAddTransaction, setOpenAddTransaction] = useState(false);
  const [openDeleteExpense, setOpenDeleteExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<IExpense | undefined>(
    undefined
  );
  const [validationAlert, setValidationAlert] = useState<
    IValidationAlertProps[]
  >([]);

  const OnSelectedAction = (item: string): void => {
    const found = data?.data.find((expense) => expense._id === item);
    CustomLogger.log("AccountExpenseTab/OnSelectedAction", found);
    setSelectedExpense(found);
  };
  function onAction(
    action: EAction,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item?: string
  ) {
    event?.defaultPrevented;
    CustomLogger.log("AccountExpenseTab/onAction", event?.target, action, item);
    switch (action) {
      case EAction.EDIT:
        if (item !== undefined) {
          OnSelectedAction(item);
          setOpenExpenseEdit(true);
        }
        break;
      case EAction.PAY:
        if (item !== undefined) {
          OnSelectedAction(item);
          setOpenAddTransaction(true);
        }
        break;
      case EAction.DELETE:
        if (item !== undefined) {
          OnSelectedAction(item);
          setOpenDeleteExpense(true);
        }
        break;
    }
  }
  function onActionGeneral(
    action: EAction,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item?: string
  ) {
    event?.defaultPrevented;
    CustomLogger.log("AccountExpenseTab/onAction", event?.target, action, item);
    switch (action) {
      case EAction.ADD:
        setOpenExpenseAdd(true);
        break;
      case EAction.SAVE:
        setOpenExpenseSave(true);
        break;
      case EAction.PAY:
        setOpenExpenseCategorySave(true);
        break;
      case EAction.OTHER:
        setOpenExpenseUtilizedSave(true);
    }
  }
  const handleAddOnClose = () => {
    setOpenExpenseAdd(false);
    setOpenExpenseEdit(false);
    setOpenAddTransaction(false);
    setOpenDeleteExpense(false);
    setOpenExpenseSave(false);
    setOpenExpenseUtilizedSave(false);
    setOpenExpenseCategorySave(false);
  };
  const handleAddOnSave = () => {
    refetch();
    setValidationAlert([]);
    setOpenExpenseAdd(false);
    setOpenExpenseEdit(false);
    setOpenAddTransaction(false);
    setOpenDeleteExpense(false);
  };
  if (isLoading) {
    CustomLogger.info("AccountExpenseTab/isLoading", isLoading);
    return (
      <div className="main" style={{ overflow: "auto" }}>
        <FullScreenLoader />
      </div>
    );
  }

  if (error) {
    if ("status" in error) {
      // you can access all properties of `FetchBaseQueryError` here
      const errMsg =
        "error" in error ? error.error : JSON.stringify(error.data);
      CustomLogger.error("AccountExpenseTab/error", errMsg);
      return (
        <div>
          <div>AccountExpenseTab</div>
          <div>An error has occurred:</div>
          <div>{errMsg}</div>
        </div>
      );
    } else {
      // you can access all properties of `SerializedError` here
      return <div>{error.message}</div>;
    }
  }
  const onDateChanged = (key: string, value: Date | null) => {
    CustomLogger.log("AccountExpenseTab/onDateChanged", key, value);
    if (value == null) return;
    const newFilter = SetProperty(filter, key, new Date(value));
    setFilter(newFilter);
    CustomLogger.log("AccountExpenseTab/onDateChanged", newFilter);
    refetch();
  };
  return (
    <Box fontSize={{ xs: "1rem", md: "1.2rem" }} height={"100%"}>
      <ContainerPage>
        <>
          <ContainerPageHeader>
            <Box marginTop={2}>
              <Grid
                container
                width={"100%"}
                height={"100%"}
                gap={0}
                columns={12}
              >
                <Grid item xs={12} md={1}>
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => setOpenFilter(true)}
                  >
                    <FilterListIcon fontSize="inherit" />
                  </IconButton>
                </Grid>
                <Grid item xs={12} md={1}>
                  <ActionButtons
                    OnAction={onActionGeneral}
                    show={[EAction.ADD]}
                    display={[{ key: EAction.ADD, value: "Add" }]}
                    item={""}
                    disable={[{ key: EAction.ADD, value: !isAuthorized }]}
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <ActionButtons
                    OnAction={onActionGeneral}
                    show={[EAction.SAVE]}
                    display={[{ key: EAction.SAVE, value: "Export" }]}
                    item={""}
                    disable={[{ key: EAction.SAVE, value: false }]}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <ActionButtons
                    OnAction={onActionGeneral}
                    show={[EAction.OTHER]}
                    display={[
                      { key: EAction.OTHER, value: "ExportBy Utilized" },
                    ]}
                    item={""}
                    disable={[{ key: EAction.OTHER, value: false }]}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <ActionButtons
                    OnAction={onActionGeneral}
                    show={[EAction.PAY]}
                    display={[{ key: EAction.PAY, value: "ExportBy Category" }]}
                    item={""}
                    disable={[{ key: EAction.PAY, value: false }]}
                  />
                </Grid>
              </Grid>
            </Box>
          </ContainerPageHeader>
          <ContainerPageMain>
            <>
              <GeneralDrawer open={openFilter} setOpen={setOpenFilter}>
                <List sx={{ display: "flex", flexDirection: "column" }}>
                  <ListItem key={"fromDate"} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <DateRangeIcon />
                      </ListItemIcon>
                      <DatePickerDate
                        value={
                          filter?.from === undefined ? new Date() : filter.from
                        }
                        param="from"
                        lable="From Date"
                        onChange={onDateChanged}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem key={"toDate"} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <DateRangeIcon />
                      </ListItemIcon>
                      <DatePickerDate
                        value={filter.to === undefined ? new Date() : filter.to}
                        param={"to"}
                        lable="To Date"
                        onChange={onDateChanged}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </GeneralDrawer>
              {openExpenseSave && (
                <ReportDialog
                  onClose={handleAddOnClose}
                  open={openExpenseSave}
                  table={new CExpenseToReport(
                    data?.data ? data.data : []
                  ).getExpesesToExel()}
                  action="ExpenseExport"
                />
              )}
              {openExpenseUtilizedSave && (
                <ReportDialog
                  onClose={handleAddOnClose}
                  open={openExpenseUtilizedSave}
                  table={new CExpenseGroupToReport(
                    data?.data ? data.data : []
                  ).getExpesesUtilizationToExel()}
                  action="ExpenseGroupExport"
                />
              )}
              {openExpenseCategorySave && (
                <ReportDialog
                  onClose={handleAddOnClose}
                  open={openExpenseCategorySave}
                  table={new CExpenseGroupToReport(
                    data?.data ? data.data : []
                  ).getExpesesCategoryToExel()}
                  action="ExpenseCategoryExport"
                />
              )}
              {openExpenseAdd == true ? (
                <CreateExpenseDialog
                  onClose={handleAddOnClose}
                  onSave={handleAddOnSave}
                  open={openExpenseAdd}
                />
              ) : null}
              {openExpenseEdit == true && selectedExpense !== undefined ? (
                <UpdateExpenseDialog
                  value={selectedExpense}
                  onClose={handleAddOnClose}
                  onSave={handleAddOnSave}
                  open={openExpenseEdit}
                />
              ) : null}
              {openAddTransaction == true && selectedExpense !== undefined ? (
                <CreateTransactionDialog
                  value={selectedExpense}
                  onClose={handleAddOnClose}
                  onSave={handleAddOnSave}
                  open={openAddTransaction}
                />
              ) : null}
              {openDeleteExpense == true && selectedExpense !== undefined ? (
                <DeleteExpenseDialog
                  value={selectedExpense}
                  onClose={handleAddOnClose}
                  onSave={handleAddOnSave}
                  open={openDeleteExpense}
                />
              ) : null}
              {/* <ColumnGroupingTable page={page} rowsPerPage={rowsPerPage} rows={getData} columns={columns} header={[]} action={{ show: [], OnAction: onAction, item: "", disable: [] }} /> */}
              <ExpenseTable
                hideAction={false}
                filter={filter}
                onAction={onAction}
              />
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
              </Grid>
            </>
          </ContainerPageFooter>
        </>
      </ContainerPage>
    </Box>
  );
}

export default AccountExpenseTab;
