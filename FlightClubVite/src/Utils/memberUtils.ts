import { IExportExelTable } from "../Interfaces//IExport";
import { IFlightSummary, IMemberFlightSummary, Status } from "../Interfaces/API/IMember";
import _ from 'lodash';
export type FlightStatistic = {
  _id: string;
  family_name: string,
  first_name: string,
  last_years: number;
  this_years: number;
  last_year_quarters: number[];
}
export type FlightStatisticList = FlightStatistic[];
export type FlightStatisticSummary = {
  statistic_list: FlightStatisticList;
  total_last_years: number;
  total_this_years: number;
  totat_last_year_quarters: number[];
  last_year_name?: string;
}
type fixSummary = {
  _id: string;
  last_years_found: string;

}
type fixSummaryFlight = {
  fixSummaryFlight: fixSummary[]
  max_year_name: string;
}
function checkFlightSummaryData(data: IMemberFlightSummary): fixSummaryFlight {
  let result = false;
  let max_year_name = "0";
  let last_item_max_year = "0";
  let statistic_list = data.annual_summary_flights.map((item) => {
    /* if(item.status !== Status.Active) return { _id: item._id, last_years_found: "0" } */
    let flightSorted = [...item.flights_summary].sort((a, b) => {
      console.log("AccountStatisticTab/calculateStatistic/sort", a, b, item)
      const diff = Number(b.year) - Number(a.year);
      return diff > 0 ? 1 : diff === 0 ? 0 : -1
    })
    max_year_name = Number(flightSorted[0].year) > Number(max_year_name) ? flightSorted[0].year : max_year_name;
    last_item_max_year = flightSorted[0].year;
    let result: fixSummary = {
      _id: item._id,
      last_years_found: last_item_max_year
    }
    return result;
  })

  return { fixSummaryFlight: statistic_list, max_year_name: max_year_name };
}
function fixFlightSummaryData(data: IMemberFlightSummary, fixData: fixSummaryFlight): IMemberFlightSummary {
  let newData: IMemberFlightSummary; // = { ...data };
  let isExt = Object.isExtensible(data);
  newData = _.cloneDeep(data);
  //newData.annual_summary_flights = [...data.annual_summary_flights];
  const result = fixData.fixSummaryFlight.map((item) => {
    const numYears = Number(fixData.max_year_name) - Number(item.last_years_found);
    let foundYear: [IFlightSummary];
    for (let i = 0; i < numYears; i++) {
      console.log("AccountStatisticTab/calculateStatistic/fixFlightSummaryData", item, fixData.max_year_name, numYears)
      let newYear: IFlightSummary = { year: (Number(item.last_years_found) + 1 + i).toFixed(0), total: 0, quarter: Array(4), id: "", _id: "" }

      const found = newData.annual_summary_flights.findIndex((f) => f._id === item._id);
      foundYear = [...newData.annual_summary_flights[found].flights_summary];
      if (found >= 0) {
        newYear.quarter = [0, 0, 0, 0]
        newYear.id = foundYear[0].id;
        newYear._id = foundYear[0]._id;
        foundYear.push(newYear)

      }
      isExt = Object.isExtensible(newData.annual_summary_flights[found].flights_summary);
      isExt = Object.isSealed(newData.annual_summary_flights[found].flights_summary)
      isExt = Object.isFrozen(newData.annual_summary_flights[found].flights_summary)
      newData.annual_summary_flights[found].flights_summary = foundYear;
    }

  })
  return newData;
}

export function calculateStatistic(data: IMemberFlightSummary,isActiveOnly:boolean): FlightStatisticSummary {
  try {
    let fixSummaryFlight = checkFlightSummaryData(data);
    if (fixSummaryFlight) {
      console.info("AccountStatisticTab/calculateStatistic/fixSummaryFlight", fixSummaryFlight)
      data = fixFlightSummaryData(data, fixSummaryFlight)
    }
    let last_year_name = "1900";
    
    let statistic_list = data.annual_summary_flights.filter((itemStatus) => isActiveOnly ? itemStatus.status == Status.Active: true ).map((item) => {
      let this_year_total = 0;
      let flightSorted = [...item.flights_summary].sort((a, b) => {
        console.log("AccountStatisticTab/calculateStatistic/sort", a, b, item)
        const diff = Number(b.year) - Number(a.year);
        return diff > 0 ? 1 : diff === 0 ? 0 : -1
      })



      this_year_total = flightSorted[0].total;/*  > this_year_total ? flightSorted[0].total : this_year_total */;
      last_year_name = Number(flightSorted[0].year) > Number(last_year_name) ? flightSorted[0].year : last_year_name;

      let accumulatedData = flightSorted.slice(1).reduce((acc, item) => { return { total: acc.total + item.total, quarters: acc.quarters.map((q, index) => q + item.quarter[index]) } }, { total: 0, quarters: [0, 0, 0, 0] })

      return {
        _id: item._id,
        first_name: item.first_name,
        family_name: item.family_name,
        last_years: accumulatedData.total,
        this_years: this_year_total,
        last_year_quarters: flightSorted[0].quarter
      }
    })
    console.log("AccountStatisticTab/calculateStatistic/statistic_list", statistic_list)
    let total_last_years = 0
    let total_this_years = 0
    let totat_last_year_quarters = [0, 0, 0, 0];
    total_last_years = statistic_list.reduce((acc, item) => acc + item.last_years, 0);
    total_this_years = statistic_list.reduce((acc, item) => acc + item.this_years, 0);
    totat_last_year_quarters = statistic_list.reduce((acc, item) => {
      return item.last_year_quarters.map((q, index) => acc[index] + q)
    }, [0, 0, 0, 0])
    return {
      statistic_list: statistic_list,
      total_last_years: total_last_years,
      total_this_years: total_this_years,
      totat_last_year_quarters: totat_last_year_quarters,
      last_year_name: last_year_name
    }
  }
  catch (error) {
    CustomLogger.error("AccountStatisticTab/calculateStatistic", error)
  }
  return {
    statistic_list: [],
    total_last_years: 0,
    total_this_years: 0,
    totat_last_year_quarters: [0, 0, 0, 0]
  }
}
export class CStatistToReport {
  private statistic_summary: FlightStatisticSummary;
  constructor(statistic_summary: FlightStatisticSummary | undefined) {
    this.statistic_summary = statistic_summary ? statistic_summary : { statistic_list: [], total_last_years: 0, total_this_years: 0, totat_last_year_quarters: [0, 0, 0, 0] };
    console.info("CStatistToReport/CTOR_statistic_summary", this.statistic_summary)
  }
  getStatisticToExel(file: string = "flightRawReport", sheet: string = "FlightStatistic", title: string = "Flight Statistic Reports"): IExportExelTable {
    let report: IExportExelTable = {
      file: `${file}_${new Date().getDisplayDateTime()}`,
      sheet: sheet,
      title: title,
      header: [],
      body: [],
      save: false
    }
    report.header = ["Index", "id", "Name", `Until ${this.statistic_summary.last_year_name}`, `${this.statistic_summary.last_year_name}`, "LastQ1", "LastQ2", "LastQ3", "LastQ4"]
    report.body = this.statistic_summary.statistic_list?.map((item, i) => {
      console.info("CStatistToReport/statistic_summary", item)
      return [i.toFixed(0),
      item._id,
      item.family_name + " " + item.first_name,
      item.last_years.toFixed(1),
      item.this_years.toFixed(1),
      item.last_year_quarters[0].toFixed(1),
      item.last_year_quarters[1].toFixed(1),
      item.last_year_quarters[2].toFixed(1),
      item.last_year_quarters[3].toFixed(1)
      ]
    })
    console.info("CStatistToReport/report", report)
    return report;
  }
}
export class CFullStatistToReport {
  private rows: any[];
  uniqueYears: string[] = [];
  constructor(rows: any[] | undefined, uniqueYears: string[]) {
    this.rows = rows ? rows : [];
    this.uniqueYears = uniqueYears ? uniqueYears : [];
    console.info("CFullStatistToReport/CTOR_CFullStatistToReport", this.rows,this.uniqueYears)
  }
  getStatisticToExel(file: string = "flightStatisticReport", sheet: string = "FlightStatistic", title: string = "Flight Statistic Reports"): IExportExelTable {
    let report: IExportExelTable = {
      file: `${file}_${new Date().getDisplayDateTime()}`,
      sheet: sheet,
      title: title,
      header: [],
      body: [],
      save: false
    }

    report.header = ["Index", "id", "Name"].concat( this.uniqueYears.map((year) => year))
    report.body = this.rows?.map((item, i) => {
      console.info("CFullStatistToReport/statistic_summary", item)
      return [i.toFixed(0),item["id"],item["name"],...this.uniqueYears.map((year) => item[year].toFixed(1))]
    })
    console.info("CStatistToReport/report", report)
    return report;
  }
}

export  let getAllYearsColumns = (flightResults: IMemberFlightSummary,isActiveOnly:boolean,selectedYears: string[] | undefined): [coloumn: any[], rows: any[], uniqueYears: string[]] => {
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
      hideable: false
    },{
      field: "total",
      headerName: "Total",
      type: 'string',
      description: "Total for selected years",
      sortable: false,
      minWidth: 60,
      flex: 1,
      hideable: false
    }
  ]
    uniqueYears.map((year) => {
      coloumns = [...coloumns, { field: year, headerName: year, type: 'number', description: `flight In year`, sortable: true, minWidth: 60, flex: 1 }]
    })

    const totalForYear = new Map<string, number>();
    let totalRow: any
    flightResults.annual_summary_flights.filter((itemStatus) => isActiveOnly ? itemStatus.status == Status.Active: true ).map((item) => {
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
    rows.unshift(totalRow)
    //rows.push(totalRow)
    const totalForSelectedYears = rows.map((row:any) => {
      let total: number = 0;
      (selectedYears === undefined ? uniqueYears : selectedYears)?.map((year) => {
        if (year != "" && typeof Number(row[year] === "number"))
          total += Number(row[year])
      })
      return { 'total': Number(total.toFixed(2)), ...row }
    })
    console.log("AccountStatisticTab/onColumnVisibilityModelChange/gridSelectedYears", selectedYears, totalForSelectedYears)
    console.log("AccountStatisticTab/allYearsColumns/rows, coloumns,uniqueYears, totalForYear", rows, coloumns,uniqueYears, totalForYear)
    return [coloumns, totalForSelectedYears, uniqueYears]

  }