import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Grid, Button, Fade } from "@mui/material";
import { 
  PersonAdd as PersonAddIcon, 
  Group as GroupIcon, 
  Security as SecurityIcon,
  ArrowBack as ArrowBackIcon,
  Assignment as ProjectIcon,
  TaskAlt as TaskIcon,
} from "@mui/icons-material";
import UserManagement from "../Client/UserManagement";
import ProjectsPage from "../Project/pages/ProjectsPage";
import { ProjectProvider } from "../../context/ProjectContext";
import TaskManagement from "../TaskManagement/TaskManagement";
import { cn } from "../../utils/cn";

const AdminDashboard = () => {
  const [selectedView, setSelectedView] = useState("dashboard");

  const menuItems = [
    {
      id: "createClient",
      title: "Gestión De Proyectos",
      description: "Agrega y administra nuevos proyectos en el sistema de manera centralizada.",
      icon: <ProjectIcon className="text-3xl text-brand-primary" />,
      gradient: "from-blue-50 to-indigo-50"
    },
    {
      id: "clients",
      title: "Gestionar Clientes",
      description: "Administra la información de los clientes y usuarios staff de manera eficiente.",
      icon: <GroupIcon className="text-3xl text-brand-primary" />,
      gradient: "from-purple-50 to-pink-50"
    },
    {
      id: "roles",
      title: "Gestionar Tareas",
      description: "Supervisa, asigna y gestiona el progreso de todas las tareas del equipo.",
      icon: <TaskIcon className="text-3xl text-brand-primary" />,
      gradient: "from-orange-50 to-amber-50"
    }
  ];

  return (
    <div className="p-4 md:p-10 min-h-screen bg-transparent">
      {selectedView === "dashboard" && (
        <Fade in timeout={500}>
          <div className="flex flex-col items-center max-w-6xl mx-auto w-full">
            <header className="mb-8 text-center">
              <Typography 
                variant="h3" 
                className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight"
              >
                Panel de <span className="text-brand-primary">Administración</span>
              </Typography>
              <Box className="flex justify-center">
                <div className="w-24 h-1.5 bg-brand-primary rounded-full shadow-sm"></div>
              </Box>
              <Typography variant="body1" className="text-gray-500 mt-6 max-w-2xl mx-auto font-medium">
                Bienvenido al centro de control. Desde aquí puedes gestionar proyectos, clientes y tareas de manera integral.
              </Typography>
            </header>
            
            <Grid container spacing={4} justifyContent="center" className="w-full">
              {menuItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card 
                    onClick={() => setSelectedView(item.id)}
                    className="h-full cursor-pointer rounded-3xl bg-white border border-gray-100 transition-all duration-500 ease-out hover:-translate-y-3 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] shadow-sm overflow-hidden group"
                  >
                    <CardContent className="fluid-padding-lg h-full flex flex-col items-center text-center relative">
                      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500', item.gradient)}></div>
                      
                      <div className="relative z-10">
                        <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 shadow-inner border border-gray-100 group-hover:bg-white group-hover:scale-110 transition-all duration-500">
                          {item.icon}
                        </div>
                        <Typography variant="h5" className="font-bold text-gray-800 mb-4 tracking-tight">
                          {item.title}
                        </Typography>
                        <Typography variant="body2" className="text-gray-500 leading-relaxed font-medium">
                          {item.description}
                        </Typography>
                        
                        <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                          <Button 
                            variant="text" 
                            className="text-brand-primary font-bold normal-case flex items-center gap-2 mx-auto"
                          >
                            Acceder ahora <ArrowBackIcon className="rotate-180 text-sm" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </Fade>
      )}

      {selectedView !== "dashboard" && (
        <Fade in timeout={300}>
          <Box className="w-full">
            <Box className="mb-8 flex justify-start items-center gap-4">
              <Button
                variant="contained"
                onClick={() => setSelectedView("dashboard")}
                startIcon={<ArrowBackIcon />}
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-2xl normal-case font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Volver al Panel
              </Button>
              <Typography variant="h5" className="font-bold text-gray-800 ml-4 border-l-4 border-brand-primary pl-4">
                {menuItems.find(i => i.id === selectedView)?.title}
              </Typography>
            </Box>

            <Box className="bg-white rounded-3xl shadow-sm border border-gray-100 p-2 md:p-6 overflow-hidden">
              {selectedView === "clients" && <UserManagement />}

              {selectedView === "createClient" && (
                <ProjectProvider>
                  <ProjectsPage />
                </ProjectProvider>
              )}

              {selectedView === "roles" && (
                <Box className="animate-in fade-in duration-500">
                  <TaskManagement />
                </Box>
              )}
            </Box>
          </Box>
        </Fade>
      )}
    </div>
  );
};

export default AdminDashboard;
