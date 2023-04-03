export interface ILogFn {
  (message?: any, ...optionalParams: any[]): void
}
export interface ICustomLogger {
  log: ILogFn;
  info: ILogFn;
  warn: ILogFn;
  error: ILogFn;

}
export type CustomLogLevel = 'log' | 'info' | 'warn' | 'error';
const NO_OP: ILogFn = (message?: any, ...optionalParams: any[]) => { }
export class CCustomLogger implements ICustomLogger {
  readonly log: ILogFn;
  readonly info: ILogFn;
  readonly warn: ILogFn;
  readonly error: ILogFn;
  constructor(options?: { level?: CustomLogLevel }) {
    const { level } = options || {}
    this.error = console.error.bind(console);
    if (level == 'error') {
      this.warn = NO_OP;
      this.info = NO_OP;
      this.log = NO_OP;
      return;
    }
    this.warn = console.warn.bind(console);
    if (level == 'warn') {
      this.info = NO_OP;
      this.log = NO_OP;
      return;
    }
    this.info = console.info.bind(console);
    if (level == 'info') {
      this.log = NO_OP;
      return;
    }
    this.log = console.log.bind(console);


  }
  /*   log(message?: any,...optionalParams: any[]) : void{
      console.log(message,optionalParams);
    }
    warn(message?: any,...optionalParams: any[]) : void{
      console.warn(message,optionalParams);
    }
    error(message?: any,...optionalParams: any[]) : void{
      console.error(message,optionalParams);
    }
    info(message?: any,...optionalParams: any[]) : void{
      console.info(message,optionalParams);
    } */
}

export var customLogger = new CCustomLogger({level: 'log'})
