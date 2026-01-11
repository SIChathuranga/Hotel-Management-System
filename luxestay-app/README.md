# LuxeStay Hotel Management System

A modern, premium hotel management system built with React and Firebase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account

### 1. Clone and Install

```bash
cd luxestay-app
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google)
3. Create a Firestore database
4. Enable Storage
5. Get your Firebase configuration

### 3. Set Up Environment Variables

Copy the example environment file and add your Firebase credentials:

```bash
copy .env.example .env
```

Edit `.env` with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## 📁 Project Structure

```
luxestay-app/
├── src/
│   ├── admin/                 # Admin Dashboard
│   │   ├── components/        # Admin-specific components
│   │   ├── layouts/          # Admin layout (Sidebar, Header)
│   │   └── pages/            # Admin pages
│   ├── customer/             # Customer Portal
│   │   ├── components/
│   │   ├── layouts/
│   │   └── pages/
│   ├── shared/               # Shared resources
│   │   ├── components/ui/    # Reusable UI components
│   │   ├── context/          # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── styles/           # Global styles
│   │   └── utils/            # Utility functions
│   ├── firebase/             # Firebase configuration
│   │   ├── config.js         # Firebase initialization
│   │   ├── auth.js           # Auth service
│   │   └── services/         # Firestore services
│   ├── App.jsx               # Root component
│   ├── main.jsx              # Entry point
│   └── router.jsx            # Route configuration
├── public/
├── .env.example              # Environment template
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Design System

### Colors
- **Primary Gold**: #D4AF37
- **Primary Dark**: #1A1A2E
- **Secondary Cream**: #F5F1E8

### Typography
- **Headings**: Playfair Display
- **Body**: Inter
- **Accent**: Outfit

## 🔐 Authentication

The system supports:
- Email/Password authentication
- Google Sign-In
- Password reset
- Role-based access control

### User Roles
- `admin` - Full system access
- `manager` - Management features
- `receptionist` - Front desk operations
- `staff` - Limited access
- `customer` - Guest portal access

## 📦 Dependencies

- **React 18** - UI library
- **React Router 6** - Routing
- **Firebase 10** - Backend services
- **Framer Motion** - Animations
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Recharts** - Charts
- **React Icons** - Icon library

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📄 License

MIT License

---

**LuxeStay** - Premium Hotel Management System
