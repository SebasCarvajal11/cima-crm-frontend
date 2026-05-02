# CIMA CRM Frontend - Guia para Agentes

> Cualquier agente de IA que trabaje en este proyecto **DEBE leer este documento completo** antes de realizar cambios. Complementa con `CLAUDE.md` y los archivos en `.agents/skills/`.

---

## 1. Vision General

CIMA CRM es una plataforma de gestion de relaciones con clientes para la empresa CIMA. Administra **usuarios**, **proyectos**, **clientes** y **tareas** con tres roles diferenciados: `Admin`, `Worker`, `Client`.

### 1.1. Stack Tecnologico (versiones reales de package.json)

| Capa | Tecnologia | Version |
|------|-----------|---------|
| Framework | React | 18.3.x |
| Build | Vite | 5.4.x |
| Lenguaje | JavaScript (ES6+) | - |
| UI Components | Material-UI (`@mui/material`) | 6.4.x |
| Data Grid | `@mui/x-data-grid` | 7.26.x |
| CSS Utilities | Tailwind CSS (via `@tailwindcss/vite`) | 4.x |
| CSS-in-JS | Emotion (`@emotion/styled`) | 11.x |
| Enrutamiento | React Router DOM | 6.29.x |
| Estado global | Redux Toolkit (`@reduxjs/toolkit`) | 2.2.x |
| HTTP Client | Axios | 1.7.x |
| Animaciones | Framer Motion | 12.5.x |
| Notificaciones | react-toastify | 10.x |
| Iconos | `@mui/icons-material`, `react-icons`, `lucide-react` | Varias |
| Class Variants | `class-variance-authority` (CVA) | 0.7.x |
| Class Merge | `clsx` + `tailwind-merge` (via `cn()`) | 2.x + 2.x |

### 1.2. Variables de Entorno

| Variable | Proposito |
|----------|----------|
| `VITE_API_URL` | URL base del backend REST API. Todas las llamadas HTTP la usan como prefijo. |

### 1.3. Scripts

```bash
npm run dev      # Servidor de desarrollo (Vite HMR)
npm run build    # Build de produccion
npm run lint     # ESLint
npm run preview  # Preview del build
```

---

## 2. Estructura de Directorios

```
src/
  App.jsx                    # Rutas principales (React Router con lazy loading + constantes ROUTES/ROLES)
  main.jsx                   # Punto de entrada: Redux Provider, ThemeProvider, BrowserRouter
  index.css                  # Tailwind @theme tokens + resets globales + utilidades fluidas

  assets/                    # Recursos estaticos (imagenes, fuentes)

  constants/                 # ** NUEVO ** Centralizacion de valores hardcodeados
    index.js                 #   Re-exports publicos
    routes.js                #   Rutas de la aplicacion (ROUTES.LOGIN, ROUTES.DASHBOARD, etc.)
    roles.js                 #   Roles + labels (ROLES.ADMIN, ROLE_LABELS, ROLE_COLORS)
    statuses.js              #   Estados de proyecto/tarea + labels + colores
    plans.js                 #   Planes de cliente + labels + colores
    pagination.js            #   Tamanos de pagina por defecto
    auth.js                  #   Header name, localStorage keys
    validation.js            #   Regex, longitudes minimas, campos requeridos
    notification.js          #   Posicion y duracion de toasts
    apiEndpoints.js          #   Todos los paths de API centralizados
    messages.js              #   Mensajes de error/exito/confirmacion (i18n-ready)
    ui.js                    #   Labels, placeholders, textos de botones y navegacion

  components/
    Auth/
      Login.jsx              # Pantalla de login (Tailwind puro)

    Dashboard/
      Dashboard.jsx          # Shell principal: sidebar + content area. Usa activeView para
                             #   renderizar sub-vistas con lazy loading segun el rol.
      AdminDashboard.jsx     # Vista Admin: cards de navegacion + selectedView para
                             #   renderizar ProjectsPage, UserManagement, TaskManagement.
      ClientDashboard.jsx    # Vista Client: gestion de clientes con tarjetas. Refactorizado
                             #   en sub-componentes. Usa ClientContext para estado y API.
      ClientDashboardStats.jsx    # Tarjetas de estadisticas de clientes
      ClientDashboardSearchBar.jsx # Barra de busqueda para clientes
      ClientDashboardCard.jsx      # Tarjeta individual de cliente

    Client/
      UserManagement.jsx     # Gestion de clientes: tabla paginada + tabs (Clientes / Usuarios).
                             #   Usa ClientContext para estado y API.
      UsersInterface.jsx     # Tab "Usuarios" dentro de UserManagement: gestion de staff
                             #   (Admin/Worker). Fetch independiente a /users/staff.
      EditClient.jsx         # Formulario legacy de edicion (ruta /edit-client/:id)
      components/
        CreateClientDialog.jsx   # Variante explicita: crear cliente
        EditClientDialog.jsx     # Variante explicita: editar cliente
        DeleteClientDialog.jsx   # Variante explicita: eliminar cliente
        CreateUserDialog.jsx     # Variante explicita: crear usuario staff
        EditUserDialog.jsx       # Variante explicita: editar usuario staff
        DeleteUserDialog.jsx     # Variante explicita: eliminar usuario staff
        DialogStyles.jsx         # Styled-components compartidos para dialogos
        SharedStyles.jsx         # Styled-components compartidos para tablas (centralizados)
        ClientTableToolbar.jsx   # Toolbar de tabla de clientes (busqueda + botones)
        ClientTableRow.jsx       # Fila individual de tabla de clientes
        ClientPagination.jsx     # Paginacion de tabla de clientes
        UserTableToolbar.jsx     # Toolbar de tabla de usuarios staff
        UserTableRow.jsx         # Fila individual de tabla de usuarios staff
        UserPagination.jsx       # Paginacion de tabla de usuarios staff

    Project/
      StatusChip.jsx         # Chip de estado de proyecto reutilizable
      components/
        ProjectList.jsx      # Tabla/lista de proyectos
        ProjectStats.jsx     # Tarjetas de estadisticas
        ProjectFilter.jsx    # Filtros de busqueda
        ProjectActions.jsx   # Acciones de un proyecto
        Notification.jsx     # Snackbar de notificaciones
        ProjectForm/         # ** PATRON COMPOUND COMPONENT (referencia) **
          context.jsx        #   createContext + useProjectFormContext hook
          Provider.jsx       #   ProjectFormProvider: estado del formulario, fetch de clientes
          CompoundUI.jsx     #   Sub-componentes: Dialog, Header, Content, Actions
          StyledComponents.jsx # Styled Dialog, DialogTitle, FormSection
          FormSections.jsx   #   ClientSection, DetailsSection, StatusSection
          CreateProjectDialog.jsx  # Variante explicita: crear proyecto
          EditProjectDialog.jsx    # Variante explicita: editar proyecto
          index.js           #   Re-exporta variantes
      pages/
        ProjectsPage.jsx    # Pagina orquestadora de proyectos (usa ProjectContext)

    TaskManagement/
      TaskManagement.jsx     # Componente refactorizado (120 lineas): shell con TaskProvider.
                             #   Usa TaskContext para estado y API.
      components/
        TaskFilters.jsx      # Filtros de busqueda y estado
        TaskCard.jsx         # Tarjeta individual de tarea
        TaskStats.jsx        # Estadisticas de tareas (admin)
        TaskManagementHeader.jsx # Header con boton de crear
        TaskManagementTabs.jsx   # Tabs de navegacion
        CreateTaskDialog.jsx # Variante explicita: crear tarea
        EditTaskDialog.jsx   # Variante explicita: editar tarea
        BulkActionDialog.jsx # Acciones masivas sobre tareas

    Roles/
      RoleManagement.jsx     # Gestion de roles. Usa Redux roleSlice para API.
                             #   Refactorizado en sub-componentes.
      components/
        RoleTableRow.jsx     # Fila individual de tabla de roles
        RoleChangeDialog.jsx # Dialogo de confirmacion para cambio de rol

    # Otros dominios:
    CustomerSupport/         # Soporte al cliente
    Excel/                   # Import/Export de Excel (xlsx)
    FaqAdmin/                # CRUD de FAQs (admin). Usa FaqContext.
      FaqAdmin.jsx           #   Shell con FaqProvider (106 lineas)
      components/
        FaqStats.jsx         #   Tarjetas de estadisticas
        FaqFilters.jsx       #   Busqueda y filtros
        FaqList.jsx          #   Lista de FAQs
        FaqCard.jsx          #   Tarjeta individual (ver/editar)
        FaqForm.jsx          #   Formulario de nueva FAQ
        FaqDeleteDialog.jsx  #   Dialogo de confirmacion
    FaqClient/               # Vista de FAQs (cliente)
    Layout/                  # Componentes de layout compartido
    ProjectStatus/           # Estado detallado de un proyecto
      ProjectStatus.jsx      #   Tabla de proyectos con busqueda (120 lineas)
      components/
        ProjectProgressDialog.jsx # Dialogo con CircularProgressbar y stats
    ClientProjects/          # Proyectos vistos por el cliente
      ClientProjects.jsx     #   Orquestador con tarjetas y dialogo de detalles (104 lineas)
      components/
        ProjectCard.jsx      #   Tarjeta de proyecto con animacion
        ProjectDetailsDialog.jsx # Dialogo detallado con contactos y fechas
    WorkerProjects/          # Proyectos vistos por el trabajador
      WorkerProjects.jsx     #   Orquestador con tarjetas y modal de tareas (120 lineas)
      components/
        ProjectCard.jsx      #   Tarjeta de proyecto
        TasksModal.jsx       #   Modal de tareas del proyecto
        TaskUpdateDialog.jsx #   Dialogo para actualizar estado de tarea
        StyledComponents.jsx #   Styled-components extraidos
    WorkerTasks/             # Tareas del trabajador

  context/
    ProjectContext.jsx       # Context + Provider para el dominio de Proyectos.
                             #   Maneja: lista de proyectos, filtros, stats, CRUD via Axios.
                             #   Expone: useProject() hook.
    TaskContext.jsx          # Context + Provider para el dominio de Tareas.
                             #   Maneja: lista de tareas, filtros, stats, CRUD via taskService.
                             #   Expone: useTask() hook.
    ClientContext.jsx        # Context + Provider para el dominio de Clientes.
                             #   Maneja: lista de clientes, busqueda, paginacion, CRUD via clientService.
                             #   Expone: useClient() hook.
    FaqContext.jsx           # Context + Provider para el dominio de FAQs.
                             #   Maneja: lista de FAQs, filtros, busqueda, CRUD via faqService.
                             #   Expone: useFaq() hook.

  redux/
    store.js                 # configureStore con 3 reducers: auth, clients, roles
    slices/
      authSlice.js           # Autenticacion: login (async thunk), logout, user, accessToken.
                             #   Persiste en localStorage. Usa constantes AUTH.STORAGE_KEYS.
      clientSlice.js         # CRUD de clientes via async thunks. NOTA: DEAD CODE - NO se usa
                             #   en los componentes actuales. Los componentes activos usan ClientContext.
      roleSlice.js           # Slice de roles.

  routes/
    ProtectedRoute.jsx       # HOC que verifica autenticacion y rol antes de renderizar hijos.

  services/
    api.js                   # Instancia Axios centralizada con interceptor de token.
                             #   Usa: import api from '../services/api'
    taskService.js           # Modulo API para tareas: CRUD, filtros, stats, bulk actions.
                             #   Usa instancia api.js centralizada.
    clientService.js         # Modulo API para clientes: CRUD.
    userService.js           # Modulo API para usuarios: CRUD, getStaff, getWorkers.
    faqService.js            # Modulo API para FAQs.

  styles/
    global.css               # Estilos globales residuales

  utils/
    cn.js                    # Utilidad clsx + tailwind-merge para clases dinamicas
    colorUtils.js            # Utilidades: stringToColor, adjustColor, getInitials, getPlanColor
    normalizeEntity.js       # Normalizacion de IDs inconsistentes del backend
```

  hooks/
    useNotification.js       # Hook centralizado para notificaciones toast (success, error, loading)

  components/
    ui/                      # Biblioteca de componentes UI atomicos
      index.js               #   Re-exports publicos
      Button.jsx             #   Boton con variantes CVA (primary, secondary, outline, ghost, danger)
      StatusChip.jsx         #   Chip de estado universal con variantes por rol/estado
      Layout.jsx             #   Primitivas de layout: Section, Container, GridStack, Grid

---

## 3. Arquitectura y Patrones de Diseno

### 3.1. Flujo de Navegacion

```
main.jsx
  Redux Provider
    ProjectProvider          <-- Montado a nivel raiz (carga proyectos al autenticarse)
      MUI ThemeProvider
        BrowserRouter
          App.jsx            <-- Define las rutas con lazy loading + ProtectedRoute
            /login           --> Login.jsx
            /dashboard       --> Dashboard.jsx (shell)
                               |-> AdminDashboard (Admin)
                               |     |-> ProjectsPage (selectedView="createClient")
                               |     |-> UserManagement (selectedView="clients")
                               |     |-> TaskManagement (selectedView="roles")
                               |-> ClientDashboard (Client) -- parcialmente implementado
                               |-> WorkerDashboard (Worker) -- placeholder
            /admin-dashboard --> AdminDashboard (ruta directa, Admin only)
            /clients         --> UserManagement (ruta directa, Admin+Worker)
            /roles           --> RoleManagement (ruta directa, Admin only)
            /edit-client/:id --> EditClient (ruta directa, Admin only)
```

### 3.2. Patrones de Composicion (Vercel Patterns)

El proyecto usa patrones de composicion avanzados inspirados en la guia de Vercel. El modulo de **Project** es el modelo de referencia:

**Regla: NO crear componentes monoliticos con props booleanas**

En lugar de un solo `<ProjectForm isEdit={true} isCreate={false} />`, existen variantes explicitas:
- `CreateProjectDialog` - configura estado inicial vacio, llama `onSubmit` para crear
- `EditProjectDialog` - recibe `project`, pre-llena el formulario, llama `onSubmit` para actualizar

Ambas variantes usan internamente el mismo `ProjectFormProvider` + compound components (`CompoundUI.jsx`).

**Estructura del patron (modelo a seguir para nuevos dominios):**

```
ComponentForm/
  context.jsx              # createContext(null) + useComponentFormContext()
  Provider.jsx             # Estado + API calls + validacion. Expone {state, actions}
  CompoundUI.jsx           # Sub-componentes que consumen el context
  CreateComponentDialog.jsx  # Variante: crear
  EditComponentDialog.jsx    # Variante: editar
  index.js                 # Re-exports publicos
```

**Dominios que ya siguen este patron:**
- `Project/components/ProjectForm/` (modelo completo)
- `Client/components/` (variantes Create/Edit/Delete para Client y User)
- `TaskManagement/components/` (variantes Create/Edit + BulkAction)

### 3.3. Gestion del Estado

```
+------------------------------------------------------------------+
|  Que tipo de estado es?                                          |
+------------------------------------------------------------------+
        |                    |                    |
   Autenticacion       Dominio/Modulo        Efimero/Visual
   (user, token,       (proyectos, tareas,   (formularios,
    roles)              filtros, listas)       modales, tabs)
        |                    |                    |
   Redux Toolkit        React Context         useState local
   (authSlice.js)       (ProjectContext.jsx)   o Provider local
        |                    |                    |
   Solo en:             Montar SOLO donde      Dentro del
   store.js             se necesita            componente
+------------------------------------------------------------------+
```

**Regla sobre Redux:** Solo `authSlice` se usa activamente. Los slices `clientSlice` y `roleSlice` existen en el store pero los componentes actuales NO los consumen (hacen fetch directo con Axios). Un agente que trabaje en Clientes o Roles debe decidir si migrar al slice existente o crear un Context dedicado (preferido).

### 3.4. Peticiones a la API

**URL base:** `import.meta.env.VITE_API_URL`

**Headers de autenticacion:** El backend acepta DOS formatos:
```
accesstoken: <token>              // Header custom (usado en la mayoria de componentes)
Authorization: Bearer <token>     // Header estandar (usado en ProjectContext)
```

**Patrones de obtencion del token (tres maneras coexisten):**

| Patron | Donde se usa | Ejemplo |
|--------|-------------|---------|
| `useSelector(state => state.auth.accessToken)` | Componentes React | UserManagement, ProjectContext |
| `localStorage.getItem('accessToken')` | Servicios, slices | taskService.js, clientSlice.js |
| `store.getState().auth?.token` | Servicios (INCORRECTO) | taskService.js (linea 9 -- `token` no existe, deberia ser `accessToken`) |

**Al escribir nuevas llamadas API:** Usa `state.auth.accessToken` (desde Redux selector) o `localStorage.getItem('accessToken')` como fallback. Nunca uses `state.auth.token` (no existe en el slice).

### 3.5. Sistema de Estilos

El proyecto usa **tres capas de estilos** en orden de preferencia:

1. **Tailwind CSS 4** (`index.css` con `@theme` tokens) - para layouts, spacing, colores
2. **MUI `sx` prop** - para estilizar componentes MUI
3. **Emotion `styled()`** - para styled-components complejos reutilizables

**Design tokens definidos en `index.css`:**
```css
--color-brand-primary: #592d2d;
--color-brand-primary-light: #8e3031;
--color-brand-secondary: #1a237e;
--color-brand-secondary-light: #3949ab;
--color-background: #f4f6f9;
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;
--font-sans: "Inter", system-ui, sans-serif;
--font-heading: "Outfit", system-ui, sans-serif;
```

**MUI Theme** (definido en `main.jsx`): Replica estos mismos tokens para que los componentes MUI sean consistentes.

**Regla:** Evita estilos inline con `style={{}}`. Usa clases de Tailwind o `sx` prop de MUI.

---

## 4. Gotchas y Trampas Conocidas

Estas son trampas reales del codigo que un agente debe conocer antes de hacer cambios:

### 4.1. Mapeo de IDs del backend

El backend retorna IDs con nombres inconsistentes. Siempre usa fallbacks:
```javascript
const id = client.clientId || client.id;
const name = client.clientName || client.name || `Cliente ${id}`;
const taskId = task.taskId || task.id;
const userId = user.userId || user.id;
```

### 4.2. ProjectProvider montado dos veces

`ProjectProvider` esta en `main.jsx` (raiz) Y tambien se monta localmente dentro de `AdminDashboard.jsx` (linea 120) cuando `selectedView === "createClient"`. Esto crea dos instancias independientes. Ten cuidado al asumir que hay una sola fuente de proyectos.

### 4.3. Dashboard usa activeView, no rutas

`Dashboard.jsx` no navega a rutas diferentes. Usa un estado local `activeView` para conmutar entre sub-vistas (AdminDashboard, ProjectStatus, ExcelImport, etc.). Las sub-vistas se cargan con `lazy()` + `Suspense`.

### 4.4. Componentes con datos ficticios

Los siguientes componentes usan datos hardcoded en lugar de conectarse a la API:
- `RoleManagement.jsx` - 3 usuarios ficticios, paginacion propia
- `ClientDashboard.jsx` - clientes y contadores inventados (150, 89, 34, 27)
- `TaskManagement.jsx` - inyecta mock data en el catch de errores API

### 4.5. Styled-components duplicados

`UserManagement.jsx` y `UsersInterface.jsx` definen los mismos styled-components de forma independiente:
`EnhancedTableContainer`, `TableToolbar`, `SearchBar`, `StyledTableHead`, `StyledTableRow`, `StatusChip`.
Si modificas uno, verifica el otro.

---

## 5. Instrucciones para Agentes

### 5.1. Antes de escribir codigo

1. **Lee `CLAUDE.md`** en la raiz del proyecto.
2. **Usa `grep_search` antes de modificar cualquier funcion** para verificar donde se consume.
3. **Lee los archivos existentes del dominio** antes de crear archivos nuevos. Compara con como funciona el modulo de `Project/` (modelo de referencia).

### 5.2. Al escribir codigo

4. **NO rompas la UI actual.** El sistema esta construido sobre `@mui/material`. Si modificas una vista, usa los mismos componentes MUI (`Box`, `Typography`, `Grid`, `Button`, `Dialog`, `TextField`). No introduzcas librerias de UI nuevas sin justificacion explicita.
5. **Sigue el patron de composicion.** Para formularios CRUD, usa variantes explicitas (`CreateXDialog`, `EditXDialog`) con un Provider + Context compartido. Consulta `Project/components/ProjectForm/` como referencia.
6. **NO mezcles fuentes de estado.** Si un dominio ya usa Context, no agregues Redux para el mismo dato. Si usa Redux, no dupliques con fetch local.
7. **Usa fallbacks para IDs del backend.** Siempre `data.clientId || data.id`, `data.clientName || data.name`. Ver seccion 4.1.
8. **Usa los design tokens existentes.** Colores brand como clases Tailwind (`text-brand-primary`, `bg-brand-secondary`) o variables CSS (`var(--color-brand-primary)`). No inventes colores nuevos.
9. **Usa la instancia Axios centralizada.** Importa `api` desde `src/services/api.js` para todas las llamadas HTTP. El interceptor agrega el token automaticamente.

### 5.3. Al finalizar

9. **Elimina todo `console.log()`.** Si necesitas logging condicional, usa `import.meta.env.DEV && console.log(...)` o crea un logger en `src/utils/`.
10. **No dejes datos ficticios.** Si conectas un componente a la API, elimina los arrays mock que estaban como placeholder.
11. **Verifica que el build compila:** `npm run build` no debe producir errores.

---

## 6. Glosario

| Termino | Descripcion |
|---------|-------------|
| **CIMA CRM** | Nombre del proyecto |
| **Dashboard.jsx** | Shell principal con sidebar y area de contenido, conmuta vistas con `activeView` |
| **AdminDashboard.jsx** | Sub-vista del admin con cards de navegacion, conmuta con `selectedView` |
| **ProjectsPage** | Pagina de administracion de proyectos, consume `ProjectContext` |
| **ProjectForm (Compound)** | Sistema de formularios modulares con Context + Provider + CompoundUI |
| **UserManagement** | Gestion de clientes + tab de usuarios staff (Workers/Admins) |
| **UsersInterface** | Sub-componente de UserManagement para el tab de staff |
| **TaskManagement** | Gestion de tareas (refactorizado: shell + TaskContext + sub-componentes) |
| **ProtectedRoute** | HOC que verifica `user` y `roles` en Redux antes de renderizar |
| **api.js** | Instancia Axios centralizada con interceptor de token automatico |
| **taskService.js** | Modulo API centralizado para tareas (CRUD + admin endpoints) |
| **useNotification** | Hook centralizado para notificaciones toast (success, error, loading) |
| **cn()** | Utilidad clsx + tailwind-merge para combinar clases dinamicas |
| **normalizeEntity** | Utilidad para normalizar IDs inconsistentes del backend |
| **ProjectContext** | Context API que maneja el estado del dominio de proyectos |
| **ClientContext** | Context API que maneja el estado del dominio de clientes |
| **TaskContext** | Context API que maneja el estado del dominio de tareas |
| **FaqContext** | Context API que maneja el estado del dominio de FAQs |

---

*Este archivo esta disenado para ser procesado por LLMs que operan de forma autonoma en la base de codigo. Si eres un agente y has leido esto, adherite firmemente a estas instrucciones en cada paso.*
