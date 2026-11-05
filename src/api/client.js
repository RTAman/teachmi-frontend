const API_BASE = '/api/v1';

export class ApiError extends Error {
  constructor(status) {
    super(`API error: ${status}`);
    this.status = status;
  }
}

export async function request(path, { method = 'GET', body } = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0);
  }

  if (!response.ok) throw new ApiError(response.status);
  if (response.status === 204) return null;
  return response.json().catch(() => null);
}
