"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Alert } from '@mui/material';
import { UserService } from '@/src/fe/services/user.service';

export default function EmployeesPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [pageError, setPageError] = useState('');
  const [formError, setFormError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setPageError('');
      const data = await UserService.getUsers();
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      // If the backend returns 403 Forbidden (e.g. user is not an owner), show it in the UI
      setPageError(err.message || 'Failed to load employees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async () => {
    setFormError('');
    try {
      await UserService.createUser(formData);
      setOpenDialog(false);
      setFormData({ firstName: '', lastName: '', email: '', password: '' });
      fetchUsers(); // Refresh the list
    } catch (err) {
      setFormError(err.message || 'Failed to create employee');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">Employees</Typography>
        <Button variant="contained" onClick={() => { setFormError(''); setOpenDialog(true); }}>+ Add Employee</Button>
      </Box>

      {pageError && <Alert severity="error" sx={{ mb: 4 }}>{pageError}</Alert>}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} align="center">Loading...</TableCell></TableRow>
              ) : users.length === 0 ? (
                <TableRow><TableCell colSpan={3} align="center">No employees found.</TableCell></TableRow>
              ) : (
                users.map((u) => (
                  <TableRow hover key={u._id}>
                    <TableCell>{u.firstName} {u.lastName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role || 'employee'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Employee Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent dividers>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
          <Grid container spacing={2}>
            <Grid xs={6}>
              <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid xs={6}>
              <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid xs={12}>
              <TextField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid xs={12}>
              <TextField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} fullWidth required />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
