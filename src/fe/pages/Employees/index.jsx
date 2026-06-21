"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Alert, Avatar, Chip, SvgIcon, IconButton, CircularProgress, Menu, MenuItem } from '@mui/material';
import { UserService } from '@/src/fe/services/user.service';

const AddIcon = (props) => <SvgIcon {...props}><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></SvgIcon>;
const MoreVertIcon = (props) => <SvgIcon {...props}><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></SvgIcon>;

export default function EmployeesPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [pageError, setPageError] = useState('');
  const [formError, setFormError] = useState('');
  
  // Menu and Edit state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({
      firstName: selectedUser.firstName || '',
      lastName: selectedUser.lastName || '',
      email: selectedUser.email || '',
      password: '' // Don't require password on update
    });
    setFormError('');
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditing(false);
    setFormData({ firstName: '', lastName: '', email: '', password: '' });
  };

  const handleSave = async () => {
    setFormError('');
    try {
      if (isEditing) {
        const payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        };
        await UserService.updateUser(selectedUser._id, payload);
      } else {
        await UserService.createUser(formData);
      }
      handleCloseDialog();
      fetchUsers(); 
    } catch (err) {
      setFormError(err.message || `Failed to ${isEditing ? 'update' : 'create'} employee`);
    }
  };

  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ color: '#1e293b', letterSpacing: '-0.5px' }}>Team Directory</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>Manage your workspace members and their roles.</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => { 
            setIsEditing(false); 
            setFormData({ firstName: '', lastName: '', email: '', password: '' }); 
            setFormError(''); 
            setOpenDialog(true); 
          }}
          sx={{ 
            borderRadius: 2, 
            textTransform: 'none', 
            fontWeight: 600,
            px: 3,
            py: 1,
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
          }}
        >
          Add Employee
        </Button>
      </Box>

      {pageError && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{pageError}</Alert>}

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Member</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Role</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Status</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                    <Typography variant="h6" fontWeight="600" color="text.primary" gutterBottom>No members found</Typography>
                    <Typography variant="body2">Get started by adding your first employee.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => {
                  const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim();
                  const initials = `${u.firstName ? u.firstName.charAt(0) : ''}${u.lastName ? u.lastName.charAt(0) : ''}`;
                  return (
                    <TableRow hover key={u._id} sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: stringToColor(fullName || 'User'), fontWeight: 600 }}>{initials}</Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="600" sx={{ color: '#1e293b' }}>{fullName}</Typography>
                            <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Chip 
                          label={u.role === 'owner' ? 'Owner' : 'Employee'} 
                          size="small" 
                          sx={{ 
                            bgcolor: u.role === 'owner' ? '#f3e8ff' : '#e0f2fe',
                            color: u.role === 'owner' ? '#7e22ce' : '#0369a1',
                            fontWeight: 600,
                            borderRadius: 1.5
                          }} 
                        />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Chip 
                          label={u.isActive !== false ? 'Active' : 'Inactive'} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            borderColor: u.isActive !== false ? '#86efac' : '#fca5a5',
                            color: u.isActive !== false ? '#166534' : '#991b1b',
                            fontWeight: 500,
                            borderRadius: 1.5
                          }} 
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, u)}>
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{ paper: { sx: { borderRadius: 2, minWidth: 120, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' } } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEditClick} sx={{ fontWeight: 500, color: '#1e293b' }}>Edit details</MenuItem>
      </Menu>

      {/* Create / Edit Employee Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: 3, p: 1 } }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>{isEditing ? 'Edit Member Details' : 'Invite New Member'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {isEditing 
              ? 'Update the employee details below.'
              : 'Add a new employee to your workspace. They will receive an email to set up their account.'}
          </Typography>
          {formError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{formError}</Alert>}
          <Grid container spacing={2.5}>
            <Grid xs={6}>
              <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} fullWidth required slotProps={{ input: { sx: { borderRadius: 2 } } }} />
            </Grid>
            <Grid xs={6}>
              <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth required slotProps={{ input: { sx: { borderRadius: 2 } } }} />
            </Grid>
            <Grid xs={12}>
              <TextField label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} fullWidth required slotProps={{ input: { sx: { borderRadius: 2 } } }} />
            </Grid>
            {!isEditing && (
              <Grid xs={12}>
                <TextField label="Temporary Password" type="password" name="password" value={formData.password} onChange={handleChange} fullWidth required slotProps={{ input: { sx: { borderRadius: 2 } } }} />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}>
            {isEditing ? 'Save Changes' : 'Send Invite'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
