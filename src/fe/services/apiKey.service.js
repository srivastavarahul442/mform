export const ApiKeyService = {
  listKeys: async () => {
    const res = await fetch('/api/v0/settings/api-keys');
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch API keys');
    }
    return res.json();
  },

  createKey: async (name) => {
    const res = await fetch('/api/v0/settings/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create API key');
    }
    return res.json();
  },

  revokeKey: async (keyId) => {
    const res = await fetch(`/api/v0/settings/api-keys/${keyId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to revoke API key');
    }
    return res.json();
  },
};
