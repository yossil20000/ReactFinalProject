import { IValidationAlertProps } from "../Components/Buttons/TransitionAlert";
import { IValidation } from "../Interfaces/IValidation";

/**
 * 
 * @param validation  - The validation object containing details about the validation error.  
 * @returns   A formatted string representing the validation error.
 */
export function apiValidationParse(validation: IValidation): string {
  return `${validation.param} (${validation.value}) : ${validation.msg} `;
}
/**
 * 
 * @param error - The error payload to parse. Can be an object with various shapes, an Error instance, an array, or a string.     
 * @param onclose - A callback function to be invoked when the validation alert is closed.    
 * @returns  - An array of IValidationAlertProps representing the parsed validation errors.
 */
export function getValidationFromError(error: any, onclose: () => void): IValidationAlertProps[] {
  CustomLogger.error("getValidationFromError", error)
  let validation: IValidationAlertProps[] = [];

  try {
    const keys = Object.keys(error)
    CustomLogger.error("getValidationFromError/errorKeys/", keys)
    CustomLogger.error("getValidationFromError/object.hasOwnProperty/", error.hasOwnProperty('data'))
    CustomLogger.error("getValidationFromError/object.hasOwnProperty/", error.data?.hasOwnProperty('errors'))
    CustomLogger.error("getValidationFromError/object.hasOwnProperty/", error.hasOwnProperty('data.success'))
    if ((error as any).data?.errorType !== "VALIDATION" && (error as any).data?.errorType !== undefined) {
      CustomLogger.error("getValidationFromError/1", (error as any).data?.errorType)
      validation = (error as any).data?.errors.map((item: string) => {
        const alert: IValidationAlertProps = {
          location: '',
          msg: item,
          param: '',
          value: "",
          open: true,
          onClose: onclose
        };
        return alert;
      })
    }
    /* 2 */
    if ((error as any).data?.errorType !== undefined && (error as any).data?.errorType === "VALIDATION") {
      CustomLogger.error("getValidationFromError/2", (error as any).data?.errorType)
      validation = (error as any).data?.errors.map((item: IValidation) => {
        const alert: IValidationAlertProps = { ...(item as IValidationAlertProps) };
        alert.onClose = onclose;
        alert.open = true;
        return alert;
      })
      CustomLogger.error("getValidationFromError/2/validation/", validation)
    }
    if (validation === undefined || validation.length == 0) {
      if (error.error) {
        const alert: IValidationAlertProps = {
          location: '',
          msg: error.error,
          param: '',
          value: "",
          open: true,
          onClose: onclose
        };
        validation = [alert]
        CustomLogger.error("getValidationFromError/3/validation/", validation)
      }
      else if (Array.isArray(error)) {
        validation = (error as any).map((item: any) => {
          let alert: IValidationAlertProps = {
            location: '',
            msg: "",
            param: '',
            value: "",
            open: true,
            onClose: onclose
          };
          if (item instanceof Error) {
            alert.msg = item.message;
          }
          else {
            alert.msg = JSON.stringify(item);
          }

          return alert;
        })
        CustomLogger.error("getValidationFromError/4/validation/", validation)
      }
      else {

        let alert: IValidationAlertProps = {
          location: '',
          msg: "UnDefined Error",
          param: '',
          value: "",
          open: true,
          onClose: onclose
        };
        if (error instanceof Error) {
          alert.msg = error.message;
        }
        validation = [alert]
        CustomLogger.error("getValidationFromError/5/validation/", validation)
      }
    }
    CustomLogger.error("getValidationFromError/isError/validation/", validation)
    validation = validation === undefined ? [] : validation;
  }
  catch (err: any) {
    CustomLogger.error("getValidationFromError/err/", err)
    let alert: IValidationAlertProps = {
      location: '',
      msg: err.message,
      param: '',
      value: "",
      open: true,
      onClose: onclose
    };
    validation.push(alert);
  }
  finally {
    CustomLogger.error("getValidationFromError/finanly/validation", validation)
    return validation;
  }
}
/**
 * 
 * @param message - The custom validation message to be displayed.
 * @param value - The value associated with the validation error.
 * @param param - The parameter name associated with the validation error.
 * @param onclose - A callback function to be invoked when the validation alert is closed.
 * @param validation - An optional array of existing validation alerts to which the new alert will be added.
 * @returns  An array of IValidationAlertProps representing the parsed validation errors.
 */
export function getValidationFromUserMessage(message: string,value:string,param: string, onclose: () => void,validation?: IValidationAlertProps[]): IValidationAlertProps[] {
  CustomLogger.error("getValidationFromUserMessage/message", message)
  if(validation === undefined)
    validation = [];

  let alert: IValidationAlertProps = {
    location: 'Custom',
    msg: message,     
    param: param,
    value: value,
    open: true, 
    onClose: onclose
  };
  validation.push(alert);
  return validation;
}