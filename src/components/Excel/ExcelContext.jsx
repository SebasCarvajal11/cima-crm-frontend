import { createContext, useContext, useState, useMemo } from 'react';
import {
  useGetProjectsQuery,
  useGetFilesByProjectQuery,
  useLazyDownloadFileQuery,
  useUploadFileMutation,
  useDeleteFileMutation,
} from '../../redux/api';

const ExcelContext = createContext();

export const useExcelContext = () => {
  const context = useContext(ExcelContext);
  if (!context) {
    throw new Error('useExcelContext debe ser usado dentro de un ExcelProvider');
  }
  return context;
};

export const ExcelProvider = ({ children, initialProjectId }) => {
  const [selectedProject, setSelectedProject] = useState(initialProjectId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, fileId: null });

  const { data: projects = [] } = useGetProjectsQuery();
  const { data: files = [] } = useGetFilesByProjectQuery(selectedProject, {
    skip: !selectedProject,
  });
  const [triggerDownload] = useLazyDownloadFileQuery();
  const [uploadFile] = useUploadFileMutation();
  const [deleteFile] = useDeleteFileMutation();

  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  };

  const handleDownload = async (fileId) => {
    if (!fileId) return setError('ID de archivo no válido');

    try {
      setLoading(true);
      const blob = await triggerDownload(fileId).unwrap();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `archivo-${fileId}`);

      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      setSuccess('Archivo descargado correctamente');
    } catch (err) {
      setError(`Error al descargar archivo: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!fileId) return setError('ID de archivo no válido');

    try {
      setLoading(true);
      await deleteFile(fileId).unwrap();
      setSuccess('Archivo eliminado correctamente');
      setConfirmDelete({ open: false, fileId: null });
    } catch (err) {
      setError(`Error al eliminar archivo: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    if (!selectedProject) return setError('Por favor seleccione un proyecto primero');

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await uploadFile({
        projectId: selectedProject,
        file,
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(Math.round(progress));
        }
      }).unwrap();
      setSuccess('Archivo subido exitosamente');
    } catch (err) {
      setError(`Error al subir el archivo: ${err.message || err}`);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const value = useMemo(() => ({
    state: {
      projects,
      selectedProject,
      files,
      loading,
      error,
      success,
      uploadProgress,
      confirmDelete,
    },
    actions: {
      handleProjectChange,
      handleDownload,
      handleDelete,
      handleUpload,
      setConfirmDelete,
      setError,
      setSuccess,
    },
  }), [projects, selectedProject, files, loading, error, success, uploadProgress, confirmDelete]);

  return <ExcelContext.Provider value={value}>{children}</ExcelContext.Provider>;
};
