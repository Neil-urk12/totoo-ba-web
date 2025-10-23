# FDA Product Checker

The FDA Product Checker is a web application designed to help Filipino consumers verify the authenticity and compliance of food and beauty products. It provides a user-friendly interface to check if a product is registered with the Food and Drug Administration (FDA) of the Philippines and if the manufacturer is a legitimate, registered business entity.

## Features

- **Real-time Verification**: Instantly check product registration against official FDA databases.
- **Business Legitimacy Check**: Verify manufacturer information with the official Philippine business registry.
- **AI-Powered Matching**: Utilizes advanced algorithms to match and normalize data for accurate results.
- **Counterfeit Detection**: Get instant warnings about unregistered products and suspicious business entities.
- **Text and Image Search**: Verify products by entering their name or registration number, or by uploading an image.

## Tech Stack

- **Framework**: React
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: React Query
- **Routing**: React Router
- **Database**: Supabase

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Bun (or npm/yarn)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/fda-product-checker.git
   cd fda-product-checker
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```
   or
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root of the project and add the following environment variables:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Running the Development Server

To start the development server, run the following command:

```bash
bun run dev
```

The application will be available at `http://localhost:5173`.

## Available Scripts

- `bun run dev`: Starts the development server.
- `bun run build`: Builds the application for production.
- `bun run lint`: Lints the codebase using Oslint.
- `bun run preview`: Previews the production build locally.

## Usage

1. **Text Search**:
   - Enter the product name, brand, or registration number in the search bar.
   - Select a category (optional).
   - Click "Verify Product" to see the results.

2. **Image Search**:
   - Select the "Image Upload" tab.
   - Upload an image of the product.
   - Click "Verify Product Image" to let the AI analyze the image and provide verification results.
