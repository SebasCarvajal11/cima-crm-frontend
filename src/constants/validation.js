export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  REQUIRED_FIELDS: {
    CLIENT: ['nombre', 'email'],
    USER: ['nombre', 'email', 'rol'],
    PROJECT: ['projectName', 'clientId'],
    TASK: ['description', 'projectId'],
  },
};
