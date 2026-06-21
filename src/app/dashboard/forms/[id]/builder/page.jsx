"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Typography, Button, Grid, Card, CardContent, TextField,
  IconButton, CircularProgress, Alert, Paper, Divider, Checkbox,
  FormControlLabel, Select, MenuItem, Chip, Rating, Tooltip, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { FormService } from '@/src/fe/services/form.service';
import SvgIcon from '@mui/material/SvgIcon';

// ─── Icons ───────────────────────────────────────────────────────────────────
const SaveIcon = (props) => <SvgIcon {...props}><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" /></SvgIcon>;
const PublishIcon = (props) => <SvgIcon {...props}><path d="M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z" /></SvgIcon>;
const DeleteIcon = (props) => <SvgIcon {...props}><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></SvgIcon>;
const AddIcon = (props) => <SvgIcon {...props}><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></SvgIcon>;
const DragIcon = (props) => <SvgIcon {...props}><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></SvgIcon>;
const TextIcon = (props) => <SvgIcon {...props}><path d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z" /></SvgIcon>;
const TextareaIcon = (props) => <SvgIcon {...props}><path d="M21 6.5l-4-4H5c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9.5zm-10 7l-3-3 1.41-1.41L11 10.67l4.59-4.58L17 7.5l-6 6z" /></SvgIcon>;
const NumberIcon = (props) => <SvgIcon {...props}><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 3h2v3h1V7h2v3h1v2h-1v3h-2v-3h-1v3h-2v-3H9v-2h1V7h2v3h1V7z" /></SvgIcon>;
const EmailIcon = (props) => <SvgIcon {...props}><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></SvgIcon>;
const PhoneIcon = (props) => <SvgIcon {...props}><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></SvgIcon>;
const DateIcon = (props) => <SvgIcon {...props}><path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" /></SvgIcon>;
const DateTimeIcon = (props) => <SvgIcon {...props}><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" /></SvgIcon>;
const RadioIcon = (props) => <SvgIcon {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" /></SvgIcon>;
const CheckboxIcon = (props) => <SvgIcon {...props}><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></SvgIcon>;
const SelectIcon = (props) => <SvgIcon {...props}><path d="M7 10l5 5 5-5z" /></SvgIcon>;
const MultiSelectIcon = (props) => <SvgIcon {...props}><path d="M3 5h2V3c-1.1 0-2 .9-2 2zm0 8h2v-2H3v2zm4 8h2v-2H7v2zM3 9h2V7H3v2zm10-6h-2v2h2V3zm6 0v2h2c0-1.1-.9-2-2-2zM5 21v-2H3c0 1.1.9 2 2 2zm-2-4h2v-2H3v2zM9 3H7v2h2V3zm2 18h2v-2h-2v2zm8-8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2zm0-12h2V7h-2v2zm0 8h2v-2h-2v2zm-4 4h2v-2h-2v2zm0-16h2V3h-2v2z" /></SvgIcon>;
const FileIcon = (props) => <SvgIcon {...props}><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" /></SvgIcon>;
const RatingIcon = (props) => <SvgIcon {...props}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></SvgIcon>;
const SignatureIcon = (props) => <SvgIcon {...props}><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></SvgIcon>;
const EditIcon = (props) => <SvgIcon {...props}><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></SvgIcon>;

// ─── Field type catalog (grouped) ────────────────────────────────────────────
const FIELD_GROUPS = [
  {
    group: 'Text',
    fields: [
      { type: 'text', label: 'Short Text', Icon: TextIcon, color: '#3b82f6' },
      { type: 'textarea', label: 'Long Text', Icon: TextareaIcon, color: '#6366f1' },
      { type: 'email', label: 'Email', Icon: EmailIcon, color: '#ec4899' },
      { type: 'phone', label: 'Phone', Icon: PhoneIcon, color: '#14b8a6' },
    ]
  },
  {
    group: 'Numeric & Date',
    fields: [
      { type: 'number', label: 'Number', Icon: NumberIcon, color: '#f59e0b' },
      { type: 'date', label: 'Date', Icon: DateIcon, color: '#10b981' },
      { type: 'datetime', label: 'Date & Time', Icon: DateTimeIcon, color: '#06b6d4' },
    ]
  },
  {
    group: 'Choice',
    fields: [
      { type: 'radio', label: 'Single Choice', Icon: RadioIcon, color: '#8b5cf6' },
      { type: 'checkbox', label: 'Checkbox', Icon: CheckboxIcon, color: '#f43f5e' },
      { type: 'select', label: 'Dropdown', Icon: SelectIcon, color: '#0ea5e9' },
      { type: 'multiselect', label: 'Multi-Select', Icon: MultiSelectIcon, color: '#7c3aed' },
    ]
  },
  {
    group: 'Advanced',
    fields: [
      { type: 'file', label: 'File Upload', Icon: FileIcon, color: '#64748b' },
      { type: 'rating', label: 'Rating', Icon: RatingIcon, color: '#f59e0b' },
      { type: 'signature', label: 'Signature', Icon: SignatureIcon, color: '#334155' },
    ]
  },
];

const ALL_FIELD_DEFS = FIELD_GROUPS.flatMap(g => g.fields);

function getFieldDef(type) {
  return ALL_FIELD_DEFS.find(f => f.type === type) || { label: type, Icon: TextIcon, color: '#94a3b8' };
}

const HAS_OPTIONS = ['radio', 'checkbox', 'select', 'multiselect'];
const HAS_VALIDATIONS = ['text', 'textarea', 'email', 'phone', 'number'];

// ─── Canvas Field Preview ─────────────────────────────────────────────────────
function FieldPreview({ field }) {
  switch (field.type) {
    case 'text': case 'email': case 'phone':
      return <TextField disabled size="small" fullWidth placeholder={field.placeholder || `Enter ${field.label}...`} />;
    case 'textarea':
      return <TextField disabled size="small" fullWidth multiline rows={3} placeholder={field.placeholder || `Enter ${field.label}...`} />;
    case 'number':
      return <TextField disabled size="small" type="number" fullWidth placeholder={field.placeholder || '0'} />;
    case 'date':
      return <TextField disabled size="small" type="date" fullWidth slotProps={{ inputLabel: { shrink: true } }} />;
    case 'datetime':
      return <TextField disabled size="small" type="datetime-local" fullWidth slotProps={{ inputLabel: { shrink: true } }} />;
    case 'radio':
      return (
        <Box>
          {(field.options?.length ? field.options : [{ label: 'Option 1' }]).map((o, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #94a3b8', mr: 1.5, flexShrink: 0 }} />
              <Typography variant="body2" color="text.secondary">{o.label}</Typography>
            </Box>
          ))}
        </Box>
      );
    case 'checkbox':
      return (
        <Box>
          {(field.options?.length ? field.options : [{ label: 'Option 1' }]).map((o, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ width: 14, height: 14, border: '2px solid #94a3b8', borderRadius: 0.5, mr: 1.5, flexShrink: 0 }} />
              <Typography variant="body2" color="text.secondary">{o.label}</Typography>
            </Box>
          ))}
        </Box>
      );
    case 'select': case 'multiselect':
      return (
        <Select disabled size="small" fullWidth displayEmpty value="">
          <MenuItem value="" disabled>{field.placeholder || 'Select an option...'}</MenuItem>
        </Select>
      );
    case 'file':
      return (
        <Box sx={{ border: '2px dashed #cbd5e1', borderRadius: 2, p: 2, textAlign: 'center', bgcolor: '#f8fafc' }}>
          <FileIcon sx={{ color: '#94a3b8', mb: 0.5 }} />
          <Typography variant="caption" color="text.secondary" display="block">Click to upload or drag a file here</Typography>
        </Box>
      );
    case 'rating':
      return <Rating value={3} readOnly />;
    case 'signature':
      return (
        <Box sx={{ border: '2px dashed #cbd5e1', borderRadius: 2, p: 3, textAlign: 'center', bgcolor: '#f8fafc', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" color="text.secondary">Sign here</Typography>
        </Box>
      );
    default:
      return <TextField disabled size="small" fullWidth placeholder="Input..." />;
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FormBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [formMeta, setFormMeta] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // ── Edit Meta Dialog ─────────────────────────────────────────────────────
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({ title: '', description: '' });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const openEditDialog = () => {
    setEditData({ title: formMeta?.title || '', description: formMeta?.description || '' });
    setEditError('');
    setEditOpen(true);
  };

  const handleSaveMeta = async () => {
    if (!editData.title.trim()) { setEditError('Title is required'); return; }
    setEditError('');
    setEditSaving(true);
    try {
      await FormService.updateFormMeta(id, { title: editData.title, description: editData.description });
      setFormMeta(prev => ({ ...prev, title: editData.title, description: editData.description }));
      setEditOpen(false);
    } catch (err) {
      setEditError(err.message || 'Failed to update');
    } finally {
      setEditSaving(false);
    }
  };

  useEffect(() => { fetchForm(); }, [id]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const data = await FormService.getFormById(id);
      setFormMeta(data.form);
      const loaded = data.version?.sections || [];
      setSections(loaded.length ? loaded : [{ id: `sec_${Date.now()}`, title: 'Section 1', fields: [] }]);
    } catch (err) {
      setError(err.message || 'Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async () => {
    try {
      setSaving(true); setError(''); setSuccessMsg('');
      await FormService.updateForm(id, { sections });
      setSuccessMsg('Draft saved!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const publishForm = async () => {
    try {
      setPublishing(true); setError(''); setSuccessMsg('');
      await FormService.updateForm(id, { sections });
      await FormService.publishForm(id);
      setSuccessMsg('Form published! Redirecting...');
      setTimeout(() => router.push('/dashboard/forms'), 2000);
    } catch (err) { setError(err.message); }
    finally { setPublishing(false); }
  };

  // ── Field Helpers ────────────────────────────────────────────────────────
  const makeField = (type) => ({
    id: `fld_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    type,
    label: getFieldDef(type).label,
    placeholder: '',
    required: false,
    order: 0,
    options: HAS_OPTIONS.includes(type) ? [{ label: 'Option 1', value: 'option_1' }] : [],
    validations: {}
  });

  const addField = (sIdx, type) => {
    const f = makeField(type);
    setSections(prev => {
      const s = [...prev];
      s[sIdx] = { ...s[sIdx], fields: [...s[sIdx].fields, f] };
      return s;
    });
    setSelectedId(f.id);
  };

  const removeField = (fid) => {
    setSections(prev => prev.map(s => ({ ...s, fields: s.fields.filter(f => f.id !== fid) })));
    if (selectedId === fid) setSelectedId(null);
  };

  const updateField = (fid, updates) => {
    setSections(prev => prev.map(s => ({
      ...s,
      fields: s.fields.map(f => f.id === fid ? { ...f, ...updates } : f)
    })));
  };

  // ── Drag & Drop ──────────────────────────────────────────────────────────
  const onDragStart = (e, type) => {
    e.dataTransfer.setData('fieldType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const onDrop = (e, sIdx) => {
    e.preventDefault(); setIsDragOver(false);
    const type = e.dataTransfer.getData('fieldType');
    if (type) addField(sIdx, type);
  };

  // ── Selected Field ───────────────────────────────────────────────────────
  let selField = null;
  for (const s of sections) {
    const f = s.fields.find(x => x.id === selectedId);
    if (f) { selField = f; break; }
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', overflow: 'hidden' }}>

      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <Paper sx={{ px: 3, py: 1.5, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 3, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Box>
            <Typography variant="h6" fontWeight="800" color="#1e293b">{formMeta?.title}</Typography>
            <Typography variant="caption" color="text.secondary">Drag fields into the canvas · click a field to edit properties</Typography>
          </Box>
          <Tooltip title="Edit title & description">
            <IconButton size="small" onClick={openEditDialog} sx={{ mt: 0.25, color: '#94a3b8', '&:hover': { color: '#6366f1', bgcolor: '#eef2ff' } }}>
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {error && <Alert severity="error" sx={{ py: 0, fontSize: '0.8rem' }}>{error}</Alert>}
          {successMsg && <Alert severity="success" sx={{ py: 0, fontSize: '0.8rem' }}>{successMsg}</Alert>}
          <Button variant="outlined" size="small"
            startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
            onClick={saveDraft} disabled={saving || publishing}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
            Save Draft
          </Button>
          <Button variant="contained" size="small"
            startIcon={publishing ? <CircularProgress size={16} /> : <PublishIcon />}
            onClick={publishForm} disabled={saving || publishing}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg,#10b981,#059669)' }}>
            Publish
          </Button>
        </Box>
      </Paper>

      {/* ── 3 Columns ─────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, overflow: 'hidden' }}>

        {/* LEFT: Element Library */}
        <Paper sx={{ width: 240, flexShrink: 0, p: 2, borderRadius: 3, overflowY: 'auto' }}>
          <Typography variant="subtitle2" fontWeight="700" color="#64748b"
            sx={{ mb: 1, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>
            Form Elements
          </Typography>

          {FIELD_GROUPS.map(({ group, fields }) => (
            <Box key={group} sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight="600" color="#94a3b8" sx={{ mb: 0.5, display: 'block' }}>
                {group}
              </Typography>
              {fields.map(({ type, label, Icon, color }) => (
                <Box
                  key={type}
                  draggable
                  onDragStart={(e) => onDragStart(e, type)}
                  onClick={() => addField(0, type)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    px: 1.5, py: 1, mb: 0.5, borderRadius: 2,
                    border: '1px solid #e2e8f0', bgcolor: '#f8fafc',
                    cursor: 'grab', transition: 'all 0.15s',
                    '&:hover': { bgcolor: '#eff6ff', borderColor: color, color: color },
                    '&:active': { cursor: 'grabbing', transform: 'scale(0.98)' }
                  }}
                >
                  <Icon sx={{ fontSize: 18, color }} />
                  <Typography variant="body2" fontWeight="500">{label}</Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Paper>

        {/* MIDDLE: Canvas */}
        <Paper
          onDrop={(e) => onDrop(e, 0)}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          sx={{
            flexGrow: 1, p: 4, borderRadius: 3, overflowY: 'auto', bgcolor: '#f1f5f9',
            border: isDragOver ? '2px dashed #3b82f6' : '2px dashed transparent',
            transition: 'border-color 0.2s'
          }}
        >
          {/* Form Header */}
          <Box sx={{ maxWidth: 700, mx: 'auto', mb: 4, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="800" color="#1e293b">{formMeta?.title}</Typography>
            {formMeta?.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{formMeta.description}</Typography>
            )}
          </Box>

          {/* Fields */}
          <Box sx={{ maxWidth: 700, mx: 'auto' }}>
            {sections[0]?.fields.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 12, bgcolor: 'white', borderRadius: 3, border: '2px dashed #cbd5e1' }}>
                <DragIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
                <Typography color="text.secondary" fontWeight="500">Drag a field from the left panel</Typography>
                <Typography variant="caption" color="text.disabled">or click any element to add it instantly</Typography>
              </Box>
            ) : (
              sections[0].fields.map((field) => {
                const def = getFieldDef(field.type);
                const isSelected = selectedId === field.id;
                return (
                  <Card
                    key={field.id}
                    onClick={() => setSelectedId(field.id)}
                    sx={{
                      mb: 2, borderRadius: 3, cursor: 'pointer', transition: 'all 0.15s',
                      boxShadow: isSelected
                        ? `0 0 0 2px ${def.color}, 0 4px 16px rgba(0,0,0,0.08)`
                        : '0 2px 8px rgba(0,0,0,0.04)',
                      '&:hover': { boxShadow: isSelected ? undefined : '0 4px 16px rgba(0,0,0,0.08)' }
                    }}
                  >
                    <CardContent sx={{ p: 3, position: 'relative', '&:last-child': { pb: 3 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            icon={<def.Icon sx={{ fontSize: '14px !important' }} />}
                            label={def.label}
                            size="small"
                            sx={{ bgcolor: `${def.color}18`, color: def.color, fontWeight: 600, border: `1px solid ${def.color}30` }}
                          />
                          {field.required && (
                            <Chip label="Required" size="small" color="error" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                          )}
                        </Box>
                        <Tooltip title="Remove field">
                          <IconButton size="small" color="error"
                            onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
                            sx={{ opacity: isSelected ? 1 : 0, transition: 'opacity 0.2s', '&:hover': { opacity: 1 } }}>
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1 }}>
                        {field.label}
                        {field.required && <Typography component="span" color="error"> *</Typography>}
                      </Typography>

                      <Box sx={{ pointerEvents: 'none' }}>
                        <FieldPreview field={field} />
                      </Box>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </Box>
        </Paper>

        {/* RIGHT: Properties Panel */}
        <Paper sx={{ width: 280, flexShrink: 0, p: 2.5, borderRadius: 3, overflowY: 'auto' }}>
          <Typography variant="subtitle2" fontWeight="700" color="#64748b"
            sx={{ mb: 2, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>
            Field Properties
          </Typography>

          {!selField ? (
            <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
              <SelectIcon sx={{ fontSize: 40, color: '#cbd5e1', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">Select a field on the canvas to edit its properties</Typography>
            </Box>
          ) : (
            <Box>
              {/* Type badge */}
              {(() => {
                const def = getFieldDef(selField.type);
                return (
                  <Chip
                    icon={<def.Icon sx={{ fontSize: '14px !important' }} />}
                    label={def.label}
                    size="small"
                    sx={{ mb: 2, bgcolor: `${def.color}18`, color: def.color, fontWeight: 600, border: `1px solid ${def.color}30` }}
                  />
                );
              })()}

              {/* Label */}
              <TextField label="Label" size="small" fullWidth value={selField.label}
                onChange={e => updateField(selField.id, { label: e.target.value })} sx={{ mb: 2 }} />

              {/* Placeholder (not for choice/date types) */}
              {!HAS_OPTIONS.includes(selField.type) && !['date', 'datetime', 'rating', 'signature', 'file'].includes(selField.type) && (
                <TextField label="Placeholder" size="small" fullWidth value={selField.placeholder || ''}
                  onChange={e => updateField(selField.id, { placeholder: e.target.value })} sx={{ mb: 2 }} />
              )}

              {/* Required */}
              <FormControlLabel
                control={<Checkbox size="small" checked={selField.required}
                  onChange={e => updateField(selField.id, { required: e.target.checked })} />}
                label={<Typography variant="body2" fontWeight="600">Required</Typography>}
                sx={{ mb: 2, display: 'block' }}
              />

              {/* ── Options ── */}
              {HAS_OPTIONS.includes(selField.type) && (
                <>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="600">Options</Typography>
                  </Divider>
                  {selField.options?.map((opt, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                      <TextField size="small" fullWidth value={opt.label}
                        onChange={e => {
                          const opts = [...selField.options];
                          opts[i] = { label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') };
                          updateField(selField.id, { options: opts });
                        }}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><Typography variant="caption" color="text.disabled">{i + 1}</Typography></InputAdornment> } }}
                      />
                      <IconButton size="small" color="error" onClick={() => {
                        updateField(selField.id, { options: selField.options.filter((_, idx) => idx !== i) });
                      }}>
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  ))}
                  <Button size="small" startIcon={<AddIcon />} onClick={() => {
                    const n = (selField.options?.length || 0) + 1;
                    updateField(selField.id, { options: [...(selField.options || []), { label: `Option ${n}`, value: `option_${n}` }] });
                  }} sx={{ textTransform: 'none', fontWeight: 600, mt: 0.5 }}>
                    Add Option
                  </Button>
                </>
              )}

              {/* ── Validations ── */}
              {HAS_VALIDATIONS.includes(selField.type) && (
                <>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="600">Validations</Typography>
                  </Divider>
                  {['text', 'textarea', 'email', 'phone'].includes(selField.type) && (
                    <Grid container spacing={1.5} sx={{ mb: 1 }}>
                      <Grid size={6}>
                        <TextField label="Min Length" size="small" type="number" fullWidth
                          value={selField.validations?.minLength || ''}
                          onChange={e => updateField(selField.id, { validations: { ...selField.validations, minLength: e.target.value ? +e.target.value : undefined } })} />
                      </Grid>
                      <Grid size={6}>
                        <TextField label="Max Length" size="small" type="number" fullWidth
                          value={selField.validations?.maxLength || ''}
                          onChange={e => updateField(selField.id, { validations: { ...selField.validations, maxLength: e.target.value ? +e.target.value : undefined } })} />
                      </Grid>
                    </Grid>
                  )}
                  {selField.type === 'number' && (
                    <Grid container spacing={1.5} sx={{ mb: 1 }}>
                      <Grid size={6}>
                        <TextField label="Min Value" size="small" type="number" fullWidth
                          value={selField.validations?.min || ''}
                          onChange={e => updateField(selField.id, { validations: { ...selField.validations, min: e.target.value ? +e.target.value : undefined } })} />
                      </Grid>
                      <Grid size={6}>
                        <TextField label="Max Value" size="small" type="number" fullWidth
                          value={selField.validations?.max || ''}
                          onChange={e => updateField(selField.id, { validations: { ...selField.validations, max: e.target.value ? +e.target.value : undefined } })} />
                      </Grid>
                    </Grid>
                  )}
                  <TextField label="Regex Pattern" size="small" fullWidth
                    value={selField.validations?.regex || ''}
                    onChange={e => updateField(selField.id, { validations: { ...selField.validations, regex: e.target.value || undefined } })}
                    sx={{ mb: 1 }}
                    slotProps={{ input: { sx: { fontFamily: 'monospace', fontSize: '0.8rem' } } }}
                  />
                </>
              )}
            </Box>
          )}
        </Paper>
      </Box>

      {/* ── Edit Title & Description Dialog ─────────────────────────────── */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}>
        <DialogTitle sx={{ fontWeight: 800, pb: 0.5 }}>Edit Form Details</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Update the form title and description. Changes apply immediately.
          </Typography>
          {editError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{editError}</Alert>}
          <TextField
            label="Form Title"
            value={editData.title}
            onChange={e => setEditData(p => ({ ...p, title: e.target.value }))}
            fullWidth required autoFocus
            slotProps={{ input: { sx: { borderRadius: 2 } } }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description (optional)"
            value={editData.description}
            onChange={e => setEditData(p => ({ ...p, description: e.target.value }))}
            fullWidth multiline rows={3}
            slotProps={{ input: { sx: { borderRadius: 2 } } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleSaveMeta} variant="contained" disabled={editSaving}
            sx={{ borderRadius: 2, px: 4, fontWeight: 600, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            {editSaving ? <CircularProgress size={22} color="inherit" /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
