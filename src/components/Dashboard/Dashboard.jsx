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
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden font-sans">
      <aside className="w-full md:w-64 bg-[#0a0a0a] text-white p-4 md:p-6 flex flex-col shrink-0 shadow-xl z-10">
        <div className="hidden md:block text-center mb-8">
          <h2 className="mb-1 text-2xl font-bold tracking-tight">{user.name}</h2>
          <p className="text-gray-400 text-sm font-medium">{user.role === 'Admin' ? 'Administrador' : user.role}</p>
        </div>
        
        {/* On mobile, this menu becomes a horizontal scrolling row. On desktop, a vertical list */}
        <ul className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1.5 pb-2 md:pb-0 flex-grow scrollbar-hide mt-6">
          {user.role === 'Admin' && (
            <>
              <li className="flex-shrink-0 md:flex-shrink py-2.5 px-4 rounded-lg cursor-pointer flex flex-row items-center transition-all duration-300 hover:bg-[#910000] hover:translate-x-1" onClick={() => changeView('adminDashboard')}><i className="fas fa-home mr-3 text-lg w-6 text-center"></i> <span className="text-sm font-medium whitespace-nowrap">Inicio</span></li>
              <li className="flex-shrink-0 md:flex-shrink py-2.5 px-4 rounded-lg cursor-pointer flex flex-row items-center transition-all duration-300 hover:bg-[#910000] hover:translate-x-1" onClick={() => changeView('excelImport')}><i className="fas fa-file-excel mr-3 text-lg w-6 text-center"></i> <span className="text-sm font-medium whitespace-nowrap">Documentos</span></li>
              <li className="flex-shrink-0 md:flex-shrink py-2.5 px-4 rounded-lg cursor-pointer flex flex-row items-center transition-all duration-300 hover:bg-[#910000] hover:translate-x-1" onClick={() => changeView('projectStatus')}><i className="fas fa-chart-line mr-3 text-lg w-6 text-center"></i> <span className="text-sm font-medium whitespace-nowrap">Estado del Proyecto</span></li>
              <li className="flex-shrink-0 md:flex-shrink py-2.5 px-4 rounded-lg cursor-pointer flex flex-row items-center transition-all duration-300 hover:bg-[#910000] hover:translate-x-1" onClick={() => changeView('customerSupport')}><i className="fas fa-headset mr-3 text-lg w-6 text-center"></i> <span className="text-sm font-medium whitespace-nowrap">Soporte</span></li>
              <li className="flex-shrink-0 md:flex-shrink py-2.5 px-4 rounded-lg cursor-pointer flex flex-row items-center transition-all duration-300 hover:bg-[#910000] hover:translate-x-1" onClick={() => changeView('faqAdmin')}><i className="fas fa-question-circle mr-3 text-lg w-6 text-center"></i> <span className="text-sm font-medium whitespace-nowrap">Gestionar FAQs</span></li>
            </>
          )}
          {user.role === 'Worker' && (
            <>
              <li className="flex-shrink-0 md:flex-shrink py-2.5 px-4 rounded-lg cursor-pointer flex flex-row items-center transition-all duration-300 hover:bg-[#910000] hover:translate-x-1" onClick={() => changeView('workerProjects')}><i className="fas fa-project-diagram mr-3 text-lg w-6 text-center"></i> <span className="text-sm font-medium whitespace-nowrap">Proyectos</span></li>
            </>
          )}
          {user.role === 'Client' && (
            <>
              <li className="flex-shrink-0 md:flex-shrink py-2.5 px-4 rounded-lg cursor-pointer flex flex-row items-center transition-all duration-300 hover:bg-[#910000] hover:translate-x-1" onClick={() => changeView('clientProjects')}><i className="fas fa-project-diagram mr-3 text-lg w-6 text-center"></i> <span className="text-sm font-medium whitespace-nowrap">Mis Proyectos</span></li>
              <li className="flex-shrink-0 md:flex-shrink py-2.5 px-4 rounded-lg cursor-pointer flex flex-row items-center transition-all duration-300 hover:bg-[#910000] hover:translate-x-1" onClick={() => changeView('customerSupport')}><i className="fas fa-headset mr-3 text-lg w-6 text-center"></i> <span className="text-sm font-medium whitespace-nowrap">Soporte al Cliente</span></li>
              <li className="flex-shrink-0 md:flex-shrink py-2.5 px-4 rounded-lg cursor-pointer flex flex-row items-center transition-all duration-300 hover:bg-[#910000] hover:translate-x-1" onClick={() => changeView('faqClient')}><i className="fas fa-question-circle mr-3 text-lg w-6 text-center"></i> <span className="text-sm font-medium whitespace-nowrap">Preguntas Frecuentes</span></li>
            </>
          )}
          <li className="flex-shrink-0 md:flex-shrink py-2.5 px-4 mt-auto rounded-lg cursor-pointer flex flex-row items-center transition-all duration-300 hover:bg-red-700 hover:translate-x-1" onClick={handleLogout}><i className="fas fa-sign-out-alt mr-3 text-lg w-6 text-center"></i> <span className="text-sm font-medium whitespace-nowrap">Cerrar Sesión</span></li>
        </ul>
      </aside>

      <main className="flex-grow flex flex-col h-full overflow-hidden">
        <header className="bg-black text-white p-4 md:p-5 text-center shadow-md shrink-0">
          {/* Vacío por ahora, pero mantiene el espacio */}
        </header>

        <section className="p-4 md:p-8 flex-grow overflow-y-auto bg-gray-100">
          <Suspense fallback={<div className="flex justify-center items-center h-full p-8 text-gray-500 font-medium">Cargando panel...</div>}>
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
