# Money Management App

A personal money management React web application with offline-first architecture and Google Drive backup support.

## Features

- ✅ **Track Income & Expenses** - Add, edit, and delete transactions
- 📊 **Reports & Analytics** - Visual charts and spending insights
- 💾 **Offline-First** - Works without internet using IndexedDB/LocalStorage
- ☁️ **Google Drive Backup** - Secure cloud backup and restore
- 🎯 **Goal Tracking** - Set and monitor savings goals
- 📈 **Spending Insights** - AI-powered spending pattern analysis
- 🔄 **Subscription Detection** - Automatically detect recurring payments
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🌙 **Dark Mode** - Light and dark theme support
- 📤 **Data Export** - Export data as JSON or CSV

## Tech Stack

- **Frontend**: React 18+ with Vite
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **Storage**: IndexedDB (with LocalStorage fallback)
- **Backup**: Google Drive API
- **Styling**: Vanilla CSS with CSS variables

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Copy the environment variables template:
\`\`\`bash
copy .env.example .env
\`\`\`

4. (Optional) Configure Google Drive API credentials in `.env`:
   - See "Google Drive Setup" section below

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open your browser and navigate to `http://localhost:3000`

## Google Drive Setup (Optional)

To enable Google Drive backup functionality:

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Drive API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"

### 2. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Configure the OAuth consent screen if prompted
4. Select "Web application" as the application type
5. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production URL (for deployment)
6. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - Your production URL (for deployment)
7. Click "Create"
8. Copy the Client ID and API Key

### 3. Configure Environment Variables

Edit the `.env` file and add your credentials:

\`\`\`env
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your_api_key_here
\`\`\`

### 4. Restart Development Server

After adding credentials, restart the development server:

\`\`\`bash
npm run dev
\`\`\`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

\`\`\`
src/
├── components/          # Reusable components
│   ├── ui/             # UI components (Button, Card, Input, etc.)
│   ├── charts/         # Chart components
│   ├── Layout.jsx      # Main layout with navigation
│   ├── BottomNav.jsx   # Bottom navigation bar
│   ├── TransactionForm.jsx
│   ├── TransactionList.jsx
│   ├── BalanceCard.jsx
│   └── InsightsPanel.jsx
├── pages/              # Page components
│   ├── Dashboard.jsx
│   ├── Transactions.jsx
│   ├── Reports.jsx
│   ├── Backup.jsx
│   └── Settings.jsx
├── services/           # Business logic services
│   ├── storageService.js
│   ├── analyticsService.js
│   └── backupService.js
├── context/            # React Context for state management
│   └── AppContext.jsx
├── models/             # Data models
│   ├── transactionModel.js
│   └── categoryModel.js
├── utils/              # Utility functions
│   ├── helpers.js
│   └── constants.js
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
\`\`\`

## Usage Guide

### Adding Transactions

1. Click the "Add Transaction" button on Dashboard or Transactions page
2. Fill in the amount, select type (Income/Expense), category, date, and optional notes
3. Click "Add Transaction" to save

### Viewing Reports

1. Navigate to the Reports page
2. View category breakdowns, monthly trends, and detected subscriptions
3. Charts update automatically based on your transaction data

### Backing Up Data

1. Navigate to the Backup page
2. Click "Sign in with Google" (requires Google Drive API setup)
3. Click "Backup Now" to save your data to Google Drive
4. Use "Restore from Backup" to restore data from Google Drive

### Exporting Data

1. Navigate to Settings page
2. Click "Export as JSON" for complete backup
3. Click "Export as CSV" for transaction data in spreadsheet format

### Changing Theme

1. Navigate to Settings page
2. Click the theme toggle button to switch between light and dark mode

## Data Storage

- **Primary Storage**: IndexedDB (browser database)
- **Fallback**: LocalStorage (if IndexedDB is unavailable)
- **Backup**: Google Drive (optional, requires setup)

All data is stored locally in your browser. No data is sent to any server except Google Drive when you explicitly backup.

## Browser Support

- Chrome (latest)
- Edge (latest)
- Firefox (latest)
- Safari (latest)

## Offline Functionality

The app works completely offline. You can:
- Add, edit, and delete transactions
- View reports and analytics
- Export data

Internet connection is only required for:
- Google Drive backup and restore
- Initial app load (if not cached)

## Security & Privacy

- All data is stored locally in your browser
- No data is sent to external servers (except Google Drive when backing up)
- Google Drive backups are stored in your personal Google Drive
- No analytics or tracking

## Troubleshooting

### Google Drive Backup Not Working

1. Verify credentials in `.env` file
2. Check that Google Drive API is enabled in Google Cloud Console
3. Ensure authorized origins and redirect URIs are correctly configured
4. Clear browser cache and restart development server

### Data Not Persisting

1. Check browser console for errors
2. Ensure browser supports IndexedDB
3. Check browser storage quota
4. Try clearing browser data and re-importing from backup

## License

This project is open source and available for personal use.

## Support

For issues or questions, please refer to the documentation or create an issue in the repository.
