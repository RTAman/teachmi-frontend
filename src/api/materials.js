import { request } from './client';

export function uploadMaterial(file, idempotencyKey) {
  const form = new FormData();
  form.append('file', file);
  return request('/materials', { method: 'POST', form, idempotencyKey });
}

export function createTextMaterial({ title, text, concept }, idempotencyKey) {
  return request('/materials', {
    method: 'POST',
    body: { ...(title ? { title } : {}), text, concept },
    idempotencyKey,
  });
}

export function getMaterial(materialId) {
  return request(`/materials/${materialId}`);
}

export function addConcept(materialId, { name, scope, evidenceText }, idempotencyKey) {
  return request(`/materials/${materialId}/concepts`, {
    method: 'POST',
    body: { name, scope, ...(evidenceText ? { evidenceText } : {}) },
    idempotencyKey,
  });
}

export function updateConcept(materialId, conceptId, changes) {
  return request(`/materials/${materialId}/concepts/${conceptId}`, { method: 'PATCH', body: changes });
}
