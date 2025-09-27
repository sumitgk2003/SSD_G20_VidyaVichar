# VidyaVichara - Interactive Q&A Sticky Board

A modern, responsive web application built with the MERN stack for real-time classroom Q&A sessions. Students can post questions during lectures, and instructors can view, organize, and manage them as colorful sticky notes.

## Features

### 🎓 Student Features
- **Role-based Authentication**: Secure login/registration for students
- **Join Classes**: Enter access codes to join instructor-created classes
- **Real-time Questions**: Post questions during lectures without interrupting the flow
- **Interactive UI**: Beautiful, responsive interface optimized for all devices

### 👨‍🏫 Instructor Features
- **Class Management**: Create classes with auto-generated access codes
- **Question Organization**: View all student questions as colorful sticky notes
- **Smart Filtering**: Filter questions by status (answered/unanswered/important)
- **Question Management**: Mark questions as answered or important
- **Board Controls**: Clear the board when needed

### 🎨 UI/UX Features
- **Colorful Sticky Notes**: Questions appear as vibrant, randomly colored sticky notes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support**: Automatic dark mode based on system preferences
- **Smooth Animations**: Engaging transitions and hover effects
- **Accessibility**: WCAG compliant with proper focus management

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Redux Toolkit** - State management with RTK Query for API calls
- **React Router** - Client-side routing with protected routes
- **CSS3** - Custom CSS with CSS Grid, Flexbox, and animations
- **Vite** - Fast build tool and development server

### Backend Integration
- **Express.js** - RESTful API endpoints
- **MongoDB** - Document database for persistent storage
- **JWT Authentication** - Secure token-based authentication
- **Cookie-based Sessions** - HttpOnly cookies for security

## Project Structure

```
frontend2/
├── src/
│   ├── app/features/          # Redux store and slices
│   │   ├── authSlice.js       # Authentication state
│   │   ├── classSlice.js      # Class management state
│   │   ├── boardSlice.js      # Q&A board state
│   │   └── store.js           # Redux store configuration
│   ├── components/            # Reusable UI components
│   │   ├── common/            # Generic components (Button, Modal, etc.)
│   │   ├── dashboard/         # Dashboard-specific components
│   │   ├── board/             # Q&A board components
│   │   └── layout/            # Layout components (Header, etc.)
│   ├── pages/                 # Page components
│   │   ├── HomePage.jsx       # Landing page
│   │   ├── LoginPage.jsx      # Student/Instructor login
│   │   ├── SignupPage.jsx     # Student/Instructor registration
│   │   ├── DashboardPage.jsx  # Main dashboard
│   │   ├── ClassroomPage.jsx  # Q&A board interface
│   │   └── NotFoundPage.jsx   # 404 page
│   ├── routes/                # Routing configuration
│   │   ├── AppRoutes.jsx      # Main routing setup
│   │   └── ProtectedRoute.jsx # Route protection
│   ├── services/              # API service layer
│   │   ├── authService.js     # Authentication API calls
│   │   ├── classService.js    # Class management API calls
│   │   └── questionService.js # Q&A API calls
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # App entry point
│   └── index.css              # Global styles
├── public/                    # Static assets
├── vite.config.js             # Vite configuration
└── package.json               # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Backend server running on port 8000
- MongoDB instance

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd frontend2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE=http://localhost:8000
VITE_PROXY_TARGET=http://localhost:8000
```

## Usage

### For Students
1. **Register/Login**: Choose "Student" role and create an account
2. **Join Class**: Use the access code provided by your instructor
3. **Ask Questions**: Click "Ask Question" and post your queries
4. **View Responses**: See your questions appear as colorful sticky notes

### For Instructors
1. **Register/Login**: Choose "Instructor" role and create an account
2. **Create Class**: Set up a new class and get an access code
3. **Share Code**: Provide the access code to students
4. **Manage Questions**: View, filter, and organize student questions
5. **Mark Status**: Mark questions as answered or important

## Key Features Explained

### Sticky Note System
- Questions appear as colorful sticky notes with random rotations
- Each note shows author, timestamp, and question text
- Instructors can mark notes as answered or important
- Visual feedback with different colors and animations

### Real-time Updates
- Questions appear immediately after posting
- Status changes reflect instantly
- Smooth animations and transitions
- Optimistic updates for better UX

### Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Adaptive layouts for all screen sizes
- Optimized for both portrait and landscape orientations

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- Functional components with hooks
- Redux Toolkit for state management
- CSS modules for component styling
- Consistent naming conventions
- Comprehensive error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the VidyaVichara educational platform.

## Support

For support or questions, please contact the development team.