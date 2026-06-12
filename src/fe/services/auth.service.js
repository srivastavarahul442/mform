export const AuthService = {
  login: async (email, password) => {
    const res = await fetch('/api/v0/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }
    return res.json();
  },

  logout: async () => {
    const res = await fetch('/api/v0/auth/logout', {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Logout failed');
    return res.json();
  },

  getMe: async () => {
    const res = await fetch('/api/v0/auth/me');
    if (!res.ok) {
      throw new Error('Not authenticated');
    }
    return res.json();
  },

  registerCompany: async (data) => {
    const res = await fetch('/api/v0/auth/register-company', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Registration failed');
    }
    return res.json();
  }
};
