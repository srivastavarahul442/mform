"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardActions, IconButton, SvgIcon, Divider, Chip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, Checkbox, FormControlLabel, Tooltip } from '@mui/material';
import { FormService } from '@/src/fe/services/form.service';
import { useRouter } from 'next/navigation';

// SvgIcons
const AddIcon = (props) => <SvgIcon {...props}><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></SvgIcon>;
const DescriptionIcon = (props) => <SvgIcon {...props}><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></SvgIcon>;
const MoreVertIcon = (props) => <SvgIcon {...props}><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></SvgIcon>;
const ViewIcon = (props) => <SvgIcon {...props}><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></SvgIcon>;
const AnalyticsIcon = (props) => <SvgIcon {...props}><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></SvgIcon>;
const ShareIcon = (props) => <SvgIcon {...props}><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></SvgIcon>;

export default function FormsPage() {
  const router = useRouter();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    allowMultipleSubmissions: false
  });

  // Invite Dialog State
  const [openInvite, setOpenInvite] = useState(false);
  const [inviteFormId, setInviteFormId] = useState(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [inviteData, setInviteData] = useState({ name: '', phone: '', email: '' });

  const fetchForms = async () => {
    try {
      setLoading(true);
      const data = await FormService.getForms();
      setForms(data.forms || []);
    } catch (err) {
      setPageError(err.message || 'Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleCreateForm = async () => {
    setFormError('');
    setFormLoading(true);
    try {
      const data = await FormService.createForm(formData);
      setOpenDialog(false);
      // Auto-redirect to the builder
      router.push(`/dashboard/forms/${data.form._id}/builder`);
    } catch (err) {
      setFormError(err.message || 'Failed to create form');
      setFormLoading(false);
    }
  };

  const handleGenerateInvite = async () => {
    setInviteError('');
    setInviteLoading(true);
    try {
      const res = await FormService.generateInvite(inviteFormId, inviteData);
      setGeneratedLink(`${window.location.origin}/f/${inviteFormId}?token=${res.token}`);
    } catch (err) {
      setInviteError(err.message || 'Failed to generate unique link');
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ color: '#1e293b', letterSpacing: '-0.5px' }}>Forms Dashboard</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>Create, manage, and analyze your forms.</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => {
            setFormError('');
            setFormData({ title: '', description: '', allowMultipleSubmissions: false });
            setOpenDialog(true);
          }}
          sx={{ 
            borderRadius: 2, 
            textTransform: 'none', 
            fontWeight: 600,
            px: 3,
            py: 1.5,
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
          }}
        >
          Create New Form
        </Button>
      </Box>

      {pageError && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{pageError}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : forms.length === 0 ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: 'white', 
            borderRadius: 4, 
            p: 8, 
            border: '1px dashed #cbd5e1',
            minHeight: 400
          }}
        >
          <Box sx={{ 
            width: 80, height: 80, borderRadius: '50%', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3
          }}>
            <DescriptionIcon sx={{ fontSize: 40, color: '#94a3b8' }} />
          </Box>
          <Typography variant="h6" fontWeight="700" color="#1e293b" gutterBottom>
            No forms created yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center', maxWidth: 400 }}>
            You haven't built any forms in this workspace. Create your first form to start collecting responses.
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none', 
              fontWeight: 600,
              px: 3,
              borderColor: '#cbd5e1',
              color: '#475569',
              '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' }
            }}
          >
            Create your first form
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {forms.map((form) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={form._id}>
              <Card sx={{ borderRadius: 3, border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', '&:hover': { boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }, transition: 'all 0.2s', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ p: 1.5, bgcolor: '#eff6ff', borderRadius: 2, color: '#2563eb' }}>
                      <DescriptionIcon />
                    </Box>
                    <Chip 
                      label={form.status === 'published' ? 'Published' : 'Draft'} 
                      size="small" 
                      sx={{ 
                        bgcolor: form.status === 'published' ? '#dcfce7' : '#f1f5f9', 
                        color: form.status === 'published' ? '#166534' : '#64748b', 
                        fontWeight: 600 
                      }} 
                    />
                  </Box>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>{form.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{new Date(form.updatedAt).toLocaleDateString()}</Typography>
                </CardContent>
                <Divider sx={{ borderColor: '#f8fafc' }} />
                <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
                  <Button 
                    size="small" 
                    onClick={() => router.push(`/dashboard/forms/${form._id}/builder`)}
                    sx={{ textTransform: 'none', fontWeight: 600, color: '#475569' }}
                  >
                    Builder
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<AnalyticsIcon sx={{ fontSize: 16 }} />}
                    onClick={() => router.push(`/dashboard/forms/${form._id}/submissions`)}
                    sx={{ textTransform: 'none', fontWeight: 600, color: '#0ea5e9' }}
                  >
                    Analytics
                  </Button>
                  <Box>
                    {form.status === 'published' && (
                      <>
                        <Tooltip title="Generate Unique Link">
                          <IconButton size="small" onClick={() => {
                            setInviteFormId(form._id);
                            setInviteData({ name: '', phone: '', email: '' });
                            setGeneratedLink('');
                            setInviteError('');
                            setOpenInvite(true);
                          }} sx={{ color: '#8b5cf6', mr: 0.5 }}>
                            <ShareIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Open Public Link">
                          <IconButton size="small" onClick={() => window.open(`/f/${form._id}`, '_blank')} sx={{ color: '#10b981', mr: 0.5 }}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Form Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: 3, p: 1 } }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Create New Form</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Give your form a title and description. You can add questions to it in the next step.
          </Typography>
          {formError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{formError}</Alert>}
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12 }}>
              <TextField 
                label="Form Title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                fullWidth 
                required 
                slotProps={{ input: { sx: { borderRadius: 2 } } }} 
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField 
                label="Description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                fullWidth 
                multiline
                rows={3}
                slotProps={{ input: { sx: { borderRadius: 2 } } }} 
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel 
                control={<Checkbox name="allowMultipleSubmissions" checked={formData.allowMultipleSubmissions} onChange={handleChange} />} 
                label={<Typography variant="body2" fontWeight="500">Allow multiple submissions from the same user</Typography>} 
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleCreateForm} variant="contained" disabled={formLoading} sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}>
            {formLoading ? <CircularProgress size={24} color="inherit" /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generate Unique Link Dialog */}
      <Dialog open={openInvite} onClose={() => setOpenInvite(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}>
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Generate Unique Invite Link</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Generate a secure, one-time use form link for a specific user. Their details will be pre-filled and locked on the form.
          </Typography>
          
          {inviteError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{inviteError}</Alert>}
          
          {generatedLink ? (
            <Box sx={{ p: 3, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0', textAlign: 'center' }}>
              <Typography variant="subtitle2" color="#166534" fontWeight="700" sx={{ mb: 1 }}>Unique Link Generated Successfully!</Typography>
              <TextField 
                fullWidth 
                value={generatedLink} 
                slotProps={{ htmlInput: { readOnly: true } }} 
                sx={{ mb: 2, bgcolor: 'white' }} 
              />
              <Button 
                variant="contained" 
                color="success" 
                onClick={() => navigator.clipboard.writeText(generatedLink)}
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
              >
                Copy to Clipboard
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <TextField 
                  label="Full Name (Optional)" 
                  fullWidth 
                  value={inviteData.name} 
                  onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })} 
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField 
                  label="Phone Number (Required)" 
                  fullWidth 
                  required 
                  value={inviteData.phone} 
                  onChange={(e) => setInviteData({ ...inviteData, phone: e.target.value })} 
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField 
                  label="Email (Optional)" 
                  type="email" 
                  fullWidth 
                  value={inviteData.email} 
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })} 
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenInvite(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Close</Button>
          {!generatedLink && (
            <Button onClick={handleGenerateInvite} variant="contained" disabled={inviteLoading || !inviteData.phone} sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}>
              {inviteLoading ? <CircularProgress size={24} color="inherit" /> : 'Generate Link'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}