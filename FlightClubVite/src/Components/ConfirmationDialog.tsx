import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { Grid, Typography } from '@mui/material';

export interface ConfirmationDialogProps {
  action: string;
  keepMounted: boolean;
  open: boolean;
  onClose: (value: boolean, action: string) => void;
  title: string;
  content: string;
  key?: string;
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
  const { onClose, title = "Yossi", content, open, action, key, ...other } = props;


  const handleCancel = () => {
    onClose(false, action);
  };

  const handleOk = () => {
    onClose(true, action);
  };

  return (

    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', backgroundColor: 'white' }, '& .MuiBackdrop-root': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent dividers>
        <Grid container>
          <Grid item xs={12}>
            <Typography paragraph>
              {content}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Confirm</Button>
      </DialogActions>
    </Dialog>

  );
}

