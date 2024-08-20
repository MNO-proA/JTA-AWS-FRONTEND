/* eslint-disable react/prop-types */
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { ExpenseForm } from "./ExpenseForm";
import DeleteIcon from '@mui/icons-material/Delete';

export const ExpenseDialog = ({ open, onClose, expense, onSubmit, handleDelete, label, expensesData, setIsAddLoadingCus, isAddLoadingCus }) => {
    const isEditing = Boolean(expense);
    const title = isEditing ? 'Edit Expense' : 'Record New Expense';

    
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <ExpenseForm
            initialValues={expense}
            onSubmit={(values) => {
              onSubmit(values);
            }}
            onCancel={onClose}
            label={label}
            expensesData={expensesData}
            setIsAddLoadingCus={setIsAddLoadingCus}
            isEditing={isEditing}
            isAddLoadingCus={isAddLoadingCus}
          />
          
          {isEditing && (
            <DeleteIcon color='error'
              sx={{
                mt: '-70px',
                cursor: 'pointer'
              }}
              onClick={() => handleDelete(expense)}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  };