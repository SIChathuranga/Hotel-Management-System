# 🏨 LuxeStay - Hotel Management System

<div align="center">

![LuxeStay Banner](https://www.appetitesabroad.com/wp-content/uploads/2020/03/hotel-pool.jpg)

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10.x-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

A comprehensive, modern hotel management system built with React and Firebase. Features a beautiful customer-facing portal and a powerful admin dashboard for complete hotel operations management.

[Live Demo](#) • [Documentation](#documentation) • [Report Bug](../../issues) • [Request Feature](../../issues)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Firebase Setup](#-firebase-setup)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Team Members](#-team-members)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Customer Portal
- 🏠 **Beautiful Landing Page** - Animated hero section, testimonials, and hotel information
- 🛏️ **Room Browsing** - Filter and explore available rooms with detailed information
- 📅 **Online Booking** - Multi-step booking wizard with date selection and payment
- 👤 **Guest Account** - View booking history and manage profile
- 🌙 **Dark/Light Mode** - Theme toggle for comfortable viewing

### Admin Dashboard
- 📊 **Dashboard Analytics** - Real-time statistics and charts
- 🏨 **Room Management** - Add, edit, delete rooms and room types
- 📆 **Booking System** - Calendar view, availability checking, reservations
- 👥 **Guest Management** - Guest profiles, history, loyalty program
- 👔 **Staff Management** - Employee records, departments, scheduling
- 🧹 **Housekeeping** - Task assignment, room status tracking
- 🍽️ **Restaurant** - Menu management, table booking, orders
- 💰 **Billing & Invoicing** - Invoice creation, payment tracking
- 📈 **Reports** - Revenue, occupancy, and performance reports
- ⚙️ **Settings** - System configuration and user preferences

### Technical Features
- 🔐 **Firebase Authentication** - Secure login with email/password
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Glassmorphism, animations, premium design
- 🌐 **Mock Data Support** - Works without Firebase for development
- 🔄 **Real-time Updates** - Live data synchronization (when Firebase enabled)

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, React Router 6, React Hook Form |
| **Build Tool** | Vite 5 |
| **Styling** | CSS3 (Custom Design System), CSS Variables |
| **Backend** | Firebase (Authentication, Firestore, Storage) |
| **State Management** | React Context API |
| **Charts** | Recharts |
| **Icons** | React Icons (Feather Icons) |
| **Notifications** | React Hot Toast |
| **Animations** | Framer Motion, CSS Animations |
| **Date Handling** | date-fns |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Firebase account (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Hotel-Management-System.git
   cd Hotel-Management-System
   ```

2. **Navigate to the app directory**
   ```bash
   cd luxestay-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Firebase configuration (see [Firebase Setup](#-firebase-setup))

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 📁 Project Structure

```
luxestay-app/
├── public/                 # Static assets
├── src/
│   ├── admin/              # Admin dashboard
│   │   ├── layouts/        # AdminLayout, Header, Sidebar
│   │   └── pages/          # All admin pages
│   ├── customer/           # Customer portal
│   │   ├── layouts/        # CustomerLayout
│   │   └── pages/          # Home, Rooms, Booking, Profile
│   ├── firebase/           # Firebase configuration
│   │   ├── config.js       # Firebase init
│   │   ├── auth.js         # Authentication helpers
│   │   └── services/       # Firestore services
│   │       ├── roomService.js
│   │       ├── bookingService.js
│   │       ├── guestService.js
│   │       ├── staffService.js
│   │       ├── housekeepingService.js
│   │       ├── restaurantService.js
│   │       ├── billingService.js
│   │       └── inventoryService.js
│   ├── shared/             # Shared resources
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # AuthContext, ThemeContext
│   │   └── styles/         # Global CSS, variables, animations
│   ├── App.jsx             # Main App component
│   ├── main.jsx            # Entry point
│   └── router.jsx          # Route configuration
├── .env.example            # Environment template
├── package.json
└── vite.config.js
```

---

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" and follow the steps
3. Enable Google Analytics (optional)

### 2. Enable Authentication

1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider

### 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **test mode** for development
4. Choose a location close to your users

### 4. Get Configuration

1. Go to **Project Settings** > **General**
2. Scroll to "Your apps" and click **Web** (</>)
3. Register your app and copy the config

### 5. Firestore Security Rules

For production, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read all collections
    match /{collection}/{document=**} {
      allow read: if request.auth != null;
    }
    
    // Bookings: authenticated users can create, owners can update
    match /bookings/{bookingId} {
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Admin only collections
    match /rooms/{roomId} {
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'manager'];
    }
    
    match /staff/{staffId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## 🔐 Environment Variables

Create a `.env` file in the `luxestay-app` directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Optional: Enable/disable features
VITE_USE_MOCK_DATA=false
```

**Note:** Without Firebase configuration, the app automatically uses mock data for development.

---

## 📖 Usage

### Customer Portal

| URL | Description |
|-----|-------------|
| `/` | Landing page with hotel information |
| `/rooms` | Browse available rooms |
| `/book/:roomId` | Book a specific room |
| `/profile` | View booking history (requires login) |

### Admin Dashboard

| URL | Description |
|-----|-------------|
| `/admin` | Dashboard with statistics |
| `/admin/rooms` | Manage rooms |
| `/admin/bookings` | Manage reservations |
| `/admin/guests` | Guest management |
| `/admin/staff` | Staff management |
| `/admin/housekeeping` | Housekeeping tasks |
| `/admin/restaurant/orders` | Restaurant orders |
| `/admin/billing` | Invoicing |
| `/admin/reports` | Analytics |
| `/admin/settings` | System settings |

### Default Admin Account

For testing with mock data:
- **Email:** admin@luxestay.com
- **Password:** admin123

---

## 📚 API Documentation

### Services Overview

All services follow a consistent response pattern:

```javascript
// Success response
{ success: true, data: [...] }

// Error response
{ success: false, error: "Error message" }
```

### Room Service

```javascript
import { getRooms, getRoomById, createRoom, updateRoom, deleteRoom } from './services/roomService';

// Get all rooms
const { success, data } = await getRooms();

// Get single room
const { success, data } = await getRoomById(roomId);

// Create room
const { success, data } = await createRoom({ roomNumber, roomTypeId, floor, price });

// Update room
const { success, data } = await updateRoom(roomId, updates);

// Delete room
const { success } = await deleteRoom(roomId);
```

### Booking Service

```javascript
import { getBookings, createBooking, updateBooking } from './services/bookingService';

// Get all bookings
const { success, data } = await getBookings();

// Create booking
const { success, data } = await createBooking({
  roomId,
  guestName,
  checkInDate,
  checkOutDate,
  totalAmount
});

// Update booking status
const { success } = await updateBooking(bookingId, { status: 'checked_in' });
```

---

## 📸 Screenshots

### Customer Landing Page
- Hero section with animations
- Featured rooms showcase
- Testimonials and services
- Dark/Light mode support

### Admin Dashboard
- Real-time statistics
- Interactive charts
- Quick actions

### Room Management
- Grid view with filters
- Room details and images
- Add/Edit forms

### Booking Calendar
- Visual availability view
- Drag-to-book support
- Status color coding

---

## 👥 Team Members

| Name | Role | Student ID |
|------|------|------------|
| Member 1 | Project Lead / Full Stack Developer | IT00000001 |
| Member 2 | Frontend Developer | IT00000002 |
| Member 3 | Backend Developer | IT00000003 |
| Member 4 | UI/UX Designer | IT00000004 |
| Member 5 | QA Engineer | IT00000005 |

> **Note:** Update this section with actual team member information from the project proposal.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Use functional components with hooks
- Follow the existing CSS naming conventions
- Write meaningful commit messages
- Test your changes before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Library
- [Vite](https://vitejs.dev/) - Build Tool
- [Firebase](https://firebase.google.com/) - Backend Services
- [Feather Icons](https://feathericons.com/) - Icon Set
- [Unsplash](https://unsplash.com/) - Stock Images

---

<div align="center">

**Made with ❤️ by the LuxeStay Development Team**

[⬆ Back to Top](#-luxestay---hotel-management-system)

</div>
