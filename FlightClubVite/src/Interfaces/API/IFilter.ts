import { FlightStatus } from "./IFlight";
import { MemberType } from "./IMember";

export interface IFilter {
  filter?:{
  },
  select?: string,
  find_select?: {
      
  }
}

export interface IFlightSummaryFilter {
  from: Date | undefined;
  to: Date | undefined;
  status: FlightStatus;
  member_type: MemberType
  }
  export function flight_summary_filter(from?: Date,to?: Date) :IFlightSummaryFilter {
    const filter : IFlightSummaryFilter =  {
      from: from,
      to: to,
      status: FlightStatus.CREATED,
      member_type: MemberType.Member
    }
    return filter;
  }
  