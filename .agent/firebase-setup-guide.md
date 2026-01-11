# Firebase Setup Guide for LuxeStay Hotel Management System

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** (or "Add project")
3. Enter project name: `luxestay-hotel-management`
4. Enable Google Analytics (optional but recommended)
5. Click **"Create Project"**

## Step 2: Enable Authentication

1. In the Firebase Console, click on **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable the following providers:
   - **Email/Password**: Click on it → Toggle "Enable" → Save
   - **Google**: Click on it → Toggle "Enable" → Add your project support email → Save

## Step 3: Create Firestore Database

1. Click on **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll add security rules later)
4. Select a location closest to your users (e.g., `asia-south1` for India)
5. Click **"Enable"**

## Step 4: Enable Storage

1. Click on **"Storage"** in the left sidebar
2. Click **"Get started"**
3. Choose **"Start in test mode"**
4. Click **"Done"**

## Step 5: Register Web App

1. Go to **Project Settings** (gear icon in the sidebar)
2. Scroll down to **"Your apps"** section
3. Click the **web icon (</>)** to add a web app
4. Enter app nickname: `LuxeStay Web`
5. **Don't** check "Firebase Hosting" (we'll set this up later if needed)
6. Click **"Register app"**

## Step 6: Get Configuration

After registering, you'll see a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "luxestay-hotel-management.firebaseapp.com",
  projectId: "luxestay-hotel-management",
  storageBucket: "luxestay-hotel-management.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**IMPORTANT:** Copy these values - you'll need them for the `.env` file!

---

## Step 7: Provide Configuration

Once you have the configuration, provide me with:
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

Or simply paste the entire `firebaseConfig` object.

---

## Notes

- **Test Mode**: We're starting in test mode for development. Before going to production, we'll add proper security rules.
- **Free Tier**: Firebase Free Tier is quite generous:
  - 50K reads/day, 20K writes/day, 20K deletes/day
  - 1GB Firestore storage
  - 5GB Storage
  - 10K authentications/month

---

*Go to https://console.firebase.google.com/ and follow the steps above!*
