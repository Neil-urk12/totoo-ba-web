# FDA Product Checker - Totoo Ba Ito?

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646cff.svg)](https://vitejs.dev/)

A comprehensive web application designed to help Filipino consumers verify the authenticity and compliance of food, drug, and beauty products. The platform provides real-time verification against official FDA Philippines databases and business registries, helping protect consumers from counterfeit and unregistered products.

## 🌟 Features

### Core Functionality
- **🔍 Dual Verification Methods**
  - **Text Search**: Search by product name, brand, or FDA registration number
  - **Image Upload**: AI-powered image verification using computer vision and OCR

- **📊 Real-time Database Access**
  - Direct integration with FDA Philippines product databases
  - Cross-reference with Philippine Business Registry
  - Unified view of food products and pharmaceutical drugs

- **🤖 AI-Powered Matching**
  - Advanced full-text search with PostgreSQL
  - Intelligent product matching algorithms
  - Image analysis for product verification

- **⚠️ Counterfeit Detection**
  - Instant warnings for unregistered products
  - Verification status badges
  - Alternative product suggestions

### User Experience
- **🎨 Modern UI/UX**
  - Responsive design for mobile and desktop
  - Dark mode support
  - Accessible ARIA attributes throughout

- **⚡ Performance Optimized**
  - Lazy loading of routes and components
  - Code splitting for smaller bundle sizes
  - Optimized React Query caching
  - Server-side pagination

- **🛡️ Error Handling**
  - Comprehensive error boundaries
  - User-friendly error messages
  - Graceful fallbacks

## 🏗️ Tech Stack

### Frontend
- **Framework**: [React 19.2](https://reactjs.org/) - UI library
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/) - Type safety
- **Build Tool**: [Vite 7.1](https://vitejs.dev/) - Fast build and HMR
- **Styling**: [Tailwind CSS 4.1](https://tailwindcss.com/) - Utility-first CSS
- **Routing**: [React Router 7.9](https://reactrouter.com/) - Client-side routing
- **State Management**: [TanStack Query 5.90](https://tanstack.com/query) - Server state management
- **Icons**: [Lucide React](https://lucide.dev/) - Icon library
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes) - Dark mode

### Backend & Database
- **Database**: [Supabase](https://supabase.com/) - PostgreSQL database
- **API**: RESTful API with image verification endpoint
- **Full-Text Search**: PostgreSQL tsvector for efficient searching

### Development Tools
- **Linter**: [OXLint](https://oxc-project.github.io/) - Fast JavaScript/TypeScript linter
- **Package Manager**: [Bun](https://bun.sh/) (or npm/yarn)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **Bun**: Latest version ([Install](https://bun.sh/)) - or npm/yarn as alternative
- **Git**: For cloning the repository

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Neil-urk12/totoo-ba-web.git
cd totoo-ba-web
```

### 2. Install Dependencies

Using Bun (recommended):
```bash
bun install
```

Or using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

Then configure the following environment variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# API Configuration (for image verification)
VITE_API_BASE_URL=your_api_base_url
```

**Getting Supabase Credentials:**
1. Create a free account at [Supabase](https://supabase.com/)
2. Create a new project
3. Go to Project Settings > API
4. Copy the Project URL and anon/public key

### 4. Database Setup

The application requires the following Supabase tables:
- `food_products` - FDA-registered food products
- `drug_products` - FDA-registered pharmaceutical products
- `unified_products` - Database view combining both tables
- `food_industry` - Business registry for food manufacturers
- `drug_industry` - Business registry for drug manufacturers

Refer to `create_unified_products_view.sql` for the database schema.

### 5. Start Development Server

```bash
bun run dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Starts the development server with hot reload |
| `bun run build` | Builds the application for production |
| `bun run lint` | Lints the codebase using OXLint |
| `bun run preview` | Previews the production build locally |

## 📖 Usage Guide

### Text Search Verification

1. Navigate to the homepage
2. Ensure "Text Search" tab is selected
3. Enter the product name, brand, or FDA registration number
4. (Optional) Select a product category (Food, Drugs, Cosmetics)
5. Click "Verify Product"
6. View verification results including:
   - Registration status
   - Product details
   - Manufacturer information
   - Registration and expiry dates
   - Alternative matches

### Image Verification

1. Navigate to the homepage
2. Click the "Image Upload" tab
3. Click to upload or drag and drop a product image
4. Supported formats: WEBP, PNG, JPG
5. Click "Verify Product Image"
6. Wait for AI analysis (typically 3-5 seconds)
7. View extracted information and verification results

### Browse Products

1. Click "Products" in the navigation
2. Use filters to narrow results by category
3. Use the search bar for specific products
4. Click "Load More" to view additional products
5. Click the eye icon on any product card for detailed information

### View Analytics

1. Click "Analytics" in the navigation
2. View statistics including:
   - Total registered products
   - Products by category
   - Database coverage
   - Recent updates

## 🏛️ Project Structure

```
totoo-ba-web/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images and static files
│   ├── components/     # React components
│   │   ├── AlternativeProductCard.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── SearchForm.tsx
│   │   └── ... (other components)
│   ├── db/            # Database configuration
│   │   └── supabaseClient.ts
│   ├── hooks/         # Custom React hooks
│   │   └── ThemeToggle.tsx
│   ├── pages/         # Route pages
│   │   ├── About.tsx
│   │   ├── Analytics.tsx
│   │   ├── Products.tsx
│   │   ├── Verify.tsx
│   │   └── ... (other pages)
│   ├── query/         # React Query hooks
│   │   ├── get/      # GET request hooks
│   │   └── post/     # POST request hooks
│   ├── types/        # TypeScript type definitions
│   │   └── UnifiedProduct.ts
│   ├── utils/        # Utility functions
│   │   └── formatters.ts
│   ├── App.tsx       # Root component
│   ├── main.tsx      # Application entry point
│   └── index.css     # Global styles
├── .env.example       # Environment variables template
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite configuration
└── README.md          # This file
```

## 🔧 Configuration Files

### Vite Configuration (`vite.config.ts`)
- React plugin with Fast Refresh
- Tailwind CSS integration
- Code splitting for vendor libraries
- Build optimizations for production

### TypeScript Configuration (`tsconfig.json`)
- Strict type checking enabled
- Modern ES module support
- Path aliases for cleaner imports

### Tailwind Configuration (`tailwind.config.js`)
- Custom color scheme
- Dark mode support
- Responsive breakpoints

## 🎨 Component Documentation

All components are fully documented with JSDoc comments. Key components include:

- **SearchForm**: Dual-method product verification form
- **ProductCard**: Displays product information with verification status
- **ErrorBoundary**: Catches and handles React errors gracefully
- **Navbar**: Responsive navigation with mobile menu
- **Hero**: Landing page hero section
- **Features**: Feature showcase grid

See inline documentation in each component file for detailed usage.

## 🔌 API Integration

### Supabase Queries
The application uses React Query hooks for data fetching:

- `useGetUnifiedProductsInfiniteQuery` - Infinite scroll product list
- `useGetProductVerifyQuery` - Single product verification
- `usePostVerifyImage` - Image verification mutation

### Image Verification API
Endpoint: `POST /api/v1/products/new-verify-image`
- Accepts: multipart/form-data with image file
- Returns: Verification result with AI analysis

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code:
- Follows the existing code style
- Includes appropriate documentation
- Passes linting (`bun run lint`)
- Builds successfully (`bun run build`)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- FDA Philippines for providing public access to product databases
- Philippine Business Registry for business verification data
- Open source community for the amazing tools and libraries

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/Neil-urk12/totoo-ba-web/issues)
- Check existing documentation in the codebase

## 🔮 Future Enhancements

- [ ] Barcode scanning functionality
- [ ] User accounts and saved searches
- [ ] Product comparison features
- [ ] Email notifications for expiring registrations
- [ ] Multi-language support (English, Filipino)
- [ ] Offline mode with cached data

---

**Made with ❤️ for Filipino consumers**
