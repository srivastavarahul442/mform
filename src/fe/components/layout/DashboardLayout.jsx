"use client";

import React, { useState, useEffect } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, IconButton, Divider, Avatar, Menu, MenuItem, Tooltip, SvgIcon
} from '@mui/material';
import { useAuth } from '@/src/fe/store/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

const drawerWidth = 260;

// Direct SVG paths matching real MUI Icons
const MenuIcon = (props) => <SvgIcon {...props}><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></SvgIcon>;
const FormIcon = (props) => <SvgIcon {...props}><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></SvgIcon>;
const UsersIcon = (props) => <SvgIcon {...props}><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></SvgIcon>;
const LogoutIcon = (props) => <SvgIcon {...props}><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" /></SvgIcon>;
const KeyIcon = (props) => <SvgIcon {...props}><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></SvgIcon>;

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null; // prevent rendering dashboard before redirect kicks in
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    await logout();
    router.push('/');
  };

  const menuItems = [
    { text: 'Forms Dashboard', icon: <FormIcon />, path: '/dashboard/forms' },
    { text: 'Team Directory', icon: <UsersIcon />, path: '/dashboard/employees' },
  ];

  const settingsItems = [
    { text: 'API Keys', icon: <KeyIcon />, path: '/dashboard/settings/api-keys' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ py: 2 }}>
        <Box sx={{
          width: 32,
          height: 32,
          borderRadius: 2,
          bgcolor: 'primary.main',
          mr: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          m
        </Box>
        <Typography variant="h6" noWrap component="div" fontWeight="800" sx={{ letterSpacing: '-0.5px' }}>
          mForm
        </Typography>
      </Toolbar>

      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 1 }}>
          Workspace
        </Typography>
      </Box>

      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const active = pathname.startsWith(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={active}
                onClick={() => router.push(item.path)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.50',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'primary.100' }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: active ? 'primary.main' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography sx={{ fontWeight: active ? 600 : 500, fontSize: '0.9rem' }}>
                      {item.text}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Settings section */}
      <Box sx={{ px: 2, pb: 1 }}>
        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 1 }}>
          Developer
        </Typography>
        <List disablePadding>
          {settingsItems.map((item) => {
            const active = pathname.startsWith(item.path);
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={active}
                  onClick={() => router.push(item.path)}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: 'primary.50',
                      color: 'primary.main',
                      '&:hover': { bgcolor: 'primary.100' }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: active ? 'primary.main' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography sx={{ fontWeight: active ? 600 : 500, fontSize: '0.9rem' }}>
                        {item.text}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ p: 2 }}>
        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body2" fontWeight="600" color="text.secondary">
            Plan: Free Tier
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {pathname.includes('/employees') ? 'Team Directory'
              : pathname.includes('/settings/api-keys') ? 'API Keys'
                : pathname.includes('/submissions') ? 'Form Submissions'
                  : pathname.includes('/builder') ? 'Form Builder'
                    : 'Forms Dashboard'}
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={user ? `${user.firstName} ${user.lastName}` : 'User'}
                  src="/static/images/avatar/2.jpg"
                  sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '1rem' }}
                >
                  {user ? user.firstName.charAt(0) : 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              slotProps={{
                paper: {
                  elevation: 3,
                  sx: { minWidth: 200, borderRadius: 2, mt: 1.5 }
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user ? user.email : ''}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1.5 }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <Typography sx={{ textAlign: 'center', fontWeight: 500 }}>Sign out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', boxShadow: 2 },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid', borderColor: 'divider' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          width: { sm: `calc(100% - ${drawerWidth}px)` }, 
          bgcolor: '#f8fafc', 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2, md: 3 }
        }}
      >
        <Toolbar sx={{ flexShrink: 0, minHeight: { xs: 0, sm: 0 }, p: 0, m: 0 }} />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', mt: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
