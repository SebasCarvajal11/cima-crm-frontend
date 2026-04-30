import React, { useState, useCallback, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 

const WorkerDashboard = lazy(() => import('./WorkerDashboard'));
const ClientDashboard = lazy(() => import('./ClientDashboard'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const ExcelImport = lazy(() => import('../Excel/ExcelImport'));
const ExcelExport = lazy(() => import('../Excel/ExcelExport'));
const ProjectStatus = lazy(() => import('../ProjectStatus/ProjectStatus')); 
const CustomerSupport = lazy(() => import('../CustomerSupport/CustomerSupport'));
const ClientProjects = lazy(() => import('../ClientProjects/ClientProjects')); 
const WorkerProjects = lazy(() => import('../WorkerProjects/WorkerProjects'));  
const WorkerTasks = lazy(() => import('../WorkerTasks/WorkerTasks'));
const FaqClient = lazy(() => import('../FaqClient/FaqClient'));
const FaqAdmin = lazy(() => import('../FaqAdmin/FaqAdmin'));
import './Dashboard.css'; 
import { logout } from '../../redux/slices/authSlice';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Estado para manejar la vista activa
  const [activeView, setActiveView] = useState('adminDashboard'); // Vista por defecto

  if (!user || !user.role) {
    return <p>Acceso no autorizado</p>;
  }

  // Función para cambiar la vista activa
  const changeView = useCallback((view) => {
    setActiveView(view);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>{user.name}</h2>
          <p>{user.role === 'Admin' ? 'Administrador' : user.role}</p>
        </div>
        <ul className="sidebar-menu">
          {user.role === 'Admin' && (
            <>
              <li onClick={() => changeView('adminDashboard')}><i className="fas fa-home"></i> Inicio</li>
              <li onClick={() => changeView('excelImport')}><i className="fas fa-file-excel"></i> Gestor de Documentos              </li>
              <li onClick={() => changeView('projectStatus')}><i className="fas fa-chart-line"></i> Estado del Proyecto</li>
              <li onClick={() => changeView('customerSupport')}><i className="fas fa-headset"></i> Soporte</li>
              <li onClick={() => changeView('faqAdmin')}><i className="fas fa-question-circle"></i> Gestionar FAQs</li>
            </>
          )}
          {user.role === 'Worker' && (
            <>
              <li onClick={() => changeView('workerProjects')}><i className="fas fa-project-diagram"></i> Proyectos</li>
              
            </>
          )}
          
          {user.role === 'Client' && (
            <>
              <li onClick={() => changeView('clientProjects')}><i className="fas fa-project-diagram"></i> Mis Proyectos</li>
              <li onClick={() => changeView('customerSupport')}><i className="fas fa-headset"></i> Soporte al Cliente</li>
              <li onClick={() => changeView('faqClient')}><i className="fas fa-question-circle"></i> Preguntas Frecuentes</li>
            </>
          )}
          <li onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Cerrar Sesión</li>
        </ul>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
 
        </header>

        <section className="dashboard-content">
          <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>Cargando panel...</div>}>
            {activeView === 'adminDashboard' && user.role === 'Admin' && <AdminDashboard />}
            {activeView === 'excelImport' && <ExcelImport />}
            {activeView === 'excelExport' && <ExcelExport />}
            {(activeView === 'projectStatus' || activeView.startsWith('project-status/')) && (
              <ProjectStatus 
                userRole={user.role} 
                projectId={activeView.startsWith('project-status/') ? activeView.split('/')[1] : null}
              />
            )}
            {activeView === 'customerSupport' && <CustomerSupport />}
            {activeView === 'clientProjects' && user.role === 'Client' && (
              <ClientProjects onChangeView={changeView} />
            )}
            {activeView === 'faqClient' && user.role === 'Client' && <FaqClient />}
            {activeView === 'workerProjects' && user.role === 'Worker' && <WorkerProjects />}
            {activeView === 'workerTasks' && user.role === 'Worker' && <WorkerTasks />}
            {activeView === 'faqAdmin' && user.role === 'Admin' && <FaqAdmin />}
          </Suspense>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
