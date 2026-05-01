import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import logger from '../../utils/logger';

// 1. Crear el contexto (State Interface)
const ExcelContext = createContext();

export const useExcelContext = () => {
  const context = useContext(ExcelContext);
  if (!context) {
    throw new Error('useExcelContext debe ser usado dentro de un ExcelProvider');
  }
  return context;
};

// 2. Crear el Provider (State Decoupling)
export const ExcelProvider = ({ children, initialProjectId }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(initialProjectId || '');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, fileId: null });

  const fetchProjects = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/projects`,
        { headers: { 'accesstoken': token } }
      );
      setProjects(response.data.projects || []);
    } catch (err) {
      logger.error('Projects fetch error:', err);
      setError('Error al cargar los proyectos');
      setProjects([]);
    }
  }, []);

  const fetchFiles = useCallback(async (projectId) => {
    if (!projectId) return;
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('No hay sesión activa');
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/files/project/${projectId}`,
        { headers: { 'accesstoken': token } }
      );
      setFiles(response.data.files || []);
    } catch (err) {
      setError('Error al cargar los archivos');
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (selectedProject) {
      fetchFiles(selectedProject);
    } else {
      setFiles([]);
    }
  }, [selectedProject, fetchFiles]);

  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  };

  const handleDownload = async (fileId) => {
    if (!fileId) return setError('ID de archivo no válido');
    const token = localStorage.getItem('accessToken');
    if (!token) return setError('No hay sesión activa');

    try {
      setLoading(true);
      const response = await axios({
        method: 'get',
        url: `${import.meta.env.VITE_API_URL}/files/download/${fileId}`,
        headers: { 'accesstoken': token },
      });
      
      const { fileName, mimeType } = response.data.fileData;
      const byteCharacters = atob(response.data.fileData.base64Content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      setSuccess('Archivo descargado correctamente');
    } catch (err) {
      setError(`Error al descargar archivo: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!fileId) return setError('ID de archivo no válido');
    const token = localStorage.getItem('accessToken');
    if (!token) return setError('No hay sesión activa');

    try {
      setLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/files/${fileId}`,
        { headers: { 'accesstoken': token } }
      );
      setFiles(files.filter(file => file.fileId !== fileId));
      setSuccess('Archivo eliminado correctamente');
      setConfirmDelete({ open: false, fileId: null });
    } catch (err) {
      setError(`Error al eliminar archivo: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    if (!selectedProject) return setError('Por favor seleccione un proyecto primero');
    const token = localStorage.getItem('accessToken');
    if (!token) return setError('No hay sesión activa');

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/files/${selectedProject}`,
        formData,
        {
          headers: {
            'accesstoken': token,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress(Math.round(progress));
          }
        }
      );
      setSuccess('Archivo subido exitosamente');
      fetchFiles(selectedProject);
    } catch (err) {
      setError(`Error al subir el archivo: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // 3. Exponer la Interfaz de Estado
  const value = {
    state: {
      projects,
      selectedProject,
      files,
      loading,
      error,
      success,
      uploadProgress,
      confirmDelete
    },
    actions: {
      handleProjectChange,
      handleDownload,
      handleDelete,
      handleUpload,
      setConfirmDelete,
      setError,
      setSuccess
    }
  };

  return <ExcelContext.Provider value={value}>{children}</ExcelContext.Provider>;
};
