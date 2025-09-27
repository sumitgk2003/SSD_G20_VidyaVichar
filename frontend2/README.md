# VidyaVichara Frontend2

A clean, functional React application for the VidyaVichara classroom Q&A board system, built with Axios for backend integration.

## Features

- **Authentication System**: Student and Teacher registration/login
- **Class Management**: Teachers can create classes with access codes
- **Question Board**: Interactive sticky note system for Q&A
- **Real-time Interaction**: Students can post questions, teachers can manage them
- **Responsive Design**: Modern, mobile-friendly interface
- **Clean Architecture**: No Redux complexity, simple React Context for state management

## Tech Stack

- **React 18**: Modern React with hooks
- **Axios**: HTTP client for API calls
- **React Router**: Client-side routing
- **Vite**: Fast build tool and dev server
- **CSS3**: Modern styling with gradients and animations

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   ├── ClassCard.jsx   # Class display card
│   ├── CreateClassModal.jsx
│   ├── JoinClassModal.jsx
│   ├── QuestionForm.jsx
│   ├── QuestionBoard.jsx
│   ├── StickyNote.jsx
│   ├── FilterControls.jsx
│   └── ProtectedRoute.jsx
├── contexts/           # React Context for state management
│   └── AuthContext.jsx
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── DashboardPage.jsx
│   └── ClassroomPage.jsx
├── services/           # API service layer
│   ├── api.js         # Axios configuration
│   ├── authService.js
│   ├── classService.js
│   └── questionService.js
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Backend server running on port 8000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5174`

## API Integration

The application integrates with the backend APIs:

### Authentication
- `POST /api/v1/student/register` - Student registration
- `POST /api/v1/teacher/register` - Teacher registration
- `POST /api/v1/student/login` - Student login
- `POST /api/v1/teacher/login` - Teacher login
- `POST /api/v1/student/logout` - Student logout
- `POST /api/v1/teacher/logout` - Teacher logout

### Classes
- `POST /api/v1/teacher/createClass` - Create new class
- `GET /api/v1/student/getAllActiveClasses` - Get active classes

### Questions
- Uses localStorage as workaround for backend Query model limitations
- Questions are stored locally and persist across sessions

## Key Features

### For Students
- Register and login with roll number
- Join classes using access codes
- Post questions during lectures
- View question history

### For Teachers
- Register and login
- Create classes with auto-generated access codes
- View and manage student questions
- Mark questions as answered or important
- Filter questions by status
- Clear question board

## Design Philosophy

- **Simplicity**: No complex state management, just React Context
- **Functionality**: Focus on core features without bloat
- **User Experience**: Clean, intuitive interface
- **Responsive**: Works on all device sizes
- **Performance**: Fast loading and smooth interactions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Functional components with hooks
- Consistent naming conventions
- Clean, readable code structure
- Proper error handling

## Deployment

1. Build the application:
```bash
npm run build
```

2. Serve the `dist` folder with any static file server

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Test all functionality
4. Update documentation as needed

## License

This project is part of the VidyaVichara classroom Q&A system.
