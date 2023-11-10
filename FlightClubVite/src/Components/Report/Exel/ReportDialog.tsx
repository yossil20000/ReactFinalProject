import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import ExportExelTable, { IExportExelTable } from "./ExportExelTable";
import { useState } from "react";

export interface IReportDialogProps {
  action: string;
  open: boolean;
  onClose: (value: boolean, action: string) => void;
  table: IExportExelTable
}


function ReportDialog(props: IReportDialogProps) {
  const { action, open, onClose, table, ...other } = props
  const [save,setSave] = useState(false);
  const handleCancel = () => {
    setSave(false)
    onClose(false, action)
  }
  const handleOk = () => {
    setSave(true)
  }
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '100%', backgroundColor: 'white' }, '& .MuiBackdrop-root': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
      maxWidth="lg"
      open={open}
      {...other}
    >
      <DialogTitle>{table.title}</DialogTitle>
      <DialogContent dividers>
        <ExportExelTable file={table.file} sheet={table.sheet} title={table.title} header={table.header} body={table.body} save={save}/>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ReportDialog