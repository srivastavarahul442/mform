"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  Box, Typography, Button, Card, CardContent, CircularProgress, Alert, Paper,
  TextField, RadioGroup, Radio, FormControlLabel, Checkbox, FormGroup,
  Select, MenuItem, InputLabel, FormControl, Rating, Divider
} from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import { FormService } from '@/src/fe/services/form.service';

const CheckCircleIcon = (props) => <SvgIcon {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></SvgIcon>;

export default function PublicFormPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;
  const token = searchParams.get('token');

  const [formMeta, setFormMeta] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form State
  const [answers, setAnswers] = useState({});
  const [submitter, setSubmitter] = useState({ name: '', phone: '', email: '' });
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [id, token]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const data = await FormService.getPublicForm(id, token || '');
      setFormMeta(data.form);
      setSections(data.sections || []);

      if (data.prefilledUser) {
        setSubmitter({
          name: data.prefilledUser.name || '',
          phone: data.prefilledUser.phone || '',
          email: data.prefilledUser.email || ''
        });
        setIsLocked(true);
      }
      
      // Initialize answer state
      const initialAnswers = {};
      data.sections?.forEach(sec => {
        sec.fields?.forEach(f => {
          initialAnswers[f.id] = ['checkbox', 'multiselect'].includes(f.type) ? [] : '';
        });
      });
      setAnswers(initialAnswers);
    } catch (err) {
      setError(err.message || 'This form is no longer available or does not exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxChange = (fieldId, optionValue, isChecked) => {
    setAnswers(prev => {
      const current = prev[fieldId] || [];
      if (isChecked) return { ...prev, [fieldId]: [...current, optionValue] };
      return { ...prev, [fieldId]: current.filter(v => v !== optionValue) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submitter.phone) {
      setError('Phone number is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const payloadAnswers = Object.entries(answers).map(([fieldId, value]) => ({
        fieldId, value
      }));

      await FormService.submitPublicForm(id, {
        submittedBy: submitter,
        answers: payloadAnswers,
        token: token || undefined
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f8fafc' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !formMeta) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f8fafc', p: 3 }}>
        <Card sx={{ maxWidth: 500, width: '100%', borderRadius: 3, p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" fontWeight="700" sx={{ mb: 2 }}>Oops!</Typography>
          <Typography color="text.secondary">{error}</Typography>
        </Card>
      </Box>
    );
  }

  if (success) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f8fafc', p: 3 }}>
        <Card sx={{ maxWidth: 500, width: '100%', borderRadius: 3, p: 5, textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: '#10b981', mb: 2 }} />
          <Typography variant="h4" fontWeight="800" color="#1e293b" sx={{ mb: 2 }}>Thank You!</Typography>
          <Typography color="text.secondary">Your response has been successfully recorded.</Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: 8, px: 3 }}>
      <Box sx={{ maxWidth: 700, mx: 'auto' }}>
        
        {/* Form Header */}
        <Paper sx={{ p: 5, mb: 4, borderRadius: 3, borderTop: '8px solid #3b82f6', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <Typography variant="h3" fontWeight="800" color="#1e293b" sx={{ mb: 2 }}>{formMeta?.title}</Typography>
          {formMeta?.description && (
            <Typography variant="body1" color="#475569" sx={{ whiteSpace: 'pre-line' }}>{formMeta.description}</Typography>
          )}
        </Paper>

        {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          {/* Submitter Info Card */}
          <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'visible' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="700" color="#1e293b" sx={{ mb: 3 }}>Your Details</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField 
                  label="Full Name" 
                  fullWidth 
                  value={submitter.name}
                  onChange={(e) => setSubmitter({ ...submitter, name: e.target.value })}
                  slotProps={{ htmlInput: { readOnly: isLocked } }}
                  disabled={isLocked}
                />
                <TextField 
                  label="Phone Number" 
                  fullWidth 
                  required 
                  value={submitter.phone}
                  onChange={(e) => setSubmitter({ ...submitter, phone: e.target.value })}
                  slotProps={{ htmlInput: { readOnly: isLocked } }}
                  disabled={isLocked}
                />
                <TextField 
                  label="Email Address" 
                  type="email" 
                  fullWidth 
                  value={submitter.email}
                  onChange={(e) => setSubmitter({ ...submitter, email: e.target.value })}
                  slotProps={{ htmlInput: { readOnly: isLocked } }}
                  disabled={isLocked}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Form Sections / Fields */}
          {sections.map((section, sIdx) => (
            <Box key={section.id || sIdx} sx={{ mb: 4 }}>
              {section.fields.map(field => {
                const isRequired = field.required;
                return (
                  <Card key={field.id} sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'visible' }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="subtitle1" fontWeight="600" color="#1e293b" sx={{ mb: 2 }}>
                        {field.label} {isRequired && <Typography component="span" color="error">*</Typography>}
                      </Typography>

                      {['text', 'email', 'phone'].includes(field.type) && (
                        <TextField 
                          fullWidth 
                          placeholder={field.placeholder}
                          required={isRequired}
                          value={answers[field.id] || ''}
                          onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                        />
                      )}

                      {field.type === 'textarea' && (
                        <TextField 
                          fullWidth 
                          multiline 
                          rows={4}
                          placeholder={field.placeholder}
                          required={isRequired}
                          value={answers[field.id] || ''}
                          onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                        />
                      )}

                      {field.type === 'number' && (
                        <TextField 
                          fullWidth 
                          type="number"
                          placeholder={field.placeholder}
                          required={isRequired}
                          value={answers[field.id] || ''}
                          onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                        />
                      )}

                      {field.type === 'date' && (
                        <TextField 
                          fullWidth 
                          type="date"
                          required={isRequired}
                          InputLabelProps={{ shrink: true }}
                          value={answers[field.id] || ''}
                          onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                        />
                      )}

                      {field.type === 'datetime' && (
                        <TextField 
                          fullWidth 
                          type="datetime-local"
                          required={isRequired}
                          InputLabelProps={{ shrink: true }}
                          value={answers[field.id] || ''}
                          onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                        />
                      )}

                      {field.type === 'radio' && (
                        <RadioGroup
                          value={answers[field.id] || ''}
                          onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                        >
                          {field.options?.map((opt, i) => (
                            <FormControlLabel key={i} value={opt.value} control={<Radio />} label={opt.label} />
                          ))}
                        </RadioGroup>
                      )}

                      {field.type === 'checkbox' && (
                        <FormGroup>
                          {field.options?.map((opt, i) => (
                            <FormControlLabel 
                              key={i} 
                              control={
                                <Checkbox 
                                  checked={(answers[field.id] || []).includes(opt.value)}
                                  onChange={(e) => handleCheckboxChange(field.id, opt.value, e.target.checked)}
                                />
                              } 
                              label={opt.label} 
                            />
                          ))}
                        </FormGroup>
                      )}

                      {field.type === 'select' && (
                        <FormControl fullWidth>
                          {field.placeholder && <InputLabel>{field.placeholder}</InputLabel>}
                          <Select
                            value={answers[field.id] || ''}
                            onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                            displayEmpty={!field.placeholder}
                          >
                            {!field.placeholder && <MenuItem value="" disabled>Select an option</MenuItem>}
                            {field.options?.map((opt, i) => (
                              <MenuItem key={i} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}

                      {field.type === 'rating' && (
                        <Rating 
                          value={Number(answers[field.id]) || 0}
                          onChange={(_, newValue) => handleAnswerChange(field.id, newValue)}
                          size="large"
                        />
                      )}

                      {field.type === 'signature' && (
                        <Box sx={{ border: '1px solid #cbd5e1', borderRadius: 2, height: 120, bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography color="text.disabled">Signature field (Placeholder)</Typography>
                        </Box>
                      )}

                      {field.type === 'file' && (
                        <Button variant="outlined" component="label">
                          Upload File
                          <input type="file" hidden onChange={(e) => handleAnswerChange(field.id, e.target.files[0]?.name || '')} />
                        </Button>
                      )}
                      {field.type === 'file' && answers[field.id] && (
                        <Typography variant="caption" sx={{ ml: 2, color: '#10b981' }}>{answers[field.id]}</Typography>
                      )}

                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              disabled={submitting}
              sx={{ 
                px: 6, 
                py: 1.5, 
                borderRadius: 3, 
                fontWeight: 700,
                fontSize: '1.1rem',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
              }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Response'}
            </Button>
          </Box>
        </form>

      </Box>
    </Box>
  );
}
