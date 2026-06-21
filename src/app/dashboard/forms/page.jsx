"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardActions, IconButton, SvgIcon, Divider, Chip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, Checkbox, FormControlLabel, Tooltip, Drawer, LinearProgress } from '@mui/material';
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
const EditIcon = (props) => <SvgIcon {...props}><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></SvgIcon>;
const HistoryIcon = (props) => <SvgIcon {...props}><path d="M13 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7v4l5-5-5-5v4zm1 8H12V7h-2v6l4.24 2.53.9-1.52-3.14-1.87z" /></SvgIcon>;
const CloseIcon = (props) => <SvgIcon {...props}><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></SvgIcon>;
const EyeIcon = (props) => <SvgIcon {...props}><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></SvgIcon>;

export default function FormsPage() {
    const router = useRouter();
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    // ── Version History State ──────────────────────────────────────────────
    const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
    const [historyForm, setHistoryForm] = useState(null); // the form whose history we're showing
    const [versions, setVersions] = useState([]);
    const [versionsLoading, setVersionsLoading] = useState(false);
    const [activeVersion, setActiveVersion] = useState(null);
    const [latestVersion, setLatestVersion] = useState(null);

    // Version Preview State
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null); // { form, version }
    const [previewLoading, setPreviewLoading] = useState(false);

    const openHistory = async (form) => {
        setHistoryForm(form);
        setVersions([]);
        setVersionsLoading(true);
        setHistoryDrawerOpen(true);
        try {
            const data = await FormService.getFormVersions(form._id);
            setVersions(data.versions || []);
            setActiveVersion(data.activeVersion);
            setLatestVersion(data.latestVersion);
        } catch (e) {
            // silently fail, show empty
        } finally {
            setVersionsLoading(false);
        }
    };

    const openVersionPreview = async (version) => {
        setPreviewLoading(true);
        setPreviewOpen(true);
        try {
            const data = await FormService.getFormVersionByNum(historyForm._id, version.version);
            setPreviewData(data);
        } catch (e) {
            setPreviewData(null);
        } finally {
            setPreviewLoading(false);
        }
    };

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

    // Edit Dialog State
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingForm, setEditingForm] = useState(null);
    const [editData, setEditData] = useState({ title: '', description: '' });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');

    const openEditDialog = (form) => {
        setEditingForm(form);
        setEditData({ title: form.title || '', description: form.description || '' });
        setEditError('');
        setEditDialogOpen(true);
    };

    const handleEditChange = (e) => {
        setEditData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveEdit = async () => {
        if (!editData.title.trim()) { setEditError('Title is required'); return; }
        setEditError('');
        setEditLoading(true);
        try {
            await FormService.updateFormMeta(editingForm._id, { title: editData.title, description: editData.description });
            setEditDialogOpen(false);
            // Update the form in local state immediately (no re-fetch needed)
            setForms(prev => prev.map(f => f._id === editingForm._id ? { ...f, title: editData.title, description: editData.description, updatedAt: new Date().toISOString() } : f));
        } catch (err) {
            setEditError(err.message || 'Failed to update form');
        } finally {
            setEditLoading(false);
        }
    };

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
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
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
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip
                                                label={`v${form.latestVersion}`}
                                                size="small"
                                                sx={{
                                                    bgcolor: '#f0f4ff',
                                                    color: '#4f46e5',
                                                    fontWeight: 700,
                                                    fontSize: '0.7rem',
                                                    border: '1px solid #c7d2fe',
                                                    borderRadius: '6px',
                                                    height: 22,
                                                }}
                                            />
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
                                        <Tooltip title="Version History">
                                            <IconButton
                                                size="small"
                                                onClick={() => openHistory(form)}
                                                sx={{ color: '#94a3b8', '&:hover': { color: '#8b5cf6', bgcolor: '#f5f3ff' } }}
                                            >
                                                <HistoryIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Title & Description">
                                            <IconButton
                                                size="small"
                                                onClick={() => openEditDialog(form)}
                                                sx={{ color: '#94a3b8', '&:hover': { color: '#6366f1', bgcolor: '#eef2ff' } }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
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
            {/* Edit Form Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
            >
                <DialogTitle sx={{ fontWeight: 800, pb: 0.5 }}>
                    Edit Form Details
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Update the title and description. Changes are saved immediately.
                    </Typography>
                    {editError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{editError}</Alert>}
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Form Title"
                                name="title"
                                value={editData.title}
                                onChange={handleEditChange}
                                fullWidth
                                required
                                autoFocus
                                slotProps={{ input: { sx: { borderRadius: 2 } } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Description (optional)"
                                name="description"
                                value={editData.description}
                                onChange={handleEditChange}
                                fullWidth
                                multiline
                                rows={3}
                                slotProps={{ input: { sx: { borderRadius: 2 } } }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setEditDialogOpen(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
                    <Button
                        onClick={handleSaveEdit}
                        variant="contained"
                        disabled={editLoading}
                        sx={{ borderRadius: 2, px: 4, fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    >
                        {editLoading ? <CircularProgress size={22} color="inherit" /> : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* ── Version History Drawer ──────────────────────────────────────── */}
            <Drawer
                anchor="right"
                open={historyDrawerOpen}
                onClose={() => setHistoryDrawerOpen(false)}
                slotProps={{ paper: { sx: { width: 420, bgcolor: '#0f172a' } } }}
            >
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Drawer Header */}
                    <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: 1.5, fontSize: '0.7rem' }}>VERSION HISTORY</Typography>
                            <Typography variant="h6" fontWeight="800" sx={{ color: '#f1f5f9', mt: 0.25 }}>{historyForm?.title}</Typography>
                            {latestVersion && (
                                <Typography variant="caption" sx={{ color: '#64748b' }}>
                                    {versions.length} version{versions.length !== 1 ? 's' : ''} · Latest: v{latestVersion}
                                </Typography>
                            )}
                        </Box>
                        <IconButton onClick={() => setHistoryDrawerOpen(false)} sx={{ color: '#475569', '&:hover': { color: '#f1f5f9', bgcolor: 'rgba(255,255,255,0.06)' } }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Versions Timeline */}
                    <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
                        {versionsLoading ? (
                            <Box sx={{ pt: 4 }}><LinearProgress sx={{ borderRadius: 1 }} /></Box>
                        ) : versions.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <HistoryIcon sx={{ fontSize: 48, color: '#334155', mb: 1 }} />
                                <Typography color="#475569">No versions found</Typography>
                            </Box>
                        ) : (
                            <Box sx={{ position: 'relative' }}>
                                {/* Timeline line */}
                                <Box sx={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 1 }} />
                                {versions.map((v, i) => {
                                    const isActive = v.version === activeVersion;
                                    const isLatest = v.version === latestVersion;
                                    const isPublished = v.status === 'published';
                                    return (
                                        <Box key={v._id || i} sx={{ display: 'flex', gap: 2, mb: 3, position: 'relative' }}>
                                            {/* Timeline dot */}
                                            <Box sx={{
                                                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: isActive ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : isPublished ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(255,255,255,0.06)',
                                                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                                boxShadow: isActive ? '0 0 16px rgba(99,102,241,0.5)' : 'none',
                                                zIndex: 1,
                                            }}>
                                                <Typography variant="caption" fontWeight="800" sx={{ color: isActive || isPublished ? '#fff' : '#64748b', fontSize: '0.75rem' }}>
                                                    v{v.version}
                                                </Typography>
                                            </Box>
                                            {/* Version info card */}
                                            <Box sx={{
                                                flex: 1, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid',
                                                borderColor: isActive ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)',
                                                borderRadius: 2.5, p: 2,
                                                transition: 'all 0.2s',
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)' }
                                            }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                                                    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                                                        <Typography fontWeight="700" sx={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Version {v.version}</Typography>
                                                        {isLatest && <Chip label="Latest" size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700, bgcolor: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }} />}
                                                        {isActive && <Chip label="Live" size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700, bgcolor: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }} />}
                                                    </Box>
                                                    <Chip
                                                        label={isPublished ? 'Published' : 'Draft'}
                                                        size="small"
                                                        sx={{
                                                            height: 20, fontSize: '0.65rem', fontWeight: 700,
                                                            bgcolor: isPublished ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.06)',
                                                            color: isPublished ? '#34d399' : '#64748b',
                                                            border: '1px solid', borderColor: isPublished ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'
                                                        }}
                                                    />
                                                </Box>
                                                <Typography variant="caption" sx={{ color: '#475569', display: 'block', mb: 1.5 }}>
                                                    {new Date(v.createdAt).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    {v.createdBy && ` · ${v.createdBy.firstName} ${v.createdBy.lastName}`}
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    startIcon={<EyeIcon sx={{ fontSize: 15 }} />}
                                                    onClick={() => openVersionPreview(v)}
                                                    sx={{
                                                        textTransform: 'none', fontWeight: 600, fontSize: '0.78rem',
                                                        color: '#818cf8', borderColor: 'rgba(99,102,241,0.3)',
                                                        borderRadius: 2, px: 2, py: 0.5,
                                                        border: '1px solid rgba(99,102,241,0.25)',
                                                        '&:hover': { bgcolor: 'rgba(99,102,241,0.12)', borderColor: 'rgba(99,102,241,0.5)' }
                                                    }}
                                                >
                                                    Preview
                                                </Button>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Drawer>

            {/* ── Version Preview Dialog ──────────────────────────────────────── */}
            <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth
                slotProps={{ paper: { sx: { borderRadius: 3, maxHeight: '90vh' } } }}>
                {previewLoading ? (
                    <Box sx={{ p: 6, textAlign: 'center' }}><CircularProgress /></Box>
                ) : previewData ? (() => {
                    const v = previewData.version;
                    const fields = v.sections?.flatMap(s => s.fields) || [];
                    return (
                        <>
                            <DialogTitle component="div" sx={{ pb: 1, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', borderRadius: '12px 12px 0 0' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography fontWeight="800" sx={{ fontSize: '1.1rem' }}>{previewData.form?.title}</Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.8 }}>Version {v.version} · {v.status} · {fields.length} field{fields.length !== 1 ? 's' : ''}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        {v.version === previewData.form?.activeVersion && <Chip label="Live" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, fontSize: '0.65rem' }} />}
                                        <IconButton onClick={() => setPreviewOpen(false)} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}><CloseIcon /></IconButton>
                                    </Box>
                                </Box>
                                {previewData.form?.description && <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>{previewData.form.description}</Typography>}
                            </DialogTitle>
                            <DialogContent sx={{ p: 3, bgcolor: '#f8fafc' }}>
                                {fields.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 6, color: '#94a3b8' }}>
                                        <Typography>This version has no fields.</Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                                        {fields.map((field, fi) => (
                                            <Box key={fi} sx={{ bgcolor: '#fff', borderRadius: 2, border: '1px solid #e2e8f0', p: 2.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <Chip label={field.type} size="small" sx={{ fontSize: '0.65rem', fontWeight: 700, bgcolor: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe' }} />
                                                    {field.required && <Chip label="Required" size="small" sx={{ fontSize: '0.65rem', fontWeight: 700, bgcolor: '#fff0f0', color: '#ef4444', border: '1px solid #fecaca' }} />}
                                                </Box>
                                                <Typography fontWeight="700" color="#1e293b" sx={{ mb: 0.5 }}>{field.label}</Typography>
                                                {field.placeholder && <Typography variant="caption" color="#94a3b8">{field.placeholder}</Typography>}
                                                {field.options?.length > 0 && (
                                                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                                        {field.options.map((o, oi) => (
                                                            <Chip key={oi} label={o.label} size="small" sx={{ fontSize: '0.72rem', bgcolor: '#f1f5f9', color: '#475569' }} />
                                                        ))}
                                                    </Box>
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </DialogContent>
                            <DialogActions sx={{ px: 3, pb: 2, bgcolor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>Read-only preview — editing requires opening the form builder</Typography>
                                <Button onClick={() => setPreviewOpen(false)} sx={{ fontWeight: 600 }}>Close</Button>
                            </DialogActions>
                        </>
                    );
                })() : (
                    <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="error">Failed to load version</Typography></Box>
                )}
            </Dialog>
        </Box>
    );
}