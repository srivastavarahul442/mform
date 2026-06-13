"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardActions, IconButton, SvgIcon, Divider, Chip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, Checkbox, FormControlLabel, Tooltip } from '@mui/material';
import { FormService } from '@/src/fe/services/form.service';
import { useRouter } from 'next/navigation';

// SvgIcons
const AddIcon = (props) => <SvgIcon {...props}><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></SvgIcon>;
const DescriptionIcon = (props) => <SvgIcon {...props}><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></SvgIcon>;
const MoreVertIcon = (props) => <SvgIcon {...props}><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></SvgIcon>;
const ViewIcon = (props) => <SvgIcon {...props}><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></SvgIcon>;
const AnalyticsIcon = (props) => <SvgIcon {...props}><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" /></SvgIcon>;
const CopyIcon = (props) => <SvgIcon {...props}><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" /></SvgIcon>;
const CheckIcon = (props) => <SvgIcon {...props}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></SvgIcon>;

export default function FormsPage() {
    const router = useRouter();
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    const handleCopyId = (id) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Dialog State
    const [openDialog, setOpenDialog] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        allowMultipleSubmissions: false
    });

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
                            <Card sx={{ 
                                borderRadius: 4, 
                                border: '1px solid #e2e8f0', 
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', 
                                '&:hover': { 
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                    transform: 'translateY(-4px)',
                                    borderColor: '#cbd5e1'
                                }, 
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                height: '100%',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Subtle decorative top border */}
                                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }} />
                                
                                <CardContent sx={{ p: 3.5, flexGrow: 1, pt: 4 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                        <Box sx={{ 
                                            p: 1.5, 
                                            background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', 
                                            borderRadius: 3, 
                                            color: '#3b82f6',
                                            boxShadow: 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.5)'
                                        }}>
                                            <DescriptionIcon />
                                        </Box>
                                        <Chip
                                            label={form.status === 'published' ? 'Published' : 'Draft'}
                                            size="small"
                                            sx={{
                                                bgcolor: form.status === 'published' ? '#dcfce7' : '#f8fafc',
                                                color: form.status === 'published' ? '#15803d' : '#64748b',
                                                fontWeight: 700,
                                                fontSize: '0.75rem',
                                                letterSpacing: '0.025em',
                                                border: '1px solid',
                                                borderColor: form.status === 'published' ? '#bbf7d0' : '#e2e8f0',
                                                borderRadius: '6px'
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="h6" fontWeight="800" color="#0f172a" sx={{ mb: 1, lineHeight: 1.3 }}>{form.title}</Typography>
                                    <Typography variant="body2" color="#64748b" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <SvgIcon sx={{ fontSize: 16 }}><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></SvgIcon>
                                        Updated {new Date(form.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </Typography>
                                </CardContent>
                                <Divider sx={{ borderColor: '#f1f5f9' }} />
                                <CardActions sx={{ justifyContent: 'space-between', px: 2.5, py: 2, bgcolor: '#f8fafc' }}>
                                    <Button
                                        size="small"
                                        onClick={() => router.push(`/dashboard/forms/${form._id}/builder`)}
                                        sx={{ textTransform: 'none', fontWeight: 600, color: '#475569', '&:hover': { bgcolor: '#e2e8f0', color: '#0f172a' }, borderRadius: 2 }}
                                    >
                                        Builder
                                    </Button>
                                    <Button
                                        size="small"
                                        startIcon={<AnalyticsIcon sx={{ fontSize: 18 }} />}
                                        onClick={() => router.push(`/dashboard/forms/${form._id}/submissions`)}
                                        sx={{ textTransform: 'none', fontWeight: 600, color: '#0284c7', '&:hover': { bgcolor: '#e0f2fe', color: '#0369a1' }, borderRadius: 2 }}
                                    >
                                        Responses
                                    </Button>
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        <Tooltip title={copiedId === form._id ? 'Copied!' : 'Copy Form ID'}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleCopyId(form._id)}
                                                sx={{
                                                    color: copiedId === form._id ? '#10b981' : '#94a3b8',
                                                    transition: 'color 0.2s',
                                                    '&:hover': { color: '#3b82f6', bgcolor: '#eff6ff' }
                                                }}
                                            >
                                                {copiedId === form._id ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                                            </IconButton>
                                        </Tooltip>
                                        {form.status === 'published' && (
                                            <Tooltip title="Open Public Link">
                                                <IconButton size="small" onClick={() => window.open(`/f/${form._id}`, '_blank')} sx={{ color: '#10b981', '&:hover': { bgcolor: '#f0fdf4' } }}>
                                                    <ViewIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
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
        </Box>
    );
}