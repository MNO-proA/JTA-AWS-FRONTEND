/* eslint-disable react/prop-types */
import { Dialog, DialogContent, DialogContentText, DialogActions, Button, DialogTitle } from "@mui/material";
// eslint-disable-next-line no-unused-vars
export const DeleteConfirmationDialog = ({ open, onClose, onConfirm, theme, isDeleteLoading,
    isDatatLoadingCus,
    isShiftsLoading   }) => {

    
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the selected shift(s)?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}  sx={{
            marginTop: '10px',
            color: 'grey',
            '&:hover': {
              backgroundColor: theme.palette.secondary[200],
              color: theme.palette.primary[900],
            },
          }}>
            Cancel
          </Button>
          <Button onClick={onConfirm}  sx={{
            marginTop: '10px',
            color: 'grey',
            '&:hover': {
              backgroundColor: theme.palette.secondary[200],
              color: theme.palette.primary[900],
            },
          }} autoFocus>
            {isDatatLoadingCus || isShiftsLoading? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            "Delete"
                          )}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  

