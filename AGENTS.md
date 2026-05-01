# CIMA CRM Frontend - Guía para Agentes (AGENTS.md)

Este documento contiene el contexto completo y las pautas arquitectónicas del frontend de CIMA CRM. Cualquier agente de IA que trabaje en este proyecto **DEBE leer este documento primero** para comprender las convenciones, estructura y mejores prácticas establecidas.

## 1. Visión General del Proyecto
CIMA CRM es una plataforma de gestión de relaciones con clientes, enfocada en la administración de usuarios, proyectos, clientes y tareas. Está diseñado con roles bien definidos (`Admin`, `Worker`, `Client`).
- **Framework:** React 18 (con Vite)
- **Lenguaje:** JavaScript (ES6+)
- **Estilos:** Material-UI (MUI) v6 como sistema principal de UI, complementado con Tailwind CSS y Emotion/styled-components.
- **Enrutamiento:** React Router DOM v6 con carga diferida (Lazy Loading) y protección de rutas.
- **Gestión de Estado Centralizada:** Redux Toolkit (para Autenticación) + Context API (para flujos de dominio como Proyectos).
- **Peticiones HTTP:** Axios con interceptores.

## 2. Estructura de Directorios Principal
- `/src/components`: Organizado por Dominios de negocio (ej. `/Auth`, `/Client`, `/Project`, `/Dashboard`, `/Roles`).
- `/src/context`: Proveedores de estado a nivel de dominio (ej. `ProjectContext.jsx`).
- `/src/redux`: Almacenamiento global para autenticación (`store.js`, `/slices`).
- `/src/routes`: Configuración de protección de rutas (`ProtectedRoute.jsx`).

## 3. Pautas Arquitectónicas y Patrones de Diseño (CRÍTICO)

### 3.1. Patrones de Composición (Vercel Patterns)
Hemos refactorizado los componentes monolíticos y formularios complejos utilizando **patrones de composición avanzados**.
- **EVITA los componentes monolíticos:** No crees un solo componente gigante (como un formulario) que reciba decenas de props booleanas (ej. `isEdit={true}`).
- **Usa Variantes Explícitas:** Si un componente tiene múltiples modos (ej. Crear vs. Editar), crea componentes envolventes explícitos (ej. `CreateProjectDialog` y `EditProjectDialog`) que configuren el estado base y llamen a un componente compuesto genérico.
- **Compound Components & Context:** Utiliza un Provider local para compartir el estado del componente entre sus partes.
  *Ejemplo:* `ProjectForm.Dialog`, `ProjectForm.Header`, `ProjectForm.Content`. Todos consumen un `useProjectFormContext()` provisto por un `ProjectFormProvider`. Esto elimina la propagación de props (prop drilling) y aumenta la modularidad.

### 3.2. Gestión del Estado
- **Redux:** ÚSALO ÚNICAMENTE para el estado global transversal que rara vez cambia, principalmente **Autenticación** (usuario, token, roles).
- **React Context:** ÚSALO para gestionar el estado de un módulo o dominio completo. Ejemplo: `ProjectContext` maneja la lista global de proyectos en memoria, filtros y llamadas API CRUD, evitando volver a consultar la API innecesariamente.
- **Estado Local / Provider Local:** ÚSALO para flujos efímeros, como el llenado de un formulario o el estado visual de un modal.

### 3.3. Peticiones a la API
- La URL base de la API se inyecta desde las variables de entorno como `import.meta.env.VITE_API_URL`.
- El token de autenticación se gestiona desde Redux o `localStorage` y se envía usando el header `'accesstoken'` o `'Authorization': 'Bearer ...'` a través de los interceptores de Axios configurados en los contextos o globalmente.

## 4. Instrucciones para Agentes (Agentic Instructions)

1. **NO rompas la UI actual:** El sistema usa componentes construidos sobre `@mui/material`. Si necesitas modificar una vista, utiliza la misma librería (MUI) o sus componentes base (`Box`, `Typography`, `Grid`, `Button`). No mezcles librerías de componentes sin justificación.
2. **Prioriza "view_file" y "grep_search":** Antes de modificar la funcionalidad de un dominio, examina cómo funcionan los demás. Utiliza `grep_search` para ver dónde se utiliza una función y analiza dependencias.
3. **Manejo de Errores Silenciosos:** Los componentes como formularios condicionales dependen de que los objetos se mapeen correctamente (ej. el mapeo entre la respuesta de la API `client.id` vs `client.clientId`). **Siempre usa fallbacks robustos** al procesar la respuesta del backend (`data.clientId || data.id`).
4. **Respeta los Archivos CLAUDE.md y .agents/skills:** Ya existen reglas definidas para herramientas de IA (en el archivo `CLAUDE.md` de la raíz, y en el directorio `.agents/skills`). Respétalas y combínalas con esta guía arquitectónica.
5. **Logs y Debugging:** No dejes sentencias inútiles de `console.log()` en el código de producción. Si haces debug durante tu ejecución, limpia el código al finalizar.

## 5. Glosario Rápido del Proyecto
- **CIMA CRM:** Nombre del proyecto.
- **ProjectsPage:** Listado y administración principal de proyectos (usa `ProjectContext`).
- **ProjectForm (Compound):** Sistema de formularios modulares refactorizados para crear/editar proyectos.
- **UserManagement / RoleManagement:** Vistas para el panel de administración basadas en `selectedView` o en rutas explícitas dentro de `App.jsx`.

---
*Este archivo está diseñado para ser procesado por LLMs que operan de forma autónoma en la base de código. Si eres un agente y has leído esto, asegúrate de adherirte firmemente a estas instrucciones en cada step.*
