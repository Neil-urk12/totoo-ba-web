/**
 * Vite Configuration
 * 
 * This file configures Vite, the build tool and development server for the application.
 * It includes optimizations for production builds, code splitting strategies, and
 * development server settings.
 * 
 * Key Features:
 * - React Fast Refresh for instant HMR
 * - Tailwind CSS integration
 * - Vendor code splitting for optimal caching
 * - ESBuild minification for fast builds
 * - Dependency pre-bundling
 * 
 * @see https://vitejs.dev/config/
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Vite configuration object
 * 
 * Configures plugins, build options, and optimizations for both
 * development and production environments.
 */
export default defineConfig({
  /**
   * Vite plugins
   * - react: Enables React Fast Refresh and JSX transformation
   * - tailwindcss: Integrates Tailwind CSS processing
   */
  plugins: [react(), tailwindcss()],
  
  /**
   * Build configuration for production
   */
  build: {
    /**
     * Rollup options for advanced bundling control
     */
    rollupOptions: {
      output: {
        /**
         * Manual chunk splitting strategy
         * 
         * Separates vendor libraries into dedicated chunks for better caching.
         * When a vendor library updates, only that chunk needs to be re-downloaded.
         * 
         * Chunks:
         * - react-vendor: Core React libraries (React, ReactDOM, React Router)
         * - ui-vendor: UI component library (Lucide icons)
         * - query-vendor: Data fetching library (TanStack Query)
         * - supabase-vendor: Database client (Supabase)
         */
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'query-vendor': ['@tanstack/react-query'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
    
    /**
     * Chunk size warning limit in KB
     * Set to 1000 KB (1 MB) to avoid warnings for larger vendor chunks
     */
    chunkSizeWarningLimit: 1000,
    
    /**
     * Minification strategy
     * Using esbuild for faster builds compared to terser
     */
    minify: 'esbuild',
    
    /**
     * Build target
     * Using 'esnext' for modern browsers with latest JavaScript features
     */
    target: 'esnext',
    
    /**
     * Source map generation
     * Disabled in production to reduce bundle size and protect source code
     */
    sourcemap: false,
  },
  
  /**
   * Dependency optimization configuration
   * 
   * Pre-bundles dependencies during development for faster page loads.
   * Listed dependencies are eagerly bundled on server start.
   */
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
  },
})
