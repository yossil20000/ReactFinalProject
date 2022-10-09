import { Alert, AlertColor, AlertTitle, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IValidation } from "../../Interfaces/IValidation";

export interface IAlertAction {
  open: boolean;
  onClose: () => void ;
}
export interface ITransitionAlrertProps extends IAlertAction{
  severity: AlertColor;
  alertTitle: string;
  alertMessage: string;
}

export interface IValidationAlertProps extends IValidation, IAlertAction {

}

export default function TransitionAlert(props: ITransitionAlrertProps) {
  const {severity,alertTitle,alertMessage,open,onClose} = props;
 
  return(
    <Collapse in={open}>
      <Alert severity={severity} action={
        <IconButton aria-label="close" color="inherit" size="small" onClick={onClose}>
          <CloseIcon fontSize="inherit"/>
        </IconButton>
      }>
      <AlertTitle>{alertTitle}</AlertTitle>
      {alertMessage}
      </Alert>
    </Collapse>
  )
}

export function ValidationAlert(props : IValidationAlertProps) {
  const {open,onClose,msg,param,value} = props;
  const alertTitle = `${param} not valid`;
  const alertMessage = `${param} (${value}) : ${msg}`;
  return (
    <TransitionAlert severity="error" alertMessage={alertMessage} alertTitle={alertTitle} open={open} onClose={onClose}/>
  )
  }