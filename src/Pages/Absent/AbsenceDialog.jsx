/* eslint-disable react/prop-types */
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { AbsentForm } from "./AbsenceForm";

export const AbsentDialog = ({ open, onClose, shift, onSubmit, handleDelete, staffsData, shiftsData, shiftsIds, navigate, setIsAddLoadingCus,
    isShiftAdding,
    isDatatLoadingCus,
    isAddLoadingCus,
    isShiftsLoading 
   }) => {
    const isEditing = Boolean(shift);
    const title = isEditing ? 'Edit Shift' : 'Record New Absence';
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <AbsentForm
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
            isEditing={isEditing}
            isShiftAdding={ isShiftAdding}
            isDatatLoadingCus={isDatatLoadingCus}
            isAddLoadingCus={isAddLoadingCus}
            isShiftsLoading={isShiftsLoading} 
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