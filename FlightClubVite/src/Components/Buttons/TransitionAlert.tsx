import { Alert, AlertColor, AlertTitle, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface ITransitionAlrertProps{
  severity: AlertColor;
  alertTitle: string;
  alertMessage: string;
  open: boolean;
  onClose: () => void ;
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