# Changelog

All notable changes to the FDA Product Checker project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Image verification loader component with improved UX
- Comprehensive error boundaries for better error handling
- Detailed product reporting form with dynamic FDA email channel based on issue type
- Report mutation hooks for submitting reported products to Supabase
- Environment variable configuration with `.env.example` file
- Alternative product suggestions with horizontal scroll for mobile devices

### Changed
- Migrated from `react-icons` to `lucide-react` for better performance
- Updated UI vendor configuration in Vite
- Redesigned image verification result layout (removed FDA badge)
- Redesigned results page layout for better user experience
- Updated action button alignment in Report component
- Replaced unsafe `history.back()` with safe navigation

### Fixed
- Reverted to singleton pattern due to React hooks issues
- Improved search tracking functionality
- Enhanced product card details modal behavior

### Removed
- EmailJS dependencies (replaced with native solution)
- Unnecessary search count implementation
- Search provider abstraction
- Type definitions for deprecated search tracking

## [0.1.0] - Initial Release

### Added
- Real-time FDA product verification system
- Business legitimacy check with Philippine business registry
- AI-powered product matching and data normalization
- Counterfeit detection with instant warnings
- Text and image-based product search
- Product catalog page with filtering
- Analytics dashboard for product insights
- About page with project information
- Report system for suspicious products
- Responsive design with Tailwind CSS
- Dark/light theme support
- Supabase integration for data management
- React Query for efficient data fetching and caching

### Performance Optimizations
- **Code Splitting**: All route pages lazy-loaded (Products, Analytics, About, Verify, Report, NotFound)
- **Lazy Loading**: Homepage components (Hero, SearchForm, Features, Notice) lazy-loaded
- **Vendor Chunk Separation**: Split vendor libraries into logical chunks
  - `react-vendor`: 90.30 kB (30.64 kB gzipped)
  - `supabase-vendor`: 147.10 kB (39.39 kB gzipped)
  - `query-vendor`: 36.75 kB (10.97 kB gzipped)
  - `ui-vendor`: 2.50 kB (1.08 kB gzipped)
- **React Performance**: Applied `React.memo` to key components (ProductCard, ProductCardSkeleton, Hero, Features)
- **React Query Optimization**: Configured optimal cache and stale time settings
  - staleTime: 5 minutes
  - gcTime: 10 minutes
  - refetchOnWindowFocus: disabled
  - retry: 1
- **Build Configuration**: Enhanced Vite configuration with esbuild minification and modern target
- **Asset Loading**: Preload critical scripts and images, DNS prefetch for Supabase

### Technical Stack
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.1.10
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.14
- **Data Fetching**: TanStack React Query 5.90.5
- **Routing**: React Router DOM 7.9.4
- **Database**: Supabase 2.75.1
- **Icons**: Lucide React 0.546.0
- **Theme**: next-themes 0.4.6
- **Linter**: oxlint 1.23.0

### Bundle Analysis
- **Total CSS**: 45.20 kB (8.61 kB gzipped)
- **Total JavaScript**: ~556 kB uncompressed, ~170 kB gzipped
- **Main Bundle**: 208.47 kB (65.98 kB gzipped)

### Page Chunks (gzipped)
- Verify: 7.49 kB
- Products: 4.73 kB
- Report: 4.28 kB
- Analytics: 2.74 kB
- SearchForm: 2.71 kB
- About: 2.29 kB
- NotFound: 1.70 kB

---

## Release Categories

### Types of Changes
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

### Branch Information
- Main development branch: `develop`
- Feature branches: `feature/analytics`, `feature/reports`

---

**Note**: This project is currently in active development. Version numbers will be assigned as releases are tagged in the repository.
