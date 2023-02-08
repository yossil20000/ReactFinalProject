import { Save } from '@mui/icons-material'
import { Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import PaymentIcon from '@mui/icons-material/Payment';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import { keys } from '@mui/system';
export enum EAction {
"ADD","DELETE","SAVE","EDIT","PAY","ORDER","CLOSE"
}
export interface IActionButtonsProps {
show: EAction[],
OnAction: (action: EAction ,event?: React.MouseEvent<HTMLButtonElement, MouseEvent> ,item?:string   ) =>void ,
item:string,
display?: [{key: EAction,value:string}]
}

function ActionButtons({OnAction,show,item = "",display}: IActionButtonsProps) {

  const getName = (key: EAction): string =>  {
    if(display !== undefined){

    }
    return key.toString();
  }
  return (
    <>
      { show.includes(EAction.ADD) == true && <Button key={"Add"}  variant='outlined' onClick={(event) => OnAction(EAction.ADD,undefined,item)} color='success' startIcon={<AddCircleOutlineIcon />}>Add</Button>}
      {show.includes(EAction.EDIT) == true && <Button key={"Edit"} variant='outlined' onClick={(event) => OnAction(EAction.EDIT,undefined,item)} startIcon={<EditIcon />}>Edit</Button>}
      { show.includes(EAction.DELETE) == true && <Button key={"Delete"} variant='outlined' onClick={(event) => OnAction(EAction.DELETE,undefined,item)} color='secondary' startIcon={<DeleteIcon />}>Delete</Button>}
      {show.includes(EAction.ORDER) == true && <Button key={"Order"} variant='outlined' onClick={(event) => OnAction(EAction.ORDER,undefined,item)} startIcon={<AddShoppingCartIcon />}>Order</Button>}
      {show.includes(EAction.PAY) == true && <Button key={"Pay"} variant='outlined' onClick={(event) => OnAction(EAction.PAY,undefined,item)} startIcon={<PaymentIcon />}>Pay</Button>}
      {show.includes(EAction.CLOSE) == true && <Button key={"Close"} variant='outlined' onClick={(event) => OnAction(EAction.CLOSE,undefined,item)} startIcon={<CloseIcon />}>Close</Button>}
      {show.includes(EAction.SAVE) == true && <Button key={"Save"} variant='outlined' onClick={(event) => OnAction(EAction.SAVE,undefined,item)} startIcon={<Save />}>Save</Button>}
    </>
  )
}

export default ActionButtons