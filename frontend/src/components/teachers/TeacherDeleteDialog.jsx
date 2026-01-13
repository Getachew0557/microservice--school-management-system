import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

function TeacherDeleteDialog({
  open,
  teacher,
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Delete Teacher</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete teacher{" "}
          <strong>
            {teacher?.first_name} {teacher?.last_name}
          </strong>{" "}
          ({teacher?.teacher_id || teacher?.id})? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TeacherDeleteDialog;
