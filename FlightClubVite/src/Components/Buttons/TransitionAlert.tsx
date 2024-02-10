import { Alert, AlertColor, AlertTitle, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IValidation } from "../../Interfaces/IValidation";

export interface IAlertAction {
  open: boolean;
  onClose: () => void;
}
export interface ITransitionAlrertProps extends IAlertAction {
  severity: AlertColor;
  alertTitle: string;
  alertMessage: string;
}

export const NewValidationAlertProps: IValidationAlertProps = {
  location: "test location",
  msg: "test msg",
  param: "test param",
  value: "100",
  open: true,
  onClose: function (): void {
    throw new Error("Function not implemented.");
  }
}
export interface IValidationAlertProps extends IValidation, IAlertAction {

}

export function getValidationAlertMessages(alerts: IValidationAlertProps[]): string[] {
  return alerts.map((alert) => {
    let alertTitle = "", alertMessage = ""
    if (alert.param != "" || alert.value != "") {
      alertTitle = `${alert.param} not valid`;
      alertMessage = `${alert.param} (${alert.value}) : ${alert.msg}`;
    }
    else {
      alertTitle = "Operation Failed";
      alertMessage = alert.msg;
    }
    return `${alertTitle}: ${alertMessage}`
  }

  )
}


export default function TransitionAlert(props: ITransitionAlrertProps) {
  const { severity, alertTitle, alertMessage, open, onClose } = props;
  CustomLogger.log("ValidationAlert/alertMessage,open", severity, alertTitle, alertMessage, open, onClose)
  return (
    <Collapse in={open}>
      <Alert severity={severity} action={
        <IconButton aria-label="close" color="inherit" size="small" onClick={onClose}>
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }>
        <AlertTitle>{alertTitle}</AlertTitle>
        {alertMessage}
      </Alert>
    </Collapse>
  )
}

export function ValidationAlert(props: IValidationAlertProps) {
  const { open, onClose, msg, param, value } = props;
  let alertTitle = "";
  let alertMessage = "";
  CustomLogger.warn("ValidationAlert/msg", msg)
  if (param != "" || value != "") {
    alertTitle = `${param} not valid`;
    alertMessage = `${param} (${value}) : ${msg}`;
  }
  else {
    alertTitle = "Operation Failed";
    alertMessage = msg;
  }

  return (
    <TransitionAlert severity="error" alertMessage={alertMessage} alertTitle={alertTitle} open={open} onClose={onClose} />
  )
}