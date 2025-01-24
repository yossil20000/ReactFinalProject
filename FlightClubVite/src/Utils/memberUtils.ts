import { IExportExelTable } from "../Components/Report/Exel/ExportExelTable";
import { IMemberFlightSummary } from "../Interfaces/API/IMember";

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
}
export function calculateStatistic(data: IMemberFlightSummary): FlightStatisticSummary {
  try {
    let statistic_list = data.annual_summary_flights.map((item) => {
      let flightSorted = [...item.flights_summary].sort((a, b) => {
        console.log("AccountStatisticTab/calculateStatistic/sort", a, b, item)
        const diff = Number(b.year) - Number(a.year);
        return diff > 0 ? 1 : diff === 0 ? 0 : -1
      })



      let last_year = flightSorted[0].total;
      let last_year_name = flightSorted[0].year;

      let accumulatedData = flightSorted.slice(1).reduce((acc, item) => { return { total: acc.total + item.total, quarters: acc.quarters.map((q, index) => q + item.quarter[index]) } }, { total: 0, quarters: [0, 0, 0, 0] })

      return {
        _id: item._id,
        first_name: item.first_name,
        family_name: item.family_name,
        last_years: accumulatedData.total,
        this_years: last_year,
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
      totat_last_year_quarters: totat_last_year_quarters
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
  constructor(statistic_summary : FlightStatisticSummary | undefined){
      this.statistic_summary= statistic_summary ? statistic_summary : {statistic_list: [],total_last_years: 0,total_this_years: 0,totat_last_year_quarters: [0, 0, 0, 0]} ;
      console.info("CStatistToReport/CTOR_statistic_summary",this.statistic_summary)
  }
  getStatisticToExel(file: string="flightStatisticReport",sheet:string ="FlightStatistic",title:string= "Flight Statistic Reports"): IExportExelTable{
      let report : IExportExelTable = {
          file: `${file}_${new Date().getDisplayDate()}`,
          sheet: sheet,
          title: title,
          header: [],
          body: [],
          save:false
      }
      report.header=["Index","id","Name","PrevYears","LastYear","LastQ1","LastQ2","LastQ3","LastQ4"]
      report.body = this.statistic_summary.statistic_list?.map((item,i) => {
          console.info("CExpenseToReport/statistic_summary",item)
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
      console.info("CStatistToReport/report",report)
      return report;
  }
}