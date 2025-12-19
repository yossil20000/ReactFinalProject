/* eslint-disable no-useless-escape */
/* eslint-disable no-var */
export {}
declare module "C:\Users\Yossil\Documents\Repos\ReactFinalProject\FlightClubVite\src\Pages\Report\AccountReport.jsx"
import { customLogger,CCustomLogger } from "./src/customLogging";
declare var customLogger = new CCustomLogger({level: 'log'})
declare global {
  var CustomLogger: CCustomLogger;
}
globalThis.CustomLogger = new CCustomLogger({level: 'log'})
// globalThis.CustomLogger = new CCustomLogger({level: 'info'})
// globalThis.CustomLogger = new CCustomLogger({level: 'error'})
// globalThis.CustomLogger = new CCustomLogger({level: 'debug'})  
declare module "luxon";