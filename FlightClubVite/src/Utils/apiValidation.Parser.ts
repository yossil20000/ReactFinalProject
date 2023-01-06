import { ErrorSharp } from "@mui/icons-material";
import { json } from "react-router-dom";
import { IValidationAlertProps } from "../Components/Buttons/TransitionAlert";
import { IValidation } from "../Interfaces/IValidation";

export function apiValidationParse(validation: IValidation): string {
  return `${validation.param} (${validation.value}) : ${validation.msg} `;
}


export function getValidationFromError(error: any, onclose: () => void): IValidationAlertProps[] {
  console.log("getValidationFromError", error)
  let validation: IValidationAlertProps[] = [];
  try{
    if ((error as any).data?.errorType !== "VALIDATION") {
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
    if ((error as any).data?.errorType !== undefined && (error as any).data?.errorType === "VALIDATION" ) {
      console.log("getValidationFromError/2", (error as any).data?.errorType)
      validation = (error as any).data?.errors.map((item: IValidation) => {
        const alert: IValidationAlertProps = { ...(item as IValidationAlertProps) };
        alert.onClose = onclose;
        alert.open = true;
        return alert;
      })
      
    }
    if( validation === undefined){
      if(error.error){
        const alert: IValidationAlertProps = {
          location: '',
          msg: error.error,
          param: '',
          value: "",
          open: true,
          onClose: onclose
        };
        validation = [alert]
      }
      else if(Array.isArray(error)){
        validation = (error as any).map((item: any) => {
          let alert: IValidationAlertProps = {
            location: '',
            msg: "",
            param: '',
            value: "",
            open: true,
            onClose: onclose
          };
          if(item instanceof Error){
            alert.msg = item.message;
          }
          else{
            alert.msg = JSON.stringify(item);
          }
          
          return alert;
        })
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
        if(error instanceof Error){
          alert.msg = error.message;
        }
        validation = [alert]
      }
    }
    console.log("isError/validation", validation)
    validation = validation === undefined ? [] : validation;
  }
  catch(err : any){
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
  finally{
    console.log("getValidationFromError/2/validation", validation)
    return validation;
  }

}