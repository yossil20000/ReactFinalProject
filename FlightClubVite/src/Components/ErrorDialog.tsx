import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import React from 'react'
import ActionButtons, { EAction } from './Buttons/ActionButtons';
import { IValidationAlertProps, ValidationAlert } from './Buttons/TransitionAlert'
import Item from './Item'
export interface ErrordialogProps {
  validationAlert: IValidationAlertProps[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  source?: string

}
function ErrorDialog({ validationAlert, open, setOpen, source = "", ...other }: ErrordialogProps) {
  const OnAction = (action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string): void => {
    if (action === EAction.CLOSE)
      setOpen(false)
  }
  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="md"

      open={open} {...other}>
      <DialogTitle>
        Errors {source === "" ? "" : `from ${source}`}
      </DialogTitle>
      <DialogContent>
        <Grid container sx={{ width: "100%" }} justifyContent="center" columns={12}>

          {validationAlert?.map((item) => (
            <Grid item xs={12}>
              <Item>

                <ValidationAlert {...item} />
              </Item>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <ActionButtons OnAction={OnAction} show={[EAction.CLOSE]} item={""} />
      </DialogActions>
    </Dialog>
  )
}

export default ErrorDialog