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
  "ADD", "DELETE", "SAVE", "EDIT", "PAY", "ORDER", "CLOSE"
}
export interface IActionDispaly {
  key: EAction, value: string
}
export interface IActionButtonsProps {
  show: EAction[],
  OnAction: (action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) => void,
  item: string | any,
  display?: IActionDispaly[]
}

function ActionButtons({ OnAction, show, item = "", display }: IActionButtonsProps) {

  const getName = (findKey: EAction,defaultName: string): string => {
    console.log("ActionButtons/getName/",findKey,display)
    if (display !== undefined) {
      let newName = display.find((key) => key.key === findKey)?.value
      console.log("ActionButtons/getName/newName",newName)
      newName =  newName === undefined ? defaultName : newName
      return newName
    }
    return defaultName
  }
  return (
    <>
      {show.includes(EAction.ADD) == true && <Button key={"Add"} variant='outlined' onClick={(event) => OnAction(EAction.ADD, undefined, item)} color='success' startIcon={<AddCircleOutlineIcon />}>{getName(EAction.ADD,"Add")}</Button>}
      {show.includes(EAction.EDIT) == true && <Button key={"Edit"} variant='outlined' onClick={(event) => OnAction(EAction.EDIT, undefined, item)} startIcon={<EditIcon />}>{getName(EAction.EDIT,"Edit")}</Button>}
      {show.includes(EAction.DELETE) == true && <Button key={"Delete"} variant='outlined' onClick={(event) => OnAction(EAction.DELETE, undefined, item)} color='secondary' startIcon={<DeleteIcon />}>{getName(EAction.DELETE,"Delete")}</Button>}
      {show.includes(EAction.ORDER) == true && <Button key={"Order"} variant='outlined' onClick={(event) => OnAction(EAction.ORDER, undefined, item)} startIcon={<AddShoppingCartIcon />}>{getName(EAction.ORDER,"Order")}</Button>}
      {show.includes(EAction.PAY) == true && <Button key={"Pay"} variant='outlined' onClick={(event) => OnAction(EAction.PAY, undefined, item)} startIcon={<PaymentIcon />}>{getName(EAction.PAY,"Pay")}</Button>}
      {show.includes(EAction.CLOSE) == true && <Button key={"Close"} variant='outlined' onClick={(event) => OnAction(EAction.CLOSE, undefined, item)} startIcon={<CloseIcon />}>{getName(EAction.CLOSE,"Close")}</Button>}
      {show.includes(EAction.SAVE) == true && <Button key={"Save"} variant='outlined' onClick={(event) => OnAction(EAction.SAVE, undefined, item)} startIcon={<Save />}>{getName(EAction.SAVE,"Save")}</Button>}
    </>
  )
}

export default ActionButtons