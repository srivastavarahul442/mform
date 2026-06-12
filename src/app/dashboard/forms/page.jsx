"use client";

import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardActions, IconButton, SvgIcon, Divider, Chip } from '@mui/material';

// SvgIcons
const AddIcon = (props) => <SvgIcon {...props}><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></SvgIcon>;
const DescriptionIcon = (props) => <SvgIcon {...props}><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></SvgIcon>;
const MoreVertIcon = (props) => <SvgIcon {...props}><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></SvgIcon>;
const ViewIcon = (props) => <SvgIcon {...props}><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></SvgIcon>;

export default function FormsPage() {
  const [forms, setForms] = useState([]); // Empty array for empty state

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

      {forms.length === 0 ? (
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
            <Grid item xs={12} sm={6} md={4} key={form.id}>
              <Card sx={{ borderRadius: 3, border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', '&:hover': { boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }, transition: 'all 0.2s' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ p: 1.5, bgcolor: '#eff6ff', borderRadius: 2, color: '#2563eb' }}>
                      <DescriptionIcon />
                    </Box>
                    <Chip label="Draft" size="small" sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 600 }} />
                  </Box>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>{form.title}</Typography>
                  <Typography variant="body2" color="text.secondary">0 Responses • Updated today</Typography>
                </CardContent>
                <Divider sx={{ borderColor: '#f8fafc' }} />
                <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
                  <Button size="small" startIcon={<ViewIcon />} sx={{ textTransform: 'none', fontWeight: 600, color: '#475569' }}>
                    Preview
                  </Button>
                  <IconButton size="small" sx={{ color: '#94a3b8' }}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}