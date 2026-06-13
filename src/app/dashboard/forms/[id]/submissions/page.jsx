"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Typography, Button, Card, CardContent, CircularProgress, Alert, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import { FormService } from '@/src/fe/services/form.service';

const BackIcon = (props) => <SvgIcon {...props}><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></SvgIcon>;
const ViewIcon = (props) => <SvgIcon {...props}><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></SvgIcon>;

export default function SubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [formMeta, setFormMeta] = useState(null);
  const [version, setVersion] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // View details modal
  const [viewSub, setViewSub] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch both form details (to get the fields) and submissions
      const [formData, subsData] = await Promise.all([
        FormService.getFormById(id),
        FormService.getFormSubmissions(id)
      ]);
      setFormMeta(formData.form);
      setVersion(formData.version);
      setSubmissions(subsData.submissions || []);
    } catch (err) {
      setError(err.message || 'Failed to load submissions data');
    } finally {
      setLoading(false);
    }
  };

  // Helper to map fieldId to field label
  const getFieldLabel = (fieldId) => {
    if (!version || !version.sections) return fieldId;
    for (const sec of version.sections) {
      const f = sec.fields?.find(fld => fld.id === fieldId);
      if (f) return f.label;
    }
    return fieldId;
  };

  const handleCloseView = () => setViewSub(null);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 3, pb: 6 }}>
      {/* Top Navigation */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button 
          startIcon={<BackIcon />} 
          onClick={() => router.push('/dashboard/forms')}
          sx={{ textTransform: 'none', color: '#64748b', fontWeight: 600, mr: 2 }}
        >
          Back to Forms
        </Button>
      </Box>

      {/* Header */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="800" color="#1e293b" sx={{ mb: 1 }}>
            Submissions: {formMeta?.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Total Responses: <strong>{submissions.length}</strong>
          </Typography>
        </Box>
        <Chip 
          label={formMeta?.status === 'published' ? 'Live' : 'Draft'} 
          sx={{ 
            bgcolor: formMeta?.status === 'published' ? '#dcfce7' : '#f1f5f9', 
            color: formMeta?.status === 'published' ? '#166534' : '#64748b', 
            fontWeight: 700 
          }} 
        />
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Submissions Table */}
      <Card sx={{ borderRadius: 3, border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Submitted At</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Email</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: '#475569' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary" variant="body1">No submissions yet.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((sub) => (
                  <TableRow key={sub._id} hover>
                    <TableCell>
                      {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell>{sub.submittedBy?.name || <Typography variant="body2" color="text.disabled">N/A</Typography>}</TableCell>
                    <TableCell>{sub.submittedBy?.phone}</TableCell>
                    <TableCell>{sub.submittedBy?.email || <Typography variant="body2" color="text.disabled">N/A</Typography>}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="primary" 
                        size="small" 
                        onClick={() => setViewSub(sub)}
                        sx={{ bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } }}
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
      </Card>

      {/* View Submission Details Dialog */}
      <Dialog open={!!viewSub} onClose={handleCloseView} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="700">Submission Details</Typography>
          {viewSub && (
            <Typography variant="caption" color="text.secondary">
              Submitted on {new Date(viewSub.submittedAt).toLocaleString()}
            </Typography>
          )}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ py: 3 }}>
          {viewSub && (
            <Box>
              {/* Submitter Info */}
              <Typography variant="overline" color="text.secondary" fontWeight="700">Respondent Info</Typography>
              <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2, mb: 3, mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" color="text.secondary" display="block">Name</Typography>
                    <Typography variant="body2" fontWeight="500">{viewSub.submittedBy?.name || 'N/A'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" color="text.secondary" display="block">Phone</Typography>
                    <Typography variant="body2" fontWeight="500">{viewSub.submittedBy?.phone || 'N/A'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" color="text.secondary" display="block">Email</Typography>
                    <Typography variant="body2" fontWeight="500">{viewSub.submittedBy?.email || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Answers */}
              <Typography variant="overline" color="text.secondary" fontWeight="700">Form Answers</Typography>
              <Box sx={{ mt: 1 }}>
                {viewSub.answers && viewSub.answers.length > 0 ? (
                  viewSub.answers.map((ans, idx) => (
                    <Box key={idx} sx={{ mb: 2, pb: 2, borderBottom: idx !== viewSub.answers.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <Typography variant="body2" fontWeight="600" color="#334155" sx={{ mb: 0.5 }}>
                        {getFieldLabel(ans.fieldId)}
                      </Typography>
                      <Typography variant="body1" color="#0f172a">
                        {Array.isArray(ans.value) ? ans.value.join(', ') : (ans.value?.toString() || '-')}
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
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseView} variant="contained" sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
