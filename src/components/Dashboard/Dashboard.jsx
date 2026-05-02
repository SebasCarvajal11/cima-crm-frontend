import React, { useState, useCallback, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Drawer, IconButton } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';

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
import { ROUTES, ROLES, UI } from '../../constants';

const menuItems = {
  [ROLES.ADMIN]: [
    { id: 'adminDashboard', icon: 'fas fa-home', label: UI.NAVIGATION.HOME },
    { id: 'excelImport', icon: 'fas fa-file-excel', label: UI.NAVIGATION.DOCUMENTS },
    { id: 'projectStatus', icon: 'fas fa-chart-line', label: UI.NAVIGATION.PROJECT_STATUS },
    { id: 'customerSupport', icon: 'fas fa-headset', label: UI.NAVIGATION.SUPPORT },
    { id: 'faqAdmin', icon: 'fas fa-question-circle', label: UI.NAVIGATION.MANAGE_FAQS },
  ],
  [ROLES.WORKER]: [
    { id: 'workerProjects', icon: 'fas fa-project-diagram', label: UI.NAVIGATION.PROJECTS },
  ],
  [ROLES.CLIENT]: [
    { id: 'clientProjects', icon: 'fas fa-project-diagram', label: UI.NAVIGATION.MY_PROJECTS },
    { id: 'customerSupport', icon: 'fas fa-headset', label: UI.NAVIGATION.CUSTOMER_SUPPORT },
    { id: 'faqClient', icon: 'fas fa-question-circle', label: UI.NAVIGATION.FAQ },
  ],
};

const SidebarContent = ({ user, activeView, onNavigate, onLogout }) => (
  <div className="flex flex-col h-full bg-gray-950 text-white p-4 md:p-6">
    <div className="text-center mb-6 md:mb-8">
      <h2 className="mb-1 text-xl md:text-2xl font-bold tracking-tight">{user.name}</h2>
      <p className="text-gray-400 text-xs md:text-sm font-medium">
        {user.role === ROLES.ADMIN ? 'Administrador' : user.role}
      </p>
    </div>

    <ul className="flex flex-col gap-1.5 flex-grow">
      {(menuItems[user.role] || []).map((item) => (
        <li
          key={item.id}
          className={`py-2.5 px-4 rounded-lg cursor-pointer flex items-center transition-all duration-300 hover:bg-red-900 hover:translate-x-1 ${
            activeView === item.id ? 'bg-red-900/50 border-l-2 border-white' : ''
          }`}
          onClick={() => onNavigate(item.id)}
        >
          <i className={`${item.icon} mr-3 text-lg w-6 text-center`} />
          <span className="text-sm font-medium">{item.label}</span>
        </li>
      ))}
    </ul>

    <li
      className="py-2.5 px-4 rounded-lg cursor-pointer flex items-center transition-all duration-300 hover:bg-red-700 list-none mt-auto"
      onClick={onLogout}
    >
      <i className="fas fa-sign-out-alt mr-3 text-lg w-6 text-center" />
      <span className="text-sm font-medium">Cerrar Sesión</span>
    </li>
  </div>
);

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('adminDashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!user || !user.role) {
    return <p>Acceso no autorizado</p>;
  }

  const changeView = useCallback((view) => {
    setActiveView(view);
    setDrawerOpen(false);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col shrink-0 shadow-xl z-10">
        <SidebarContent
          user={user}
          activeView={activeView}
          onNavigate={changeView}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: '16rem', backgroundColor: 'transparent', boxShadow: 'none' },
        }}
        className="md:hidden"
      >
        <div className="relative w-64 h-full">
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{ position: 'absolute', right: '0.5rem', top: '0.5rem', color: 'white', zIndex: 10 }}
          >
            <CloseIcon />
          </IconButton>
          <SidebarContent
            user={user}
            activeView={activeView}
            onNavigate={changeView}
            onLogout={handleLogout}
          />
        </div>
      </Drawer>

      {/* Main content */}
      <main className="flex-grow flex flex-col h-full overflow-hidden">
        <header className="bg-gray-900 text-white p-4 flex items-center shadow-md shrink-0">
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{ color: 'white', display: { md: 'none' }, mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <span className="text-sm font-medium">
            {menuItems[user.role]?.find((m) => m.id === activeView)?.label || 'Dashboard'}
          </span>
        </header>

        <section className="fluid-padding flex-grow overflow-y-auto bg-gray-100">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-full p-8 text-gray-500 font-medium">
                Cargando panel...
              </div>
            }
          >
            {activeView === 'adminDashboard' && user.role === ROLES.ADMIN ? <AdminDashboard /> : null}
            {activeView === 'excelImport' ? <ExcelImport /> : null}
            {activeView === 'excelExport' ? <ExcelExport /> : null}
            {activeView === 'projectStatus' || activeView.startsWith('project-status/') ? (
              <ProjectStatus
                userRole={user.role}
                projectId={activeView.startsWith('project-status/') ? activeView.split('/')[1] : null}
              />
            ) : null}
            {activeView === 'customerSupport' ? <CustomerSupport /> : null}
            {activeView === 'clientProjects' && user.role === ROLES.CLIENT ? (
              <ClientProjects onChangeView={changeView} />
            ) : null}
            {activeView === 'faqClient' && user.role === ROLES.CLIENT ? <FaqClient /> : null}
            {activeView === 'workerProjects' && user.role === ROLES.WORKER ? <WorkerProjects /> : null}
            {activeView === 'workerTasks' && user.role === ROLES.WORKER ? <WorkerTasks /> : null}
            {activeView === 'faqAdmin' && user.role === ROLES.ADMIN ? <FaqAdmin /> : null}
          </Suspense>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
