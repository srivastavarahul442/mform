"use client";

import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Link, InputAdornment, SvgIcon, CircularProgress } from '@mui/material';
import { useAuth } from '@/src/fe/store/AuthContext';
import { useRouter } from 'next/navigation';

// SvgIcons to avoid package issues
const EmailIcon = (props) => <SvgIcon {...props}><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></SvgIcon>;
const LockIcon = (props) => <SvgIcon {...props}><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></SvgIcon>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard/forms');
    } catch (err) {
      setError(err.message || 'Failed to login');
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background circles */}
      <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(37,99,235,0) 100%)', top: -100, left: -100, zIndex: 0 }} />
      <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(147,51,234,0.1) 0%, rgba(147,51,234,0) 100%)', bottom: -50, right: -50, zIndex: 0 }} />

      <Card 
        sx={{ 
          maxWidth: 420, 
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
              Welcome Back
            </Typography>
            <Typography color="text.secondary" variant="body1">
              Please enter your details to sign in.
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'action.active' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, bgcolor: '#f8fafc', '& fieldset': { borderColor: '#e2e8f0' } }
                }
              }}
            />
            <TextField
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'action.active' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, bgcolor: '#f8fafc', '& fieldset': { borderColor: '#e2e8f0' } }
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 1, 
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Don't have a company account?{' '}
              <Link href="/register" underline="none" sx={{ color: '#2563eb', fontWeight: 600, '&:hover': { color: '#1d4ed8' } }}>
                Register here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
