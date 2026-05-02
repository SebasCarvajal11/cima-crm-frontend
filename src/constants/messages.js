export const MESSAGES = {
  ERROR: {
    CLIENT: {
      REQUIRED_FIELDS: 'Nombre y Email son obligatorios',
      PASSWORD_REQUIRED: 'La contraseña es obligatoria y debe tener al menos 6 caracteres',
      NO_SELECTED: 'No se ha seleccionado ningún cliente para eliminar',
      NO_ID: 'El cliente seleccionado no tiene un ID definido',
      LOAD: 'Error al cargar los clientes',
      CREATE: 'Error al crear el cliente',
      UPDATE: 'Error al actualizar el cliente',
      DELETE: 'Error al eliminar el cliente',
    },
    USER: {
      REQUIRED_FIELDS: 'Nombre, Email y Rol son obligatorios',
      PASSWORD_REQUIRED: 'La contraseña es obligatoria para crear un usuario',
      NO_SELECTED: 'No se ha seleccionado ningún usuario para eliminar',
      NO_ID: 'El usuario seleccionado no tiene un ID definido',
      LOAD_STAFF: 'Error al cargar usuarios del staff',
      CREATE: 'Error al crear el usuario',
      UPDATE: 'Error al actualizar el usuario',
      DELETE: 'Error al eliminar el usuario',
    },
    PROJECT: {
      LOAD: 'Error al cargar los proyectos',
      CREATE: 'Error al crear el proyecto',
      UPDATE: 'Error al actualizar el proyecto',
      DELETE: 'Error al eliminar el proyecto',
      NO_SELECTED: 'No se ha seleccionado ningún proyecto para actualizar',
      STATS: 'Error al obtener estadísticas',
      BY_CLIENT: 'Error al obtener proyectos por cliente',
    },
    TASK: {
      CREATE: 'Error al crear la tarea',
      UPDATE: 'Error al actualizar la tarea',
      DELETE: 'Error al eliminar la tarea',
      BULK: 'Error al procesar la acción en masa',
    },
    FAQ: {
      LOAD: 'Error al cargar las preguntas frecuentes',
      CREATE: 'Error al crear la pregunta frecuente',
      UPDATE: 'Error al actualizar la pregunta frecuente',
      DELETE: 'Error al eliminar la pregunta frecuente',
    },
    ROLE: {
      UPDATE: 'Error al actualizar el rol',
    },
    FILE: {
      LOAD: 'Error al cargar los archivos',
      UPLOAD: 'Error al subir el archivo',
      DOWNLOAD: 'Error al descargar el archivo',
      DELETE: 'Error al eliminar el archivo',
    },
    AUTH: {
      DEFAULT: 'Error en la autenticación',
    },
  },
  SUCCESS: {
    CLIENT: {
      CREATE: 'Cliente creado exitosamente',
      UPDATE: 'Cliente actualizado exitosamente',
      DELETE: 'Cliente eliminado exitosamente',
    },
    USER: {
      CREATE: 'Usuario creado exitosamente',
      UPDATE: 'Usuario actualizado exitosamente',
      DELETE: 'Usuario eliminado correctamente',
    },
    PROJECT: {
      CREATE: 'Proyecto creado exitosamente',
      UPDATE: 'Proyecto actualizado exitosamente',
      DELETE: 'Proyecto eliminado exitosamente',
    },
    TASK: {
      CREATE: 'Tarea creada con éxito',
      UPDATE: 'Tarea actualizada con éxito',
      DELETE: 'Tarea eliminada exitosamente',
      BULK: (count) => `Estado actualizado para ${count} tareas`,
    },
    FAQ: {
      CREATE: 'Pregunta frecuente creada exitosamente',
      UPDATE: 'Pregunta frecuente actualizada exitosamente',
      DELETE: 'Pregunta frecuente eliminada exitosamente',
    },
    ROLE: {
      UPDATE: (role, name) => `Rol actualizado a ${role} para ${name}`,
    },
    FILE: {
      UPLOAD: 'Archivo subido exitosamente',
      DOWNLOAD: 'Archivo descargado correctamente',
      DELETE: 'Archivo eliminado correctamente',
    },
  },
  CONFIRM: {
    DELETE_PROJECT: '¿Está seguro de eliminar este proyecto?',
    DELETE_TASK: '¿Está seguro de eliminar esta tarea?',
    DELETE_CLIENT: '¿Está seguro de eliminar este cliente?',
    DELETE_USER: '¿Está seguro de eliminar este usuario?',
    DELETE_FILE: '¿Está seguro de eliminar este archivo?',
  },
};
