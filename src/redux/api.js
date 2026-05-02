import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTH, ENDPOINTS } from '../constants';
import api from '../services/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem(AUTH.STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        headers.set(AUTH.HEADER_NAME, token);
      }
      return headers;
    },
  }),
  tagTypes: ['Client', 'Project', 'Task', 'User', 'Faq', 'File'],
  endpoints: (builder) => ({
    // ──── FAQ ────
    getAllFaqs: builder.query({
      query: () => ENDPOINTS.FAQS.ALL,
      providesTags: ['Faq'],
      transformResponse: (response) => response.faqs || [],
    }),
    createFaq: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.FAQS.BASE,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Faq'],
      transformResponse: (response) => response.faq,
    }),
    updateFaq: builder.mutation({
      query: ({ id, ...body }) => ({
        url: ENDPOINTS.FAQS.byId(id),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Faq'],
      transformResponse: (response) => response.faq,
    }),
    deleteFaq: builder.mutation({
      query: (id) => ({
        url: ENDPOINTS.FAQS.byId(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Faq'],
    }),

    // ──── CLIENTS ────
    getClients: builder.query({
      query: () => ENDPOINTS.CLIENTS.BASE,
      providesTags: ['Client'],
      transformResponse: (response) => response.clients || [],
    }),
    getClientById: builder.query({
      query: (id) => ENDPOINTS.CLIENTS.byId(id),
      providesTags: (result, error, id) => [{ type: 'Client', id }],
    }),
    createClient: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.CLIENTS.REGISTER,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Client'],
    }),
    updateClient: builder.mutation({
      query: ({ id, ...body }) => ({
        url: ENDPOINTS.CLIENTS.byId(id),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Client'],
    }),
    deleteClient: builder.mutation({
      query: (id) => ({
        url: ENDPOINTS.CLIENTS.byId(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Client'],
    }),

    // ──── USERS ────
    getUsers: builder.query({
      query: () => ENDPOINTS.USERS.BASE,
      providesTags: ['User'],
      transformResponse: (response) => response.users || response || [],
    }),
    getStaff: builder.query({
      query: () => ENDPOINTS.USERS.STAFF,
      providesTags: ['User'],
      transformResponse: (response) => response.users || response || [],
    }),
    getWorkers: builder.query({
      query: () => ENDPOINTS.USERS.WORKERS,
      providesTags: ['User'],
      transformResponse: (response) => response.workers || response || [],
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.USERS.REGISTER,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: ENDPOINTS.USERS.byId(id),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: ENDPOINTS.USERS.byId(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // ──── PROJECTS ────
    getProjects: builder.query({
      query: (params) => ({
        url: ENDPOINTS.PROJECTS.BASE,
        params,
      }),
      providesTags: ['Project'],
      transformResponse: (response) => response.projects || response || [],
    }),
    getProjectStats: builder.query({
      query: () => ENDPOINTS.PROJECTS.STATS,
      providesTags: ['Project'],
    }),
    getProjectById: builder.query({
      query: (id) => ENDPOINTS.PROJECTS.byId(id),
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),
    getMyProjects: builder.query({
      query: () => ENDPOINTS.PROJECTS.MY_PROJECTS,
      providesTags: ['Project'],
      transformResponse: (response) => response.projects || response || [],
    }),
    getWorkerProjects: builder.query({
      query: () => ENDPOINTS.PROJECTS.WORKER_PROJECTS,
      providesTags: ['Project'],
      transformResponse: (response) => response.projects || response || [],
    }),
    getProjectsByClient: builder.query({
      query: (clientId) => ENDPOINTS.PROJECTS.byClient(clientId),
      providesTags: (result, error, clientId) => [{ type: 'Project', clientId }],
      transformResponse: (response) => response.projects || response || [],
    }),
    getProjectClients: builder.query({
      query: () => ENDPOINTS.PROJECTS.CLIENTS,
      providesTags: ['Project'],
      transformResponse: (response) => response.clients || response || [],
    }),
    createProject: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.PROJECTS.BASE,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...body }) => ({
        url: ENDPOINTS.PROJECTS.byId(id),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Project'],
    }),
    updateProjectStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${ENDPOINTS.PROJECTS.byId(id)}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Project'],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: ENDPOINTS.PROJECTS.byId(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),

    // ──── TASKS ────
    getTasks: builder.query({
      query: (params) => ({
        url: ENDPOINTS.TASKS.BASE,
        params,
      }),
      providesTags: ['Task'],
      transformResponse: (response) => response.tasks || response || [],
    }),
    getTaskStats: builder.query({
      query: () => ENDPOINTS.TASKS.STATS,
      providesTags: ['Task'],
    }),
    getTaskById: builder.query({
      query: (id) => ENDPOINTS.TASKS.byId(id),
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),
    createTask: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.TASKS.BASE,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...body }) => ({
        url: ENDPOINTS.TASKS.byId(id),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTaskStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: ENDPOINTS.TASKS.status(id),
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: ENDPOINTS.TASKS.byId(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
    bulkUpdateTaskStatus: builder.mutation({
      query: ({ taskIds, status }) => ({
        url: ENDPOINTS.TASKS.BULK_UPDATE,
        method: 'POST',
        body: { taskIds, status },
      }),
      invalidatesTags: ['Task'],
    }),
    bulkAssignTasks: builder.mutation({
      query: ({ taskIds, workerId }) => ({
        url: ENDPOINTS.TASKS.BULK_ASSIGN,
        method: 'POST',
        body: { taskIds, workerId },
      }),
      invalidatesTags: ['Task'],
    }),

    // ──── FILES ────
    getFilesByProject: builder.query({
      query: (projectId) => ENDPOINTS.FILES.byProject(projectId),
      providesTags: ['File'],
      transformResponse: (response) => response.files || response || [],
    }),
    downloadFile: builder.query({
      query: (fileId) => ({
        url: ENDPOINTS.FILES.download(fileId),
        responseHandler: (response) => response.blob(),
      }),
    }),
    uploadFile: builder.mutation({
      async queryFn({ projectId, file, onUploadProgress }) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const response = await api.post(`/files/${projectId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress,
          });
          return { data: response.data };
        } catch (error) {
          return { error: { status: error.response?.status, data: error.response?.data || error.message } };
        }
      },
      invalidatesTags: ['File'],
    }),
    deleteFile: builder.mutation({
      query: (fileId) => ({
        url: ENDPOINTS.FILES.byId(fileId),
        method: 'DELETE',
      }),
      invalidatesTags: ['File'],
    }),

    // ──── AUTH ────
    login: builder.mutation({
      query: (credentials) => ({
        url: ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        localStorage.setItem(AUTH.STORAGE_KEYS.USER, JSON.stringify(response.user));
        localStorage.setItem(AUTH.STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
        return response;
      },
    }),
  }),
});

export const {
  // FAQ
  useGetAllFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  // Clients
  useGetClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  // Users
  useGetUsersQuery,
  useGetStaffQuery,
  useGetWorkersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  // Projects
  useGetProjectsQuery,
  useGetProjectStatsQuery,
  useGetProjectByIdQuery,
  useGetMyProjectsQuery,
  useGetWorkerProjectsQuery,
  useGetProjectsByClientQuery,
  useGetProjectClientsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useUpdateProjectStatusMutation,
  useDeleteProjectMutation,
  // Tasks
  useGetTasksQuery,
  useGetTaskStatsQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useBulkUpdateTaskStatusMutation,
  useBulkAssignTasksMutation,
  // Files
  useGetFilesByProjectQuery,
  useDownloadFileQuery,
  useLazyDownloadFileQuery,
  useUploadFileMutation,
  useDeleteFileMutation,
  // Auth
  useLoginMutation,
} = apiSlice;
