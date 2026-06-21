"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Typography, Button, Card, CircularProgress, Alert, Paper, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Avatar, Pagination,
  Select, MenuItem, TextField
} from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import { FormService } from '@/src/fe/services/form.service';

const BackIcon = (props) => <SvgIcon {...props}><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></SvgIcon>;
const ViewIcon = (props) => <SvgIcon {...props}><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></SvgIcon>;
const PersonIcon = (props) => <SvgIcon {...props}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></SvgIcon>;
const InboxIcon = (props) => <SvgIcon {...props}><path d="M19 3H4.99C3.89 3 3 3.9 3 5L3 19c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z" /></SvgIcon>;

export default function SubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [formMeta, setFormMeta] = useState(null);
  const [version, setVersion] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [jumpPage, setJumpPage] = useState('');

  // View details modal
  const [viewSub, setViewSub] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id, page, limit]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [formData, subsData] = await Promise.all([
        FormService.getFormById(id),
        FormService.getFormSubmissions(id, page, limit)
      ]);
      setFormMeta(formData.form);
      setVersion(formData.version);
      setSubmissions(subsData.submissions || []);
      setTotalPages(subsData.totalPages || 1);
      setTotalCount(subsData.totalCount || 0);
    } catch (err) {
      setError(err.message || 'Failed to load submissions data');
    } finally {
      setLoading(false);
    }
  };

  const getFieldLabel = (fieldId, subVersion) => {
    const targetVersion = subVersion || version; // fallback to active version if missing
    if (!targetVersion || !targetVersion.sections) return fieldId;
    for (const sec of targetVersion.sections) {
      const f = sec.fields?.find(fld => fld.id === fieldId);
      if (f) return f.label;
    }
    return fieldId;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleCloseView = () => setViewSub(null);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 16, gap: 2 }}>
        <CircularProgress size={40} thickness={4} />
        <Typography color="text.secondary" variant="body2">Loading responses...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 3, pb: 6 }}>
      {/* Top Navigation */}
      <Box sx={{ mb: 4, pt: 2, display: 'flex', alignItems: 'center' }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => router.push('/dashboard/forms')}
          sx={{ textTransform: 'none', color: '#64748b', fontWeight: 600, mr: 2, borderRadius: 2, '&:hover': { bgcolor: '#f1f5f9' } }}
        >
          Back to Forms
        </Button>
      </Box>

      {/* Header */}
      <Paper sx={{
        p: 4, mb: 4, borderRadius: 4,
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        boxShadow: '0 10px 30px rgba(30,41,59,0.2)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative blobs */}
        <Box sx={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
        <Box sx={{ position: 'absolute', bottom: -40, right: 80, width: 100, height: 100, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />

        <Box sx={{ position: 'relative' }}>
          <Chip
            label={formMeta?.status === 'published' ? '● Live' : '◌ Draft'}
            size="small"
            sx={{
              mb: 1.5,
              bgcolor: formMeta?.status === 'published' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.1)',
              color: formMeta?.status === 'published' ? '#34d399' : '#94a3b8',
              fontWeight: 700, fontSize: '0.7rem', border: '1px solid',
              borderColor: formMeta?.status === 'published' ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.15)'
            }}
          />
          <Typography variant="h4" fontWeight="800" sx={{ mb: 0.5, color: '#ffffff' }}>
            {formMeta?.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Showing all responses collected from this form
          </Typography>
        </Box>

        <Box sx={{
          position: 'relative',
          textAlign: 'center',
          bgcolor: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 3, px: 4, py: 2.5
        }}>
          <Typography variant="h3" fontWeight="900" sx={{ lineHeight: 1, color: '#ffffff' }}>{totalCount}</Typography>
          <Typography variant="caption" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)' }}>
            Total Responses
          </Typography>
        </Box>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* Submissions Table */}
      <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', py: 2 }}>Respondent</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submitted At</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <InboxIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 1, display: 'block', mx: 'auto' }} />
                    <Typography color="text.secondary" fontWeight={600}>No responses yet</Typography>
                    <Typography color="text.disabled" variant="body2">Responses will appear here once submitted.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((sub, index) => (
                  <TableRow key={sub._id} hover sx={{ '&:hover': { bgcolor: '#f8fafc' }, '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][index % 5], fontSize: '0.8rem', fontWeight: 700 }}>
                          {getInitials(sub.submittedBy?.name)}
                        </Avatar>
                        <Typography variant="body2" fontWeight="600" color="#0f172a">
                          {sub.submittedBy?.name || <Typography component="span" variant="body2" color="text.disabled">Unknown</Typography>}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#334155">{sub.submittedBy?.phone || '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#334155">{sub.submittedBy?.email || '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" color="#334155" fontWeight={500}>{new Date(sub.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</Typography>
                        <Typography variant="caption" color="text.secondary">{new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => setViewSub(sub)}
                        sx={{ bgcolor: '#eff6ff', color: '#3b82f6', '&:hover': { bgcolor: '#dbeafe', transform: 'scale(1.1)' }, transition: 'all 0.2s', borderRadius: 2 }}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {totalCount > 0 && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">Rows per page:</Typography>
              <Select
                size="small"
                value={limit}
                onChange={(e) => {
                  setLimit(e.target.value);
                  setPage(1); // Reset to page 1 when changing limit
                }}
                sx={{ height: 32, fontSize: '0.875rem', bgcolor: 'white' }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </Box>

            {totalPages > 1 && (
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={(e, val) => setPage(val)} 
                color="primary" 
                shape="rounded"
                sx={{ '& .MuiPaginationItem-root': { fontWeight: 600 } }}
              />
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">Go to:</Typography>
              <TextField
                size="small"
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const p = parseInt(jumpPage);
                    if (p && p >= 1 && p <= totalPages) {
                      setPage(p);
                      setJumpPage('');
                    }
                  }
                }}
                placeholder="Page"
                sx={{ width: 70, bgcolor: 'white', '& .MuiInputBase-root': { height: 32, fontSize: '0.875rem' } }}
              />
            </Box>
          </Box>
        )}
      </Card>

      {/* View Submission Details Dialog */}
      <Dialog open={!!viewSub} onClose={handleCloseView} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 4, overflow: 'hidden' } } }}>
        {/* Colored header */}
        <Box sx={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', px: 3, pt: 3, pb: 3 }}>
          <DialogTitle component="div" sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <PersonIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="800" component="span" display="block" sx={{ color: '#ffffff' }}>Submission Details</Typography>
                {viewSub && (
                  <Typography variant="caption" component="span" display="block" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Submitted on {new Date(viewSub.submittedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                )}
              </Box>
            </Box>
          </DialogTitle>
        </Box>

        <DialogContent sx={{ py: 3, px: 3 }}>
          {viewSub && (
            <Box>
              {/* Respondent Info */}
              <Typography variant="overline" color="text.secondary" fontWeight="800" sx={{ letterSpacing: '0.08em' }}>Respondent Info</Typography>
              <Box sx={{ mt: 1, mb: 3, borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <Grid container>
                  {[
                    { label: 'Name', value: viewSub.submittedBy?.name || 'N/A' },
                    { label: 'Phone', value: viewSub.submittedBy?.phone || 'N/A' },
                    { label: 'Email', value: viewSub.submittedBy?.email || 'N/A' },
                  ].map((item, i, arr) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={item.label} sx={{ p: 2, borderRight: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none', bgcolor: i % 2 === 0 ? '#f8fafc' : 'white' }}>
                      <Typography variant="caption" color="text.secondary" display="block" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>{item.label}</Typography>
                      <Typography variant="body2" fontWeight="700" color="#0f172a">{item.value}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Answers */}
              <Typography variant="overline" color="text.secondary" fontWeight="800" sx={{ letterSpacing: '0.08em' }}>Form Answers</Typography>
              <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {viewSub.answers && viewSub.answers.length > 0 ? (
                  viewSub.answers.map((ans, idx) => (
                    <Box key={idx} sx={{ p: 2.5, borderRadius: 3, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <Typography variant="caption" color="#64748b" fontWeight={700} display="block" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                        {getFieldLabel(ans.fieldId, viewSub.versionId)}
                      </Typography>
                      <Typography variant="body1" fontWeight="600" color="#0f172a">
                        {Array.isArray(ans.value) ? ans.value.join(', ') : (ans.value?.toString() || '—')}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No answers provided.</Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, bgcolor: '#f8fafc' }}>
          <Button
            onClick={handleCloseView}
            variant="contained"
            disableElevation
            sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700, px: 4, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', '&:hover': { background: 'linear-gradient(135deg, #2563eb, #7c3aed)' } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
