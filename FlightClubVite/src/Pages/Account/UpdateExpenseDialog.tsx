import React from 'react'
import { IExpense } from '../../Interfaces/API/IExpense';

export interface UpdateExpenseDialogProps {
  value: IExpense;
  onClose: () => void;
  onSave: (value: IExpense) => void;
  open: boolean;
}

function UpdateExpenseDialog({ value, onClose, onSave, open, ...other }: UpdateExpenseDialogProps) {
  return (
    <div>UpdateExpenseDialod</div>
  )
}

export default UpdateExpenseDialog