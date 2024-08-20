/* eslint-disable react/prop-types */

import { Dialog, DialogContent, DialogContentText, DialogActions, Button, DialogTitle } from "@mui/material";


export const DeleteConfirmationDialog = ({ open, onClose, onConfirm, theme, isDataLoadingCus, isExpensesLoading }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the selected expense(s)?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{
            marginTop: '10px',
            color: 'grey',
            '&:hover': {
              backgroundColor: theme.palette.secondary[200],
              color: theme.palette.primary[900],
            },
          }}>
            Cancel
          </Button>
          <Button onClick={onConfirm} sx={{
            marginTop: '10px',
            color: 'grey',
            '&:hover': {
              backgroundColor: theme.palette.secondary[200],
              color: theme.palette.primary[900],
            },
          }} autoFocus>
            {isDataLoadingCus || isExpensesLoading  ? (
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