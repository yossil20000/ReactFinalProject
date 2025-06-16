import { FlightStatus } from "./IFlight";
import { MemberType } from "./IMember";

/**
 * Interface representing filter options for API queries.
 * @interface
 * @property {object} [filter] - Optional filter criteria for querying data.
 * @property {string | null} [select] - Optional string specifying fields to select in the query response.
 * @property {object} [find_select] - Optional object containing specific selection criteria for find operations.
 */
export interface IFilter {
  filter?: {
  },
  select?: string | null,
  find_select?: {

  }
}

/**
 * Interface representing filtering criteria for flight summaries
 * @interface IFlightSummaryFilter
 * @property {Date | undefined} from - Start date for the filter range
 * @property {Date | undefined} to - End date for the filter range 
 * @property {FlightStatus} status - Status of the flight to filter by
 * @property {MemberType} member_type - Type of member to filter by
 */
export interface IFlightSummaryFilter {
  from: Date | undefined;
  to: Date | undefined;
  status: FlightStatus;
  member_type: MemberType
}
/**
 * Creates a flight summary filter with default values and optional date range.
 * 
 * @param from - Optional start date for the filter range
 * @param to - Optional end date for the filter range
 * @returns An IFlightSummaryFilter object with default status CREATED and member type Member
 * 
 * @example
 * // Filter flights between two dates
 * const filter = flight_summary_filter(new Date('2023-01-01'), new Date('2023-12-31'))
 * 
 * // Filter with no date constraints
 * const allFilter = flight_summary_filter()
 */
export function flight_summary_filter(from?: Date, to?: Date): IFlightSummaryFilter {
  const filter: IFlightSummaryFilter = {
    from: from,
    to: to,
    status: FlightStatus.CREATED,
    member_type: MemberType.Member
  }
  return filter;
}

/**
 * Creates a filter object for API queries with date range and selection criteria
 * @param from - Optional start date for the filter range. Defaults to start of current year
 * @param to - Optional end date for the filter range. Defaults to end of current year 
 * @param select - Optional string parameter to specify fields to select. Defaults to null
 * @param find_select - Optional object containing additional find/select criteria. Defaults to empty object
 * @returns {IFilter} Filter object containing date range, timezone offset and selection parameters
 */
export function getFilter(from?: Date, to?: Date, select: string|null = null, find_select:object= {}): IFilter {
  const filter: IFilter = {
    filter: {
      date: { $gte: from || new Date().getStartOfYear().getMidDayDate(), $lte: to || new Date().getEndOfYear().getMidDayDate() }
    },
    select: select || null,
    find_select: find_select || {}
  };
  return filter;
}