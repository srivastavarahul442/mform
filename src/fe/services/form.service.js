export const FormService = {
  getForms: async () => {
    const res = await fetch('/api/v0/forms');
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch forms');
    }
    return res.json();
  },

  createForm: async (data) => {
    const res = await fetch('/api/v0/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create form');
    }
    return res.json();
  },

  getFormById: async (id) => {
    const res = await fetch(`/api/v0/forms/${id}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch form');
    }
    return res.json();
  },

  updateForm: async (id, data) => {
    const res = await fetch(`/api/v0/forms/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to save form draft');
    }
    return res.json();
  },

  // PUT: update only title + description (does NOT create a new FormVersion)
  updateFormMeta: async (id, { title, description }) => {
    const res = await fetch(`/api/v0/forms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update form details');
    }
    return res.json();
  },

  publishForm: async (id) => {
    const res = await fetch(`/api/v0/forms/${id}/publish`, {
      method: 'POST',
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to publish form');
    }
    return res.json();
  },

  getFormVersions: async (id) => {
    const res = await fetch(`/api/v0/forms/${id}/versions`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch form versions');
    }
    return res.json();
  },

  getFormVersionByNum: async (id, version) => {
    const res = await fetch(`/api/v0/forms/${id}/versions/${version}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch version');
    }
    return res.json();
  },

  getFormSubmissions: async (id, page = 1, limit = 10) => {
    const res = await fetch(`/api/v0/forms/${id}/submissions?page=${page}&limit=${limit}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch form submissions');
    }
    return res.json();
  },

  getPublicForm: async (id, token = '') => {
    const res = await fetch(`/api/v0/public/forms/${id}${token ? `?token=${token}` : ''}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch public form');
    }
    return res.json();
  },

  submitPublicForm: async (id, payload) => {
    const res = await fetch(`/api/v0/public/forms/${id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to submit form');
    }
    return res.json();
  },

  generateInvite: async (id, targetUser) => {
    const res = await fetch(`/api/v0/forms/${id}/invites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(targetUser)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to generate invite link');
    }
    return res.json();
  }
};
