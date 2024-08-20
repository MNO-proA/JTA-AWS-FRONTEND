/* eslint-disable react/prop-types */
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { ShiftForm } from "./ShiftForm";
import DeleteIcon from '@mui/icons-material/Delete';

export const ShiftDialog = ({ open, onClose, shift, onSubmit, handleDelete, staffsData, shiftsData, shiftsIds, navigate, setIsAddLoadingCus, isShiftAdding,
    isDatatLoadingCus,
    isAddLoadingCus,
    isShiftsLoading }) => {
    const isEditing = Boolean(shift);
    const title = isEditing ? 'Edit Shift' : 'Record New Shift';
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <ShiftForm
            initialValues={shift}
            onSubmit={(values) => {
              onSubmit(values);
              onClose();
            }}
            onCancel={onClose}
            staffsData={staffsData}
            shiftsData={shiftsData}
            shiftsIds={shiftsIds}
            navigate={navigate}
            setIsAddLoadingCus={setIsAddLoadingCus}
            isShiftAdding={isShiftAdding}
            isDatatLoadingCus={isDatatLoadingCus}
            isAddLoadingCus={isAddLoadingCus}
            isShiftsLoading={isShiftsLoading} 
            isEditing={isEditing}
          />
          {isEditing? 
        
          <DeleteIcon color="error" sx={{
            mt: '-70px'
          }}
          onClick={() => handleDelete(shift)}
          /> : 
          ''}
        </DialogContent>
      </Dialog>
    );
  };