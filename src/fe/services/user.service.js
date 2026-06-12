export const UserService = {
  getUsers: async () => {
    const res = await fetch('/api/v0/users');
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch users');
    }
    return res.json();
  },

  createUser: async (data) => {
    // Assuming POST /api/v0/users creates an employee account under the current company
    const res = await fetch('/api/v0/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create user');
    }
    return res.json();
  }
};
