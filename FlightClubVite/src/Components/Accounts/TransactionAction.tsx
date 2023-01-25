import { Check, Save } from '@mui/icons-material';
import { Box, CircularProgress, Fab } from '@mui/material';
import { green } from '@mui/material/colors';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
export interface ITransactionActionProps {
  params: any;
  rowId: string | null;
  setRowId: React.Dispatch<React.SetStateAction<string | null>>
}
export default function TransactionAction(props: ITransactionActionProps) {
  const [isloading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { rowId, setRowId, params } = props;
  const { id, _idMember } = params.row;
/*  console.log("TransactionAction/params",id,_idMember,rowId) */
  const handleTransaction =  () => {
    console.log("TransactionAction/handleTransaction",id,params)
    setIsLoading(true);
    const result: boolean = true;
    setInterval( ()=> {
      if (result) {
        setIsSuccess(true);
        setRowId(null);
  
      }
      setIsLoading(false)
    },2000)
    
    /* setIsLoading(false) */
  }

  useEffect(() => {
    if (rowId === params.id && isSuccess) setIsSuccess(false)
  }, [rowId])

  return (
    <Box  >
      {
        isSuccess == true && isloading == false &&
          (
            <Fab color='primary' sx={{width: 40,height: 40,backgroundColor: green[500], '&:hover': {bgcolor: green[700]},}}>
              <Check />
            </Fab>
          ) 
}
{ isSuccess == false && isloading == false &&
          (
            <Fab color='primary' sx={{width: 40,height: 40}}  disabled={/* params.id !== rowId */ isSuccess|| isloading} onClick={handleTransaction} >
              <Save />
            </Fab>
          )
      }
      { isloading == true && 
        (
          <CircularProgress size={40} sx={{color: green[500],zIndex: 1}}/>
        )
      }
    </Box>
  )

}