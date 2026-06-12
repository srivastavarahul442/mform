"use client";

import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Link, Grid, CircularProgress } from '@mui/material';
import { AuthService } from '@/src/fe/services/auth.service';
import { useRouter } from 'next/navigation';

export default function RegisterCompanyPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await AuthService.registerCompany(formData);
      // Registration successful, redirect to login
      router.push('/login?registered=true');
    } catch (err) {
      setError(err.message || 'Failed to register company');
      setLoading(false);
    }
  };

  const inputStyle = { borderRadius: 2, bgcolor: '#f8fafc', '& fieldset': { borderColor: '#e2e8f0' } };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: 4
      }}
    >
      {/* Decorative background circles */}
      <Box sx={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0) 100%)', top: -150, left: -150, zIndex: 0 }} />
      <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(147,51,234,0.08) 0%, rgba(147,51,234,0) 100%)', bottom: -100, right: -100, zIndex: 0 }} />

      <Card 
        sx={{ 
          maxWidth: 600, 
          width: '100%', 
          mx: 2, 
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)', 
          borderRadius: 4,
          zIndex: 1,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.8)'
        }}
      >
        <CardContent sx={{ p: { xs: 4, md: 5 } }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ 
              width: 56, 
              height: 56, 
              borderRadius: 3, 
              background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '2rem', 
              fontWeight: 800, 
              mx: 'auto', 
              mb: 2,
              boxShadow: '0 8px 16px rgba(37,99,235,0.2)'
            }}>
              m
            </Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: '#1e293b' }}>
              Create Workspace
            </Typography>
            <Typography color="text.secondary" variant="body1">
              Set up a company account for your team.
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              <Grid xs={12}>
                <TextField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required fullWidth slotProps={{ input: { sx: inputStyle } }} />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required fullWidth slotProps={{ input: { sx: inputStyle } }} />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required fullWidth slotProps={{ input: { sx: inputStyle } }} />
              </Grid>
              <Grid xs={12}>
                <TextField label="Work Email" type="email" name="email" value={formData.email} onChange={handleChange} required fullWidth slotProps={{ input: { sx: inputStyle } }} />
              </Grid>
              <Grid xs={12}>
                <TextField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required fullWidth slotProps={{ input: { sx: inputStyle } }} />
              </Grid>
              <Grid xs={12}>
                <TextField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required fullWidth slotProps={{ input: { sx: inputStyle } }} />
              </Grid>
              <Grid xs={12} sx={{ mt: 1 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large" 
                  fullWidth 
                  disabled={loading} 
                  sx={{ 
                    py: 1.5, 
                    borderRadius: 2, 
                    textTransform: 'none', 
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    boxShadow: '0 8px 16px rgba(37,99,235,0.2)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                      boxShadow: '0 12px 20px rgba(37,99,235,0.3)',
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Already have an account?{' '}
              <Link href="/login" underline="none" sx={{ color: '#2563eb', fontWeight: 600, '&:hover': { color: '#1d4ed8' } }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
