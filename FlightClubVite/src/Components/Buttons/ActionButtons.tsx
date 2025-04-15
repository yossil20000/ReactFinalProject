import '../../Types/date.extensions'
import { Save } from '@mui/icons-material'
import { Button } from '@mui/material'
import TableViewIcon from '@mui/icons-material/TableView';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import PaymentIcon from '@mui/icons-material/Payment';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
export enum EAction {
  "ADD", "DELETE", "SAVE", "EDIT", "PAY", "ORDER", "CLOSE","OTHER"
}
export interface IActionDispaly<T> {
  key: EAction, value: T
}
export type ActionColor = "success" | "inherit" | "primary" | "secondary" | "error" | "info";
export interface IActionButtonsProps {
  show: EAction[],
  OnAction: (action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) => void,
  item: string | any,
  display?: IActionDispaly<string>[],
  color?: IActionDispaly<ActionColor>[],
  disable?: IActionDispaly<boolean>[]
}


function ActionButtons({ OnAction, show, item = "", display ,color,disable}: IActionButtonsProps) {
  CustomLogger.log("ActionButtons/item",item)
  const getName = (findKey: EAction,defaultName: string): string => {
    CustomLogger.info("ActionButtons/getName/key_display",findKey,display)
    if (display !== undefined) {
      let newName = display.find((key) => key.key === findKey)?.value
      CustomLogger.info("ActionButtons/getName/newName",newName)
      newName =  newName === undefined ? defaultName : newName
      return newName
    }
    return defaultName
  }
  const getColor = (findKey: EAction,defaultColor: ActionColor): ActionColor => {
    CustomLogger.info("ActionButtons/getColor/key_color",findKey,color)
    if (color !== undefined) {
      let newName  = color.find((key) => key.key === findKey)?.value
      CustomLogger.info("ActionButtons/getColor/color", newName,defaultColor)
      newName =  newName === undefined ? defaultColor : newName
      CustomLogger.info("ActionButtons/getColor/newName", newName)
      return newName;
    }
    return defaultColor
  }
  const getDisable = (findKey: EAction,defaultDisable: boolean): boolean => {
    CustomLogger.info("ActionButtons/getColor/key_enable",findKey,disable)
    if (disable !== undefined) {
      let newName  = disable.find((key) => key.key === findKey)?.value
      CustomLogger.info("ActionButtons/getDisable/enable", newName,defaultDisable)
      newName =  newName === undefined ? defaultDisable : newName
      CustomLogger.info("ActionButtons/getDisable/newName", newName)
      return newName;
    }
    return defaultDisable;
  }

  return (
    <>
      {show.includes(EAction.ADD) == true && <Button fullWidth disabled= {getDisable(EAction.ADD ,getDisable(EAction.ADD,false))} key={"Add"} variant='outlined' onClick={() => OnAction(EAction.ADD, undefined, item)} color={getColor(EAction.ADD,'success')} startIcon={<AddCircleOutlineIcon />}>{getName(EAction.ADD,"Add")}</Button>}
      {show.includes(EAction.EDIT) == true && <Button fullWidth disabled= {getDisable(EAction.EDIT,false)} key={"Edit"} variant='outlined' onClick={() => OnAction(EAction.EDIT, undefined, item)} color={getColor(EAction.EDIT,'primary')} startIcon={<EditIcon />}>{getName(EAction.EDIT,"Edit")}</Button>}
      {show.includes(EAction.DELETE) == true && <Button fullWidth disabled= {getDisable(EAction.DELETE ,false)} key={"Delete"} variant='outlined' onClick={() => OnAction(EAction.DELETE, undefined, item)} color={getColor(EAction.DELETE,'secondary')} startIcon={<DeleteIcon />}>{getName(EAction.DELETE,"Delete")}</Button>}
      {show.includes(EAction.ORDER) == true && <Button fullWidth disabled= {getDisable(EAction.ORDER,getDisable(EAction.ORDER,false))} key={"Order"} variant='outlined' onClick={() => OnAction(EAction.ORDER, undefined, item)} color={getColor(EAction.ORDER,'primary')} startIcon={<AddShoppingCartIcon />}>{getName(EAction.ORDER,"Order")}</Button>}
      {show.includes(EAction.PAY) == true && <Button fullWidth disabled= {getDisable(EAction.PAY,false)}key={"Pay"} variant='outlined' onClick={() => OnAction(EAction.PAY, undefined, item)} color={getColor(EAction.PAY,'primary')} startIcon={<PaymentIcon />}>{getName(EAction.PAY,"Pay")}</Button>}
      {show.includes(EAction.CLOSE) == true && <Button fullWidth disabled= {getDisable(EAction.CLOSE,false)} key={"Close"} variant='outlined' onClick={() => OnAction(EAction.CLOSE, undefined, item)} color={getColor(EAction.CLOSE,'primary')} startIcon={<CloseIcon />}>{getName(EAction.CLOSE,"Close")}</Button>}
      {show.includes(EAction.SAVE) == true && <Button fullWidth disabled= {getDisable(EAction.SAVE,false)} key={"Save"} variant='outlined' onClick={() => OnAction(EAction.SAVE, undefined, item)} color={getColor(EAction.SAVE,'primary')} startIcon={<Save />}>{getName(EAction.SAVE,"Save")} </Button>}
      {show.includes(EAction.OTHER) == true && <Button fullWidth disabled= {getDisable(EAction.OTHER,false)} key={"Other"} variant='outlined' onClick={() => OnAction(EAction.OTHER, undefined, item)} color={getColor(EAction.OTHER,'primary')} startIcon={<TableViewIcon/>}>{getName(EAction.OTHER,"OTHER")} </Button>}
    </>
  )
}

export default ActionButtons