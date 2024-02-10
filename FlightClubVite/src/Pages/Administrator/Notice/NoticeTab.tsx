import "../../../Types/date.extensions"
import { Box } from '@mui/material'
import NoticesTable from "../../../Components/Tables/NoticesTable";
import { IValidationAlertProps, NewValidationAlertProps, ValidationAlert, getValidationAlertMessages } from "../../../Components/Buttons/TransitionAlert";
import { useState } from "react";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { getValidationFromError } from "../../../Utils/apiValidation.Parser";
import ConfirmationDialog, { ConfirmationDialogProps } from "../../../Components/ConfirmationDialog";

function NoticeTab() {
  const [validationAlert, setValidationAlert] = useLocalStorage<IValidationAlertProps[]>("_NoticeTab/alert",[NewValidationAlertProps]);
  const [confirmation, setConfirmation] = useState<ConfirmationDialogProps>({ open: false, isOperate: false } as ConfirmationDialogProps);
  /* CustomLogger.info("NoticeTab/validationAlert", validationAlert); */
 
  function OnError(errors: any) {
    const message = getValidationAlertMessages(getValidationFromError(errors, ()=>{}))
    setConfirmation((prev) => ({
      ...prev,
      open: true, action: "", content: message.join("/n"), title: "Notice Error",
      onClose: onConfirmationClose
    }))
  }
  const onConfirmationClose = (value: boolean, action: string) => {
    CustomLogger.info("Reservation/onConfirmationClose", confirmation, value)

      setConfirmation((prev) => ({ ...prev, open: false,isOperate: false }))

  }

  return (
    <div className='yl__container' style={{ height: "100%", position: "relative" }}>
      <div className='header'>
      <Box>
      {confirmation.open === true ? (<ConfirmationDialog title={confirmation.title} content={confirmation.content}
                                      open={confirmation.open} action={confirmation.action} keepMounted={confirmation.keepMounted}
                                      onClose={onConfirmationClose} isOperate={false} />
                                    ) : null}
        {/* <div>{validationAlert.length}</div> */}
{/*       {validationAlert.map((item) => (
            <ValidationAlert {...item} />
          ))} */}
      </Box>
      </div>
      <div className='main' style={{ overflow: "auto", height: "100%" }}>
        <Box marginTop={2} height={'100%'}>
          <NoticesTable validationAlert={validationAlert} setValidationAlert={setValidationAlert} onError={OnError}/>
        </Box>        
      </div>
      <div className='footer'>

      </div>
    </div>
  )
}

export default NoticeTab