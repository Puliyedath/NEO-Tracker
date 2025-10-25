# NASA NEO Tracker

A beautiful, modern web application to track Near-Earth Objects (NEOs) using NASA's NeoWs API.

## Features

- 🌌 **Dark Space Theme** - Beautiful starfield background with twinkling stars
- 🚀 **Real-time NEO Data** - Fetch NEO data for any date using NASA's API
- 📊 **Interactive Statistics** - View total NEOs, closest approach, and largest diameter
- 📋 **Detailed Table View** - Browse all NEOs with key metrics
- 🎯 **Focused Detail Panel** - See detailed information about the closest asteroid
- 🔄 **Server Actions** - Built with Next.js 13+ Server Actions for optimal performance

## Project Structure

```
src/
├── actions/
│   └── neo-actions.ts          # Server action for fetching NASA data
├── components/
│   ├── neo-search-form.tsx     # Search form component
│   └── neo-results.tsx         # Results display component
├── types/
│   └── neo.ts                  # Flattened NEO type definitions
└── app/
    ├── page.tsx                # Main page
    ├── layout.tsx              # Root layout
    └── globals.css             # Global styles
```

## Type System

The `NEO` type is a flattened version of NASA's API response with properties using the pattern:

- `parentkey_childkey_grandchildkey`

Example properties:

- `estimated_diameter_kilometers_min`
- `estimated_diameter_kilometers_max`
- `relative_velocity_kilometers_per_second`
- `miss_distance_kilometers`

## Server Actions

The `fetchNEOData` server action:

- Takes a date string (YYYY-MM-DD format)
- Queries NASA's NeoWs API
- Returns flattened NEO data with statistics
- Uses environment variables for API key security

## Component Architecture

### Cache Pattern

The home page uses a "cache component" pattern:

- **Parent**: `NEOSearchForm` - Handles user input and data fetching
- **Children**: `NEOResults` - Receives data via props and displays results

This pattern ensures:

- Clean separation of concerns
- Efficient data flow
- Optimal re-rendering

## Environment Variables

Create a `.env.local` file in the project root:

```env
NASA_API_KEY=your_api_key_here
```

Get your free NASA API key at: https://api.nasa.gov/

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up your NASA API key in `.env.local`

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## API Reference

The app uses NASA's NeoWs (Near Earth Object Web Service) API:

- **Endpoint**: `https://api.nasa.gov/neo/rest/v1/feed`
- **Parameters**:
  - `start_date`: YYYY-MM-DD
  - `end_date`: YYYY-MM-DD
  - `api_key`: Your NASA API key

## Design Features

- **Color Scheme**:

  - Background: `#0a0f1a` (Deep space blue)
  - Cards: `#0f1722` (Dark blue-gray)
  - Borders: `#1a2332` (Medium blue-gray)
  - Accent: `#3b82f6` (Blue)

- **Animations**:

  - Twinkling stars
  - Smooth transitions
  - Hover effects

- **Typography**:
  - System fonts for optimal performance
  - Clear hierarchy
  - Accessible contrast ratios

## License

MIT
