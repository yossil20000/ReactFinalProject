import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { green } from '@mui/material/colors';

export interface ConfirmationDialogProps {
  action: string;
  keepMounted: boolean;
  open: boolean;
  onClose: (value: boolean, action: string) => void;
  title: string;
  content: string;
  key?: string;
  isOperate: boolean
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
  const { onClose, title = "Yossi", content, open, action, key,isOperate, ...other } = props;


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
        
        <Box sx={{ m: 1, position: 'relative' }}>
        <Button autoFocus onClick={handleCancel} disabled={isOperate}>Close</Button>
        <Button onClick={handleOk} disabled={isOperate}>Confirm</Button>
        {isOperate && (
          <CircularProgress
            size={24}
            sx={{
              color: green[500],
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
        
      </DialogActions>
    </Dialog>

  );
}

