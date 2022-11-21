import { Save } from '@mui/icons-material'
import { Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
export enum EAction {
"ADD","DELETE","SAVE"
}
export interface IActionButtonsProps {
show: EAction[],
OnAction: (action: EAction ,event?: React.MouseEvent<HTMLButtonElement, MouseEvent>    ) =>void ;  
}

function ActionButtons({OnAction,show}: IActionButtonsProps) {


  return (
    <>
      { show.includes(EAction.ADD)== true && <Button key={"Add"} variant='outlined' onClick={(event) => OnAction(EAction.ADD)} color='success' startIcon={<AddCircleOutlineIcon />}>Add</Button>}
      { show.includes(EAction.DELETE)== true && <Button key={"Delete"} variant='outlined' onClick={(event) => OnAction(EAction.DELETE)} color='secondary' startIcon={<DeleteIcon />}>Delete</Button>}
      {show.includes(EAction.SAVE)== true && <Button key={"Save"} variant='outlined' onClick={(event) => OnAction(EAction.SAVE)} startIcon={<Save />}>Save</Button>}
    </>
  )
}

export default ActionButtons