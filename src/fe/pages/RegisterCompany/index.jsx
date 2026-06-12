"use client";

import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Link, Grid } from '@mui/material';
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', py: 4 }}>
      <Card sx={{ maxWidth: 600, width: '100%', mx: 2, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            Register Company
          </Typography>
          <Typography color="text.secondary" align="center" mb={4}>
            Create your mForm workspace
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <TextField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required fullWidth />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required fullWidth />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required fullWidth />
              </Grid>
              <Grid xs={12}>
                <TextField label="Work Email" type="email" name="email" value={formData.email} onChange={handleChange} required fullWidth />
              </Grid>
              <Grid xs={12}>
                <TextField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required fullWidth />
              </Grid>
              <Grid xs={12}>
                <TextField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required fullWidth />
              </Grid>
              <Grid xs={12}>
                <Button type="submit" variant="contained" color="primary" size="large" fullWidth disabled={loading} sx={{ mt: 2 }}>
                  {loading ? 'Registering...' : 'Create Account'}
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link href="/login" underline="hover">
                Sign in
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
