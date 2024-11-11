// Detect environment using Astro's built-in flags
function isDevEnvironment(): boolean {
  // Check if import.meta.env exists and has DEV flag
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.DEV === true;
  }
  
  // Fallback to Node.js environment variable
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'development';
  }
  
  // Default to production if no environment detected
  return false;
}

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4
}

interface LoggerConfig {
  level?: LogLevel;
  prefix?: string;
}

class Logger {
  private level: LogLevel;
  private prefix: string;
  private isDev: boolean;

  constructor(config: LoggerConfig = {}) {
    this.isDev = isDevEnvironment();
    this.level = config.level ?? (this.isDev ? LogLevel.DEBUG : LogLevel.WARN);
    this.prefix = config.prefix ? `[${config.prefix}] ` : '';
  }

  private log(level: LogLevel, ...args: any[]) {
    // Only log if current log level is less than or equal to configured level
    if (this.level <= level) {
      const method = this.getConsoleMethod(level);
      method(this.prefix, ...args);
    }
  }

  private getConsoleMethod(level: LogLevel) {
    switch (level) {
      case LogLevel.DEBUG: return console.log;
      case LogLevel.INFO: return console.log;
      case LogLevel.WARN: return console.warn;
      case LogLevel.ERROR: return console.error;
      default: return console.log;
    }
  }

  debug(...args: any[]) {
    // Debug logs only in development
    if (this.isDev) {
      this.log(LogLevel.DEBUG, ...args);
    }
  }

  info(...args: any[]) {
    this.log(LogLevel.INFO, ...args);
  }

  warn(...args: any[]) {
    this.log(LogLevel.WARN, ...args);
  }

  error(...args: any[]) {
    this.log(LogLevel.ERROR, ...args);
  }

  // Create a logger with a specific prefix
  withPrefix(prefix: string): Logger {
    return new Logger({ 
      level: this.level, 
      prefix 
    });
  }
}

// Default global logger
export const logger = new Logger();

// Utility to create module-specific loggers
export function createLogger(moduleName: string): Logger {
  return new Logger({ prefix: moduleName });
}
