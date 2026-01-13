import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { Home as HomeIcon, People as PeopleIcon } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import StudentList from "../components/students/StudentList";
import StudentForm from "../components/students/StudentForm";
import StudentDetail from "../components/students/StudentDetail";
import Layout from "../components/layout/Layout";

function StudentsPage() {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleCreate = () => {
    setSelectedStudentId(null);
    setIsEditMode(false);
    setFormDialogOpen(true);
  };

  const handleEdit = (studentId) => {
    setSelectedStudentId(studentId);
    setIsEditMode(true);
    setFormDialogOpen(true);
  };

  const handleView = (studentId) => {
    setSelectedStudentId(studentId);
    setDetailDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setFormDialogOpen(false);
    setSelectedStudentId(null);
  };

  const handleFormCancel = () => {
    setFormDialogOpen(false);
    setSelectedStudentId(null);
  };

  const handleDetailClose = () => {
    setDetailDialogOpen(false);
    setSelectedStudentId(null);
  };

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            component={RouterLink}
            to="/"
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <PeopleIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Students
          </Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ mt: 2 }}>
          Student Management
        </Typography>
      </Box>

      <StudentList
        onEdit={handleEdit}
        onView={handleView}
        onCreate={handleCreate}
      />

      {/* Create/Edit Student Dialog */}
      <Dialog
        open={formDialogOpen}
        onClose={handleFormCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? "Edit Student" : "Add New Student"}
        </DialogTitle>
        <DialogContent>
          <StudentForm
            studentId={selectedStudentId}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Student Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleDetailClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Student Details</DialogTitle>
        <DialogContent>
          <StudentDetail
            studentId={selectedStudentId}
            onClose={handleDetailClose}
            onEdit={() => {
              setDetailDialogOpen(false);
              handleEdit(selectedStudentId);
            }}
          />
        </DialogContent>
      </Dialog>
</>
  );
}

export default StudentsPage;
