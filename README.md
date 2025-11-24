# Christmas Party Survey 🎄

A React web app for collecting Christmas party preferences.

## Features

- Survey with two options:
  - Small cocktail bar and champagne 🍸
  - Just champagne only 🥂
- Real-time results tracking with Cloud Firestore
- All users see the same synchronized results
- Clean, modern UI with festive styling
- Responsive design for mobile and desktop

## Firebase Setup

This app uses Cloud Firestore to store and sync survey responses in real-time.

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Once created, click on the web icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "Christmas Survey")
5. Copy the Firebase configuration object

### 2. Enable Cloud Firestore

1. In Firebase Console, go to "Build" > "Firestore Database"
2. Click "Create Database"
3. Choose a location (e.g., us-central)
4. Start in **test mode** for development (you can secure it later)
5. Click "Enable"

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your Firebase credentials from step 1:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```

### 4. Security Rules (Optional but Recommended)

For production, update your Cloud Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /surveys/christmas-party {
      allow read: if true;
      allow write: if request.resource.data.keys().hasAll(['cocktailBar', 'champagneOnly'])
                   && request.resource.data.cocktailBar is int
                   && request.resource.data.champagneOnly is int;
    }
  }
}
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- React 18
- Vite
- Cloud Firestore
- CSS3