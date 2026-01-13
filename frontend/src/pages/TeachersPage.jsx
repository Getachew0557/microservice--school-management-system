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
import TeacherList from "../components/teachers/TeacherList";
import TeacherForm from "../components/teachers/TeacherForm";
import TeacherDetail from "../components/teachers/TeacherDetail";
import Layout from "../components/layout/Layout";

function TeachersPage() {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleCreate = () => {
    setSelectedTeacherId(null);
    setIsEditMode(false);
    setFormDialogOpen(true);
  };

  const handleEdit = (teacherId) => {
    setSelectedTeacherId(teacherId);
    setIsEditMode(true);
    setFormDialogOpen(true);
  };

  const handleView = (teacherId) => {
    setSelectedTeacherId(teacherId);
    setDetailDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setFormDialogOpen(false);
    setSelectedTeacherId(null);
  };

  const handleFormCancel = () => {
    setFormDialogOpen(false);
    setSelectedTeacherId(null);
  };

  const handleDetailClose = () => {
    setDetailDialogOpen(false);
    setSelectedTeacherId(null);
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
            Teachers
          </Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ mt: 2 }}>
          Teacher Management
        </Typography>
      </Box>

      <TeacherList
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
          {isEditMode ? "Edit Teacher" : "Add New Teacher"}
        </DialogTitle>
        <DialogContent>
          <TeacherForm
            teacherId={selectedTeacherId}
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
        <DialogTitle>Teacher Details</DialogTitle>
        <DialogContent>
          <TeacherDetail
            teacherId={selectedTeacherId}
            onClose={handleDetailClose}
            onEdit={() => {
              setDetailDialogOpen(false);
              handleEdit(selectedTeacherId);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TeachersPage;
