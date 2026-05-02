# 

Documento Técnico Definitivo: Análisis y Plan de Refactorización Frontend

Este documento consolida el análisis exhaustivo de la aplicación frontend basada en React, Vite, Redux Toolkit, Context API y MUI/Tailwind CSS. El objetivo es proporcionar una hoja de ruta estructurada para corregir problemas arquitectónicos, deuda técnica, bugs potenciales y mejorar la escalabilidad y mantenibilidad del sistema.

## **1\. Arquitectura y Manejo de Estado**

### **1.1. Unificación de la Fuente de Verdad**

* **Problema:** Uso redundante de Redux (Slices para auth, clients, roles) y Context API (ClientContext, TaskContext, etc.) para el mismo propósito, lo que causa problemas de sincronización de datos y aumento en el consumo de memoria.  
* **Solución:** Consolidar el estado global utilizando una única herramienta, prefiriendo usar RTK Query o Slices de Redux Toolkit para todo el manejo de entidades.

### **1.2. Patrón de Capa de Servicios (Service Layer)**

* **Problema:** Bypass de la configuración centralizada de Axios en src/services/api.js. Componentes y contextos (como ExcelContext.jsx, UsersInterface.jsx y ProjectContext.jsx) hacen llamadas directas o recrean instancias, ignorando los interceptores que inyectan el token automáticamente.  
* **Solución:** Eliminar todas las importaciones directas de axios en los componentes y utilizar exclusivamente las funciones definidas centralizadamente en src/services/.

### **1.3. Arquitectura de Carpetas: Feature-Sliced Design (FSD)**

* **Problema:** Organización actual estructurada por tipo/vista (ej. components/Project, components/Client), lo cual genera acoplamiento y dificulta la navegación y escalabilidad en proyectos grandes.  
* **Solución:** Migrar a una arquitectura orientada a dominios o Feature-Sliced Design (FSD), separando por funcionalidades (ej. src/features/tasks/ con sus componentes, API y estado juntos) para garantizar que los dominios sean auto-contenidos.

## **2\. Rendimiento y Escalabilidad**

### **2.1. Re-renders Masivos y Memoización**

* **Problema:** Los objetos value en TaskContext.jsx, ClientContext.jsx y ExcelContext.jsx se recrean en cada renderizado, forzando re-renders completos en todos los componentes hijos independientemente de si usan el estado que cambió.  
* **Solución:** Envolver los objetos de valor de los contextos en useMemo, incluyendo correctamente todas sus dependencias.

### **2.2. Paginación y Filtrado (Cuello de Botella Crítico)**

* **Problema:** Paginación del lado del cliente en UserManagement.jsx y ProjectList.jsx mediante la descarga de todos los registros de la base de datos y el uso de .slice() en frontend. Esto no es escalable y puede causar *Out of Memory* al escalar el volumen de datos.  
* **Solución:** Implementar Paginación del Lado del Servidor (Server-Side Pagination), enviando page, limit y parámetros de búsqueda directamente en los query params al backend.

### **2.3. Caché y Manejo de Estado Asíncrono**

* **Problema:** Uso obsoleto de useEffect con useState para llamadas a la API, causando problemas de *race conditions*, estados de carga manuales, y descargas redundantes cada vez que el usuario navega entre pestañas.  
* **Solución:** Integrar TanStack Query (React Query) o, idealmente, RTK Query para implementar caché instantáneo, eliminar estados de carga (spinners) manuales y evitar sobrecargas innecesarias en la red.

## **3\. Prevención de Bugs Críticos y Resiliencia**

### **3.1. Riesgos de Fuga de Memoria (Descarga Base64)**

* **Problema:** Decodificación de archivos Excel grandes procesando strings en Base64 con atob en ExcelContext.jsx, lo que puede congelar o cerrar drásticamente la pestaña del navegador.  
* **Solución:** El backend debe devolver el archivo como un flujo binario (application/octet-stream o similar) y el frontend procesarlo usando responseType: 'blob' en Axios.

### **3.2. Errores de API e Inconsistencias**

* **Problema:** Endpoint erróneo codificado en ProjectContext.jsx que intenta consultar /projects/clients e inconsistencias estructurales en los DTOs del backend (userId vs id) que fuerzan mapeos frágiles.  
* **Solución:** Estandarizar contratos del backend, aplicar el archivo normalizeEntity.js de forma consistente y corregir la configuración de las URL base en los contextos.

### **3.3. Manejo de Errores Inseguro y Resiliencia UI**

* **Problema:** Peticiones fallidas generan ruido en consola asumiendo estructuras fijas en err.response, y muestran mensajes poco amigables al usuario final. Además, un error de renderizado en JavaScript causa la caída completa de la pantalla en blanco.  
* **Solución:** Implementar el patrón **Error Boundaries** (con react-error-boundary) para encapsular fallos por componentes. Además, crear un *Error Handler Centralizado* en el interceptor de Axios que traduzca códigos HTTP a mensajes amigables y legibles.

## **4\. Deuda Técnica y Clean Code**

### **4.1. Tipado Estático y Autocompletado**

* **Problema:** El proyecto utiliza JavaScript puro (.jsx) con contratos de datos ambiguos, requiriendo adivinanzas en tiempo de ejecución.  
* **Solución:** Migrar a TypeScript (.tsx) y definir interfaces claras para el modelo de datos para que el IDE advierta de errores estructurales antes de llegar a producción.

### **4.2. Formularios, Fechas y Testing**

| Área | Problema Identificado | Solución Recomendada   |
| :---- | :---- | :---- |
| Formularios | Control manual de formularios complejos con useState que causa un re-render por cada tecla pulsada y validaciones manuales difíciles de mantener. | Implementar **React Hook Form** para manejo de referencias junto con **Zod** o **Yup** para crear esquemas de validación estrictos. |
| Formato de Fechas | Dependencia del objeto Date nativo, el cual está atado a la zona horaria de la máquina del usuario final, creando inconsistencias internacionales. | Utilizar librerías ligeras como **date-fns** o **dayjs** para forzar consistencia de zonas horarias y formateo legible. |
| Pruebas Automatizadas | Ausencia total de archivos de pruebas (.test.js), garantizando la aparición de regresiones y fallos en aplicaciones de alta criticidad. | Introducir **Vitest** y **React Testing Library** para realizar testing de la lógica crítica del negocio. |

### **4.3. Constantes, Scripts Residuales y Seguridad**

* **Problema:** Hardcoding de "Magic strings" en rutas y roles (ej. /users/register o 'Admin') en lugar de usar constantes, presencia de scripts parche como replace\_classes.js en producción, y envío del token en un header no estándar llamado accesstoken.  
* **Solución:** Consumir exclusivamente las constantes del directorio src/constants/, eliminar scripts de migración obsoletos, y adoptar el estándar HTTP enviando el token como Authorization: Bearer \<token\>.

## **5\. Diseño, Interfaz de Usuario (UI/UX) y Accesibilidad**

### **5.1. Choque de Sistemas Visuales y Tematización**

* **Problema:** Mezcla inconsistente de componentes personalizados en Tailwind con Material-UI, generando dos tipos de componentes (ej. botones con distintos efectos) en la misma app. Adicionalmente, el código contiene gradientes y colores "duros" inyectados directamente (ej. bg-white o linear-gradient(...)), bloqueando escalabilidad de diseño o un Modo Oscuro.  
* **Solución:** Establecer una única fuente de verdad utilizando *Design Tokens*. Sincronizar MUI con Tailwind o decantarse por uno, y centralizar todos los colores usando variables semánticas (ej. var(--color-surface)) en lugar de valores hexadecimales duros.

### **5.2. UX Móvil y Responsividad Avanzada**

* **Tablas en Móviles:** Tablas muy anchas que generan un doloroso *scroll horizontal* táctil. **Solución:** Usar CSS Grid para que los TableRow se transformen visualmente en Tarjetas ("Cards") apiladas en móviles.  
* **Modales Claustrofóbicos:** Diálogos con maxWidth="sm" en teléfonos dejan poco espacio utilizable. **Solución:** Implementar la propiedad fullScreen dinámicamente si se detecta un celular (ej. usando useMediaQuery).  
* **Áreas de Toque:** IconButtons demasiado pequeños (24-30px) que provocan pulsaciones accidentales. **Solución:** Asegurar un mínimo de 44x44 píxeles requeridos por estándares aumentando el padding en versión móvil.  
* **Tipografías Estáticas:** Los títulos (h3, h4) se rompen en móviles. **Solución:** Envolver la configuración del tema en main.jsx con la función responsiveFontSizes() de MUI para escalado automático.

### **5.3. Accesibilidad (WCAG) y Estados Vacíos**

* **Contraste:** Colores de chips dinámicos (texto amarillo claro sobre fondo amarillo) no pasan pruebas de contraste WCAG. **Solución:** Oscurecer consistentemente las fuentes mientras se mantienen fondos pasteles claros.  
* **Feedback de Carga:** Uso de *Spinners* estáticos obsoletos. **Solución:** Implementar generalizadamente *Skeleton Screens* para mejorar la percepción psicológica del usuario durante los estados de carga.