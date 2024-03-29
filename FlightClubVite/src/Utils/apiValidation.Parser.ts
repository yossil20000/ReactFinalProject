import { IValidationAlertProps } from "../Components/Buttons/TransitionAlert";
import { IValidation } from "../Interfaces/IValidation";

export function apiValidationParse(validation: IValidation): string {
  return `${validation.param} (${validation.value}) : ${validation.msg} `;
}

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