# Personal Website & Blog

A modern, performant personal website and blog built with Astro, SolidJS, and TypeScript.

## 🏗 Architecture

### Tech Stack
- **Framework**: [Astro](https://astro.build) for static site generation
- **UI Library**: [SolidJS](https://www.solidjs.com) for interactive components
- **Styling**: Tailwind CSS with custom design tokens
- **Content**: MDX for blog posts
- **Search**: Client-side search implementation
- **Type Safety**: TypeScript throughout
- **Logging**: Environment-aware, module-specific logging system

### Key Patterns

#### Component Architecture
- Strong TypeScript interfaces for component props
- Consistent error handling and loading states
- Animation patterns using CSS transitions
- Reusable UI components in `src/components/ui/`

#### Logging System
- Environment-aware logging utility
- Development-only debug logs
- Module-specific loggers
- Zero performance overhead in production

Example of Logging:
```typescript
import { createLogger } from './utils/logger';

const searchLogger = createLogger('SearchUtility');
searchLogger.debug('Initializing search...');
searchLogger.info('Search index loaded');
```

#### State Management
- SolidJS stores for global state
- Context providers for feature-specific state
- Persisted state using localStorage/IndexedDB
- Reactive patterns with signals and effects

#### Data Handling
- Build-time data generation
- Caching pattern for external data
- GitHub integration for releases
- Code statistics generation

#### Content & Search
- MDX-based blog posts
- Client-side search implementation
- Chunked search data loading
- Type-safe search results

## 🚀 Development

### Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

### Logging System

#### Features
- 🌐 Environment-specific logging
- 🔍 Development-only debug logs
- 📊 Multiple log levels
- 🏷️ Module-specific logging
- 🚀 Zero performance overhead in production

#### Log Levels
- `DEBUG`: Most verbose, only in development
- `INFO`: General information
- `WARN`: Potential issues
- `ERROR`: Critical errors

#### Best Practices
- Use `debug()` for development tracing
- Use `info()` for general information
- Use `warn()` for potential issues
- Use `error()` for critical errors

### Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # UI components
│   │   └── ui/         # Reusable UI components
│   ├── content/        # MDX blog posts
│   ├── data/          # Generated data
│   ├── integrations/  # Astro integrations
│   ├── layouts/       # Page layouts
│   ├── pages/         # Route pages
│   ├── stores/        # State management
│   ├── styles/        # CSS styles
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
│       └── logger.ts  # Centralized logging utility
└── scripts/           # Build scripts
```

### Key Features

#### Blog System
- MDX for rich content
- Frontmatter for metadata
- Image optimization
- Code syntax highlighting

#### Search Implementation
- Client-side full-text search
- Chunked data loading
- Debounced search
- Highlighted results

#### Theme System
- Dark/light mode
- Persisted preferences
- CSS custom properties
- Tailwind integration

#### Performance
- Static site generation
- Optimized assets
- Lazy-loaded components
- Cached external data
- Minimal logging overhead

## 🧞 Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Install dependencies                            |
| `npm run dev`             | Start dev server at `localhost:4321`            |
| `npm run build`           | Build production site                           |
| `npm run preview`         | Preview production build                        |
| `npm run astro ...`       | Run Astro CLI commands                          |

## 🔧 Configuration

Key configuration files:
- `astro.config.mjs` - Astro configuration
- `tailwind.config.cjs` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts
- `src/utils/logger.ts` - Logging utility configuration

## 📚 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Follow logging best practices
6. Submit a pull request

## 🐛 Common Issues

### Logging and Debugging
- Use module-specific loggers
- Check browser console for development logs
- Verify log levels are appropriate

### Search Not Working
- Check browser console for errors
- Verify search index is generated
- Clear browser cache

### Build Failures
- Update dependencies
- Clear build cache
- Check TypeScript errors

## 📖 Resources

- [Astro Documentation](https://docs.astro.build)
- [SolidJS Documentation](https://www.solidjs.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Logging Utility Overview](/src/utils/LOGGING_MIGRATION_OVERVIEW.md)
