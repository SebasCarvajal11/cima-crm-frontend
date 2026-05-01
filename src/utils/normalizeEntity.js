/**
 * Normaliza las inconsistencias de IDs del backend.
 * El backend puede retornar `id`, `clientId`, `userId`, `taskId`, etc.
 * Esta función unifica el acceso a las propiedades comunes.
 */

export function normalizeClient(data) {
  if (!data) return null;
  return {
    ...data,
    id: data.clientId || data.id,
    name: data.clientName || data.name || `Cliente ${data.clientId || data.id}`,
    email: data.clientEmail || data.email || '',
    phone: data.clientPhone || data.phone || '',
    company: data.clientCompany || data.company || '',
    plan: data.clientPlan || data.plan || 'basic',
  };
}

export function normalizeUser(data) {
  if (!data) return null;
  return {
    ...data,
    id: data.userId || data.id,
    name: data.userName || data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
    email: data.userEmail || data.email || '',
    role: data.userRole || data.role || 'Worker',
  };
}

export function normalizeTask(data) {
  if (!data) return null;
  return {
    ...data,
    id: data.taskId || data.id,
    description: data.taskDescription || data.description || '',
    status: data.taskStatus || data.status || 'Pending',
    projectId: data.projectId || data.project_id,
    workerId: data.workerId || data.worker_id,
    projectName: data.projectName || data.project_name || '',
    workerName: data.workerName || data.worker_name || '',
  };
}

export function normalizeProject(data) {
  if (!data) return null;
  return {
    ...data,
    id: data.projectId || data.id,
    name: data.projectName || data.name || '',
    status: data.projectStatus || data.status || 'Active',
    clientId: data.clientId || data.client_id,
    clientName: data.clientName || data.client_name || '',
  };
}

/**
 * Función genérica para normalizar cualquier entidad.
 * Detecta automáticamente el tipo de ID disponible.
 */
export function normalizeEntity(data, type = 'generic') {
  if (!data) return null;

  const normalizers = {
    client: normalizeClient,
    user: normalizeUser,
    task: normalizeTask,
    project: normalizeProject,
    generic: (d) => ({
      ...d,
      id: d.id || d.clientId || d.userId || d.taskId || d.projectId,
    }),
  };

  const normalizer = normalizers[type] || normalizers.generic;
  return normalizer(data);
}

/**
 * Normaliza un array de entidades.
 */
export function normalizeEntities(data, type = 'generic') {
  if (!Array.isArray(data)) return [];
  return data.map((item) => normalizeEntity(item, type)).filter(Boolean);
}
