
import { Box, Checkbox, FormControlLabel, Grid, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';

import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container';

import { SetProperty } from '../../Utils/setProperty';
import { IQuarterDateFilter, IQuarterFilter, newQuarterDateFilter } from '../../Interfaces/IDateFilter';
import { IMemberFlightSummary, MemberType } from '../../Interfaces/API/IMember';
import QuarterButtons from '../../Components/Buttons/QuarterButtons';
import { DateRangeIcon } from '@mui/x-date-pickers';
import DatePickerDate from '../../Components/Buttons/DatePickerDate';
import GeneralDrawer from '../../Components/GeneralDrawer';
import { EQuarterOption } from '../../Utils/enums';
import { useFlightSummaryMutation } from '../../features/Users/userSlice';
import { FlightStatus } from '../../Interfaces/API/IFlight';
import { IFlightSummaryFilter } from '../../Interfaces/API/IFilter';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { CStatistToReport, FlightStatisticSummary, calculateStatistic, getAllYearsColumns } from '../../Utils/memberUtils';
import ActionButtons, { EAction } from '../../Components/Buttons/ActionButtons';
import ReportDialog from '../../Components/Report/Exel/ReportDialog';


const flightSummaryProperty: IFlightSummaryFilter = {
  from: new Date(),
  to: new Date(),
  status: FlightStatus.CLOSE,
  member_type: MemberType.Member
}
type RowItem = {
  id: string;
  name: string;
  lastYears: number;
  thisYear: number;
  lastYearQ1: number;
  lastYearQ2: number;
  lastYearQ3: number;
  lastYearQ4: number;
}


const quarterDateFilter: IQuarterDateFilter = newQuarterDateFilter;

function AccountStatisticTab() {
  const [openFilter, setOpenFilter] = useState(false)
  const [GetFlightSummary, { isError, error, isLoading }] = useFlightSummaryMutation()
  const [dateTo, setDateTo] = useState(quarterDateFilter.to)
  const [dateFrom, setDateFrom] = useState(quarterDateFilter.from)
  const [filter, setFilter] = useState<IQuarterDateFilter>(quarterDateFilter);
  const [flightResults, setData] = useState<IMemberFlightSummary>();
  const [statistic, setStatistic] = useState<FlightStatisticSummary>();
  const [rows, setRows] = useState<RowItem[]>([]);
  const [openExportSave, setOpenExportSave] = useState(false);
  const [isActiveOnly, setIsActiveOnly] = useState(true);
  const [isFullReport, setIsFullReport] = useState(true);
  const [isPercentageReport, setIsPercentageReport] = useState(true);
  
  /*   if (flightResults && flightResults?.annual_summary_flights.length > 0) {
      const calculated = useDataCalculator({ data: flightResults, calculate: calculateStatistic })
      CustomLogger.info("AccountStatisticTab/calculated", calculated)
    } */
  useEffect(() => {
    let results;
    CustomLogger.info("AccountStatisticTab/flightResults", flightResults)
    if (flightResults) {
      results = calculateStatistic(flightResults, isActiveOnly)
      setStatistic(results);
      console.log("AccountStatisticTab/flightResults/results", results)
      getAllYearsColumns(flightResults, isActiveOnly)

    }
  }, [flightResults, isActiveOnly])

  useEffect(() => {
    GetFlightSummary(flightSummaryProperty).unwrap()
      .then((data) => {
        setData(data.data)
        CustomLogger.info("AccountStatisticTab/GetFlightSummary", data.data.annual_summary_flights)

      }
      )
      .catch((error) => { CustomLogger.error("AccountStatisticTab/GetFlightSummary", error) })


  }, [flightSummaryProperty])
  const OnQuarterFilterChanged = (filter: IQuarterFilter) => {
    console.log("AccountStatisticTab/OnQuarterFilterChanged/filter", filter)
    let to: Date = (new Date())
    let from: Date = (new Date())
    if (filter.quarter !== EQuarterOption.E_QO_Q0) {
      from = to.getStartQuarterDate(filter.year, filter.quarter);
      to = from.getEndQuarterDate(filter.year, filter.quarter);

    }
    else {
      from = from.getStartOfYear();
      to = to.getEndOfYear();
      console.log("AccountStatisticTab/Filter/OnQuarterFilterChanged/filter", filter)
    }
    const newFilter: IQuarterDateFilter = {
      quarterFilter: {
        quarter: filter.quarter,
        year: filter.year
      },
      from: from,
      to: to,
      currentOffset: from.getTimezoneOffset()
    }
    setFilter(newFilter);
  }
  const onDateChanged = (key: string, value: Date | null) => {
    CustomLogger.info("AccountStatisticTab/Filter/onDateChanged", key, value, filter)
    if (value === null) return;
    let newFilter = SetProperty(filter, `${key}`, new Date(value));
    newFilter = SetProperty(filter, 'quarterFilter.quarter', EQuarterOption.E_QO_Q0);
    setFilter(newFilter)
  }

  /*   function getTransactionFilter(quarterFilter: IQuarterDateFilter) : ITransactionTableFilter {
      const transactioFilter :ITransactionTableFilter = {
        dateFilter: {
          from: filter.from,
          to: filter.to,
          currentOffset: filter.currentOffset
        }
  
      }
      return transactioFilter;
    } */
  /*   const allYearsColumns = (flightResults: IMemberFlightSummary): [coloumn: any[], rows: any[], uniqueYears: string[]] => {
      let rows: any[] = [];
      const years = flightResults.annual_summary_flights.map((item) => item.flights_summary.map((flight) => flight.year)).flat();
      const uniqueYears = [...new Set(years)].sort((a, b) => Number(a) - Number(b));
      let coloumns = [{
        field: "id",
        headerName: "ID",
        type: 'string',
        description: "ID",
        sortable: true,
        minWidth: 60,
        flex: 1,
      },
      {
        field: "name",
        headerName: "Name",
        type: 'string',
        description: "Pilot name",
        sortable: true,
        minWidth: 60,
        flex: 1,
      }]
      uniqueYears.map((year) => {
        coloumns = [...coloumns, { field: year, headerName: year, type: 'number', description: `flight In year`, sortable: true, minWidth: 60, flex: 1 }]
      })
  
      const totalForYear = new Map<string, number>();
      let totalRow: any
      flightResults.annual_summary_flights.map((item) => {
        console.log("AccountStatisticTab/statistic", item)
        let row: any;
  
        uniqueYears.map((year) => {
          let flight = item.flights_summary.find((flight) => flight.year === year)
          let yearFligh = flight?.total == undefined ? 0 : flight.total
          const yT = Number((yearFligh + (totalForYear.get(year) ?? 0)).toFixed(1))
          totalForYear.set(year, yT)
          row = { [year]: yearFligh, ...row }
          totalRow = { ...totalRow, [year]: yT }
        })
        row = { ...row, id: item._id, name: `${item.family_name}, ${item.first_name}` }
        rows.push(row)
      })
      totalRow = { ...totalRow, id: "Total", name: "Total" }
      rows.push(totalRow)
      console.log("AccountStatisticTab/allYearsColumns/rows", rows, coloumns, totalForYear)
      return [coloumns, rows, uniqueYears]
  
    } */

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'ID', hideable: true, minWidth: 80, flex: 1 },
    {
      field: 'name',
      headerName: 'Name',
      type: 'string',
      description: 'Member Name',
      minWidth: 100,
      flex: 1,
      editable: false,
    },
    {
      field: 'lastYears',
      headerName: `Until ${statistic?.last_year_name}`,
      type: 'number',
      description: 'All hours until last year',
      minWidth: 60,
      flex: 1,
      editable: false,
    },
    {
      field: 'thisYear',
      headerName: `${statistic?.last_year_name}`,
      type: 'number',
      description: 'All hours until last year',
      minWidth: 50,
      flex: 1,
      editable: false,
    },
    {
      field: 'lastYearQ1',
      headerName: 'last Q1',
      type: 'number',
      description: 'Hours in last year Q1',
      sortable: true,
      minWidth: 60,
      flex: 1,
    },
    {
      field: 'lastYearQ2',
      headerName: 'last Q2',
      type: 'number',
      description: 'Hours in last year Q2',
      sortable: true,
      minWidth: 60,
      flex: 1,
    },
    {
      field: 'lastYearQ3',
      headerName: 'last Q3',
      type: 'number',
      description: 'Hours in last year Q3',
      sortable: true,
      minWidth: 60,
      flex: 1,
    },
    {
      field: 'lastYearQ4',
      headerName: 'last Q4',
      type: 'number',
      description: 'Hours in last year Q4',
      sortable: true,
      minWidth: 60,
      flex: 1,
    },
  ];

  useEffect(() => {
    let rows: RowItem[] = [];
    console.log("AccountStatisticTab/filter", filter)
    if (statistic) {
      statistic.statistic_list.map((item) => {
        console.log("AccountStatisticTab/statistic", item)
        const row: RowItem = {
          id: item._id,
          name: `${item.family_name}, ${item.first_name}`,
          lastYears: item.last_years,
          thisYear: item.this_years,
          lastYearQ1: item.last_year_quarters[0],
          lastYearQ2: item.last_year_quarters[1],
          lastYearQ3: item.last_year_quarters[2],
          lastYearQ4: item.last_year_quarters[3]
        }
        rows.push(row)
      })
      const row: RowItem = {
        id: "",
        name: `Total`,
        lastYears: statistic.total_last_years,
        thisYear: statistic.total_this_years,
        lastYearQ1: statistic.totat_last_year_quarters[0],
        lastYearQ2: statistic.totat_last_year_quarters[1],
        lastYearQ3: statistic.totat_last_year_quarters[2],
        lastYearQ4: statistic.totat_last_year_quarters[3]
      }
      rows.unshift(row);
      setRows(rows)

    }

  }, [statistic])  // eslint-disable-line react-hooks/exhaustive-deps

  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    CustomLogger.info("AccountTransactionsTab/onAction", event?.target, action, item)
    switch (action) {

      case EAction.OTHER:
        setOpenExportSave(!openExportSave);
        break;
      case EAction.SAVE:
        setOpenExportSave(!openExportSave);
        break;
    }
  }
  const [allColoumns, allRows, uniqueYears] = flightResults ? getAllYearsColumns(flightResults, isActiveOnly) : [[], [], []];
  const handleSelectActiveOnly = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    setIsActiveOnly(checked);
  }
  const handleSelectFullReport = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    setIsFullReport(checked);
  }
  const handleSelectPercentage = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    setIsPercentageReport(checked);
  }
  
  const getAllRowsPercentage = () => {
    const indexOfTotal = allRows?.findIndex((row) => row.id === "Total")
    console.log("AccountStatisticTab/getAllRows", allRows[indexOfTotal])
    let converted: any[] = []
    if (indexOfTotal >= 0) {
      converted = [...allRows.slice(0, indexOfTotal), ...allRows.slice(indexOfTotal + 1)].map((row) => {
        console.log("AccountStatisticTab/getAllRows", row)
         uniqueYears.map((year) => {
          console.log("AccountStatisticTab/getAllRows/uniqueYears", year, row[year])
          row[year] = Number(((row[year] / (allRows[indexOfTotal][year] === 0 ? 1 : allRows[indexOfTotal][year])) * 100).toFixed(2))
          console.log("AccountStatisticTab/getAllRows/uniqueYears/row[year]", year, row[year])
        })
        console.log("AccountStatisticTab/getAllRows/persent", row)
        return row
      })
      converted= [...converted.slice(0, 0), allRows[indexOfTotal], ...converted.slice(0)];
    console.log("AccountStatisticTab/getAllRows/converted", converted)
    return converted
    }
   
    return allRows
  }
  
  return (
    <ContainerPage>
      <>
        <ContainerPageHeader>
          <Box marginTop={2}>
            <Grid container width={"100%"} height={"100%"} gap={0} columns={12}>
              {/*               <Grid item xs={2} sm={2}>
                <IconButton aria-label="close" color="inherit" size="small" onClick={() => setOpenFilter(true)}>
                  <FilterListIcon fontSize="inherit" />
                </IconButton>
              </Grid> */}
              <Grid item xs={6} sm={2}>
                <FormControlLabel control={<Checkbox onChange={handleSelectActiveOnly} name={"isActiveOnly"} checked={isActiveOnly} sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }} />} label="Active Only" />
              </Grid>
              <Grid item xs={6} sm={2}>
                <FormControlLabel control={<Checkbox onChange={handleSelectFullReport} name={"isFullReport"} checked={isFullReport} sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }} />} label="Full Report" />
              </Grid>
              <Grid item xs={6} sm={2}>
                <FormControlLabel control={<Checkbox onChange={handleSelectPercentage} name={"isShowPercentage"} checked={isPercentageReport} sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }} />} label="Show as %" />
              </Grid>
              <Grid item xs={6} sm={4}>
                <ActionButtons OnAction={onAction} show={[EAction.OTHER]} item="EXPORT" display={[{ key: EAction.OTHER, value: "Export Report" }]} disable={[{ key: EAction.OTHER, value: false }]} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <ActionButtons OnAction={onAction} show={[EAction.SAVE]} item="EXPORT" display={[{ key: EAction.SAVE, value: "Export Raw Data" }]} disable={[{ key: EAction.SAVE, value: true }]} />
              </Grid>

            </Grid>
          </Box>
        </ContainerPageHeader>
        {
          (false) ? (
            <ContainerPageMain>
              <Fragment>

              </Fragment>
            </ContainerPageMain>
          ) : (
            <ContainerPageMain>
              <Fragment>
                <GeneralDrawer open={openFilter} setOpen={setOpenFilter}>
                  <List sx={{ display: 'flex', flexDirection: 'column' }}>
                    <ListItem key={"fromDate"} disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <DateRangeIcon />
                        </ListItemIcon>
                        <DatePickerDate value={filter?.from === undefined ? new Date() : new Date(filter.from)} param="from" lable='From Date' onChange={onDateChanged} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem key={"toDate"} disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <DateRangeIcon />
                        </ListItemIcon>
                        <DatePickerDate value={filter?.to === undefined ? new Date() : new Date(filter.to)} param={"to"} lable='To Date' onChange={onDateChanged} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem key={"qurater"}>
                      <QuarterButtons quarterFilter={{ quarter: filter?.quarterFilter.quarter, year: (new Date()).getFullYear() }} onChange={OnQuarterFilterChanged} />
                    </ListItem>
                  </List>
                </GeneralDrawer>
                {openExportSave && <ReportDialog onClose={() => setOpenExportSave(false)} open={openExportSave} table={(new CStatistToReport(statistic)).getStatisticToExel()} action="StatisticExport" />}
                <Box sx={{ height: '100%', width: '100%' }}>
                  <DataGrid
                    rows={isFullReport ? isPercentageReport ?getAllRowsPercentage(): allRows : rows}
                    columns={isFullReport ? allColoumns : columns}
                    initialState={{
                      columns: {
                        columnVisibilityModel: {
                          id: false,
                        }
                      },
                      pagination: {
                        paginationModel: {
                          pageSize: 15,
                        },
                      },
                    }}
                    pageSizeOptions={[15, 25, 100]}
                    checkboxSelection
                    disableRowSelectionOnClick
                  />
                </Box>
              </Fragment>
            </ContainerPageMain>
          )
        }
        <ContainerPageFooter>
          <>
          </>
        </ContainerPageFooter>
      </>
    </ContainerPage>
  )
}

export default AccountStatisticTab
