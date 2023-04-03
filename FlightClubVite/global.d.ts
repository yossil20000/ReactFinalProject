export {}
declare module "C:\Users\Yossil\Documents\Repos\ReactFinalProject\FlightClubVite\src\Pages\Report\AccountReport.jsx"
import { customLogger,CCustomLogger } from "./src/customLogging";
declare var customLogger = new CCustomLogger({level: 'error'})
declare global {
  var CustomLogger: CCustomLogger;
}
globalThis.CustomLogger = new CCustomLogger({level: 'warn'})
