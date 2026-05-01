// src/utils/logger.js
const logger = {
  debug: (...args) => import.meta.env.DEV && console.log('[DEBUG]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
};

export default logger;
