import { IValidationAlertProps } from "../Components/Buttons/TransitionAlert";
import { IValidation } from "../Interfaces/IValidation";

export function apiValidationParse(validation: IValidation): string {
  return `${validation.param} (${validation.value}) : ${validation.msg} `;
}


export function getValidationFromError(error: any, onclose: () => void): IValidationAlertProps[] {
  let validation: IValidationAlertProps[] = [];
  if ((error as any).data?.errorType === undefined) {
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

  if ((error as any).data?.errorType !== undefined && (error as any).data?.errorType === "VALIDATION" ) {

    validation = (error as any).data.errors.map((item: IValidation) => {
      const alert: IValidationAlertProps = { ...(item as IValidationAlertProps) };
      alert.onClose = onclose;
      alert.open = true;
      return alert;
    })
    
  }
  console.log("isError/validation", validation)
  return validation;
}