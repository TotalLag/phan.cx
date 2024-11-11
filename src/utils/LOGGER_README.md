# Logging Utility

## Overview
This project uses a custom logging utility that provides environment-aware, flexible logging across different modules.

## Features
- 🌐 Environment-specific logging
- 🔍 Development-only debug logs
- 📊 Multiple log levels
- 🏷️ Module-specific logging
- 🚀 Zero performance overhead in production

## Installation
The logging utility is already integrated into the project. No additional installation is required.

## Usage

### Basic Logging
```typescript
import { logger } from './logger';

// Development-only debug log
logger.debug('This will only log in development');

// Informational log
logger.info('General information');

// Warning log
logger.warn('Potential issue detected');

// Error log
logger.error('Critical error occurred');
```

### Module-Specific Logging
```typescript
import { createLogger } from './logger';

// Create a logger for a specific module
const searchLogger = createLogger('SearchUtility');

searchLogger.debug('Search initialization started');
searchLogger.info('Search index loaded');
```

## Log Levels
- `DEBUG`: Most verbose, only in development
- `INFO`: General information
- `WARN`: Potential issues
- `ERROR`: Critical errors

## Configuration
The logger automatically detects the environment:
- In development, all log levels are active
- In production, only WARN and ERROR logs are shown
- Debug logs are completely stripped

## Best Practices
- Use `debug()` for development tracing
- Use `info()` for general information
- Use `warn()` for potential issues
- Use `error()` for critical errors
- Avoid logging sensitive information

## Performance
- Zero runtime cost in production
- Minimal memory overhead
- Automatic log level management

## Customization
You can create custom loggers with specific prefixes or log levels if needed.

## Troubleshooting
- Ensure you're importing from `./logger`
- Check that the import is correct
- Verify you're using the right log method

## Contributing
When adding new utility files, follow the established logging pattern:
1. Import `createLogger`
2. Create a module-specific logger
3. Use appropriate log levels
4. Maintain existing error handling
