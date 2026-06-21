"use client";

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert, CircularProgress, Divider, Tooltip, SvgIcon
} from '@mui/material';
import { ApiKeyService } from '@/src/fe/services/apiKey.service';

// ─── Icons ───────────────────────────────────────────────────────────────────
const AddIcon = (p) => <SvgIcon {...p}><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></SvgIcon>;
const CopyIcon = (p) => <SvgIcon {...p}><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></SvgIcon>;
const DeleteIcon = (p) => <SvgIcon {...p}><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></SvgIcon>;
const KeyIcon = (p) => <SvgIcon {...p}><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></SvgIcon>;
const TerminalIcon = (p) => <SvgIcon {...p}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-9-1h2v-2h-2v2zm-4 0h2v-2H7v2zm8 0h2v-2h-2v2zm-8-4h2v-2H7v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zm-8-4l1.5 1.5L7 11l2-2-2-2-1.5 1.5L7 10zM11 7h2v2h-2V7z"/></SvgIcon>;

export default function ApiKeysPage() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create dialog
  const [openCreate, setOpenCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Revealed key (shown once after creation)
  const [revealedKey, setRevealedKey] = useState(null);
  const [openReveal, setOpenReveal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Revoke dialog
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [revoking, setRevoking] = useState(false);

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const data = await ApiKeyService.listKeys();
      setKeys(data.keys || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKeys(); }, []);

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;
    setCreateError('');
    setCreating(true);
    try {
      const data = await ApiKeyService.createKey(newKeyName.trim());
      setRevealedKey(data.key);
      setOpenCreate(false);
      setNewKeyName('');
      setOpenReveal(true);
      fetchKeys();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    setRevoking(true);
    try {
      await ApiKeyService.revokeKey(revokeTarget._id);
      setRevokeTarget(null);
      fetchKeys();
    } catch (err) {
      setError(err.message);
    } finally {
      setRevoking(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exampleCurl = revealedKey
    ? `curl -X POST https://yourapp.com/api/external/v0/forms/{FORM_ID}/invites \\
  -H "x-api-key: ${revealedKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John Doe","phone":"9876543210","email":"john@example.com"}'`
    : '';

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{ p: 1.2, bgcolor: '#f0f9ff', borderRadius: 2, color: '#0284c7' }}>
              <KeyIcon sx={{ fontSize: 26 }} />
            </Box>
            <Typography variant="h4" fontWeight="800" sx={{ color: '#1e293b', letterSpacing: '-0.5px' }}>
              API Keys
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Generate secret keys to integrate mForm into your platform via our external API.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setOpenCreate(true); setCreateError(''); setNewKeyName(''); }}
          sx={{
            borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, py: 1.5,
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
          }}
        >
          Generate New Key
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* API Reference Card */}
      <Card sx={{ mb: 4, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', bgcolor: '#f8fafc' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <TerminalIcon sx={{ color: '#64748b' }} />
            <Typography variant="subtitle1" fontWeight="700" color="#334155">
              External API Reference
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Use your API key to generate unique form links for leads from any external system.
          </Typography>
          <Box sx={{ bgcolor: '#1e293b', borderRadius: 2, p: 2.5, fontFamily: 'monospace', fontSize: '0.82rem', color: '#94a3b8', overflow: 'auto', whiteSpace: 'pre' }}>
            <Box component="span" sx={{ color: '#f472b6' }}>POST</Box>
            {' '}
            <Box component="span" sx={{ color: '#67e8f9' }}>/api/external/v0/forms/{'{'}<Box component="span" sx={{ color: '#fbbf24' }}>FORM_ID</Box>{'}'}/invites</Box>
            {'\n'}
            <Box component="span" sx={{ color: '#86efac' }}>x-api-key:</Box>
            {' '}
            <Box component="span" sx={{ color: '#fbbf24' }}>mfk_sk_your_key_here</Box>
            {'\n\n'}
            <Box component="span" sx={{ color: '#64748b' }}>{'// Body'}</Box>
            {'\n'}
            {'{ "name": "Lead Name", "phone": "9876543210", "email": "lead@example.com" }'}
          </Box>
        </CardContent>
      </Card>

      {/* Keys List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : keys.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: 3, border: '1px dashed #cbd5e1' }}>
          <Box sx={{ width: 64, height: 64, bgcolor: '#f1f5f9', borderRadius: '50%', mx: 'auto', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <KeyIcon sx={{ fontSize: 32, color: '#94a3b8' }} />
          </Box>
          <Typography fontWeight="700" color="#1e293b" gutterBottom>No API keys yet</Typography>
          <Typography variant="body2" color="text.secondary">
            Generate your first key to start using the external API.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {keys.map((k) => (
            <Card key={k._id} sx={{
              borderRadius: 3, border: '1px solid #f1f5f9',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              opacity: k.isActive ? 1 : 0.5,
              transition: 'all 0.2s',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1.2, bgcolor: k.isActive ? '#eff6ff' : '#f1f5f9', borderRadius: 2, color: k.isActive ? '#2563eb' : '#94a3b8' }}>
                      <KeyIcon />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography fontWeight="700" color="#1e293b">{k.name}</Typography>
                        <Chip
                          label={k.isActive ? 'Active' : 'Revoked'}
                          size="small"
                          sx={{
                            bgcolor: k.isActive ? '#dcfce7' : '#fee2e2',
                            color: k.isActive ? '#166534' : '#991b1b',
                            fontWeight: 600,
                            fontSize: '0.72rem',
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        <Box component="span" sx={{ fontFamily: 'monospace', bgcolor: '#f8fafc', px: 1, py: 0.2, borderRadius: 1, border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                          {k.keyPrefix}...
                        </Box>
                        {' · '}Created {new Date(k.createdAt).toLocaleDateString()}
                        {k.lastUsedAt && ` · Last used ${new Date(k.lastUsedAt).toLocaleDateString()}`}
                      </Typography>
                    </Box>
                  </Box>
                  {k.isActive && (
                    <Tooltip title="Revoke this key">
                      <IconButton
                        onClick={() => setRevokeTarget(k)}
                        sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* ── Create Key Dialog ── */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}>
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Generate New API Key</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Give this key a descriptive name so you remember where it's being used (e.g. "CRM Integration", "Zapier").
          </Typography>
          {createError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{createError}</Alert>}
          <TextField
            label="Key Name"
            fullWidth
            autoFocus
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="e.g. CRM Integration"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenCreate(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={creating || !newKeyName.trim()} sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}>
            {creating ? <CircularProgress size={22} color="inherit" /> : 'Generate'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Reveal Key Dialog (shown once) ── */}
      <Dialog open={openReveal} onClose={() => setOpenReveal(false)} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}>
        <DialogTitle sx={{ fontWeight: 800, pb: 1, color: '#166534' }}>🎉 API Key Generated!</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            <strong>Copy this key now.</strong> For security, we will never show it again.
          </Alert>
          <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1 }}>Your Secret Key</Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 3 }}>
            <TextField
              fullWidth
              value={revealedKey || ''}
              slotProps={{ htmlInput: { readOnly: true, style: { fontFamily: 'monospace', fontSize: '0.85rem' } } }}
            />
            <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
              <IconButton onClick={() => handleCopy(revealedKey)} color={copied ? 'success' : 'default'} sx={{ flexShrink: 0 }}>
                <CopyIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1.5 }}>Example: Generate a unique invite link</Typography>
          <Box sx={{ bgcolor: '#1e293b', borderRadius: 2, p: 2.5, fontFamily: 'monospace', fontSize: '0.8rem', color: '#94a3b8', overflow: 'auto', whiteSpace: 'pre', position: 'relative' }}>
            <Tooltip title={copied ? 'Copied!' : 'Copy example'}>
              <IconButton onClick={() => handleCopy(exampleCurl)} size="small" sx={{ position: 'absolute', top: 8, right: 8, color: '#64748b', '&:hover': { color: 'white' } }}>
                <CopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Box component="span" sx={{ color: '#f472b6' }}>curl</Box>
            {' -X POST https://yourapp.com/api/external/v0/forms/'}
            <Box component="span" sx={{ color: '#fbbf24' }}>{'{'+'FORM_ID}'}</Box>
            {'/invites \\\n  '}
            <Box component="span" sx={{ color: '#86efac' }}>-H</Box>
            {' "x-api-key: '}
            <Box component="span" sx={{ color: '#67e8f9' }}>{revealedKey?.slice(0, 24)}...</Box>
            {'" \\\n  '}
            <Box component="span" sx={{ color: '#86efac' }}>-H</Box>
            {' "Content-Type: application/json" \\\n  '}
            <Box component="span" sx={{ color: '#86efac' }}>-d</Box>
            {" '{\"name\":\"John Doe\",\"phone\":\"9876543210\"}'"}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenReveal(false)} variant="contained" sx={{ borderRadius: 2, fontWeight: 600, px: 4 }}>
            I've copied the key
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Revoke Confirm Dialog ── */}
      <Dialog open={Boolean(revokeTarget)} onClose={() => setRevokeTarget(null)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}>
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Revoke API Key</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to revoke <strong>"{revokeTarget?.name}"</strong>? Any integrations using this key will immediately stop working.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRevokeTarget(null)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleRevoke} variant="contained" color="error" disabled={revoking} sx={{ borderRadius: 2, fontWeight: 600 }}>
            {revoking ? <CircularProgress size={22} color="inherit" /> : 'Revoke Key'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
