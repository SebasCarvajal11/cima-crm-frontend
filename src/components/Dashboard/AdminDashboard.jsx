import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Card, CardContent, Typography, Grid, Button } from "@mui/material";
 
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import SecurityIcon from "@mui/icons-material/Security";
import UserManagement from "../Client/UserManagement";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProjectsPage from "../Project/pages/ProjectsPage";
import { ProjectContext, ProjectProvider } from "../../context/ProjectContext";
import TaskList from "../TaskTable/TaskList";
import TaskManagement from "../TaskManagement/TaskManagement";

const AdminDashboard = () => {
  // Estado para controlar la vista seleccionada:
  // "dashboard" (vista principal) o "clients" (gestión de clientes)
  const [selectedView, setSelectedView] = useState("dashboard");

  return (
    <div className="p-6 md:p-10 min-h-[calc(100vh-80px)] bg-transparent text-center">
      {selectedView === "dashboard" && (
        <div className="flex flex-col items-center max-w-6xl mx-auto w-full">
          <div className="mb-12 text-center flex flex-col items-center">
            <Typography 
              variant="h3" 
              className="text-3xl md:text-4xl font-extrabold text-brand-primary mb-3"
              sx={{ fontWeight: 800 }}
            >
              Panel de Administración
            </Typography>
            <div className="w-20 h-1.5 bg-gradient-to-r from-brand-secondary to-brand-secondary-light rounded-full"></div>
          </div>
          
          <Grid container spacing={4} justifyContent="center" className="w-full">
            {/* Crear Cliente / Proyectos */}
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                onClick={() => setSelectedView("createClient")}
                className="h-full cursor-pointer rounded-2xl bg-white border border-gray-100 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] shadow-sm"
              >
                <CardContent className="p-8 h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6 shadow-inner border border-gray-100">
                    <PersonAddIcon sx={{ fontSize: 32, color: 'var(--color-brand-primary)' }} />
                  </div>
                  <Typography variant="h6" className="font-bold text-gray-800 text-xl mb-3" sx={{ fontWeight: 700 }}>
                    Gestión De Proyectos
                  </Typography>
                  <Typography variant="body2" className="text-gray-500 leading-relaxed">
                    Agrega y administra nuevos proyectos en el sistema
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Gestionar Clientes */}
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                onClick={() => setSelectedView("clients")}
                className="h-full cursor-pointer rounded-2xl bg-white border border-gray-100 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] shadow-sm"
              >
                <CardContent className="p-8 h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6 shadow-inner border border-gray-100">
                    <GroupIcon sx={{ fontSize: 32, color: 'var(--color-brand-primary)' }} />
                  </div>
                  <Typography variant="h6" className="font-bold text-gray-800 text-xl mb-3" sx={{ fontWeight: 700 }}>
                    Gestionar Clientes
                  </Typography>
                  <Typography variant="body2" className="text-gray-500 leading-relaxed">
                    Administra la información de los clientes de manera eficiente
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Gestionar Tareas */}
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                onClick={() => setSelectedView("roles")}
                className="h-full cursor-pointer rounded-2xl bg-white border border-gray-100 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] shadow-sm"
              >
                <CardContent className="p-8 h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6 shadow-inner border border-gray-100">
                    <SecurityIcon sx={{ fontSize: 32, color: 'var(--color-brand-primary)' }} />
                  </div>
                  <Typography variant="h6" className="font-bold text-gray-800 text-xl mb-3" sx={{ fontWeight: 700 }}>
                    Gestionar Tareas
                  </Typography>
                  <Typography variant="body2" className="text-gray-500 leading-relaxed">
                    Asigna roles, administra permisos y gestiona tareas
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      )}

      {selectedView !== "dashboard" && (
        <Box className="mb-6 flex justify-start">
          <Button
            variant="contained"
            onClick={() => setSelectedView("dashboard")}
            startIcon={<ArrowBackIcon />}
            className="bg-black text-white px-6 py-2.5 rounded-lg normal-case font-semibold transition-colors hover:bg-gray-800 shadow-md"
          >
            Volver al Dashboard
          </Button>
        </Box>
      )}

      {selectedView === "clients" && (
        <>
          <UserManagement />
        </>
      )}

      {selectedView === "createClient" && (
        <>
          <ProjectProvider>
            <ProjectsPage />
          </ProjectProvider>
        </>
      )}

      {selectedView === "roles" && (
        <>
          <Typography variant="h5" className="mt-4 mb-8 font-bold text-gray-800">
            Gestión de Tareas
          </Typography>
          <TaskManagement />
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
