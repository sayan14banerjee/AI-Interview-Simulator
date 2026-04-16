# AI Interview Simulator - Frontend

A modern React.js frontend for the AI Interview Simulator application. This frontend provides a complete user interface for practicing interview skills with AI-generated questions.

## Features

- **User Authentication**: Register and login with JWT tokens
- **Interview Sessions**: Start mock interviews with customizable configurations
- **Question Display**: Interactive question panels with real-time feedback
- **Answer Submission**: Submit answers with time tracking
- **Performance Reports**: Detailed analysis and feedback on your answers
- **Resume Upload**: Upload resumes to personalize interview questions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Backend API running at `http://localhost:8000`

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Configuration

The API base URL is configured in `src/api.js`. By default, it's set to:
```javascript
const API_URL = 'http://localhost:8000';
```

Update this if your backend is running on a different URL.

## Running the Application

Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## Build for Production

Create an optimized production build:
```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.js              # Login page
│   │   ├── Register.js           # Registration page
│   │   ├── Dashboard.js          # Main dashboard
│   │   ├── Interview.js          # Interview session component
│   │   ├── Results.js            # Results and feedback page
│   │   ├── ResumeUpload.js       # Resume upload page
│   │   └── *.css                 # Styling for each page
│   ├── api.js                    # API client and interceptors
│   ├── App.js                    # Main app component
│   ├── App.css                   # Global styles
│   └── index.js                  # Entry point
├── public/
│   └── index.html                # HTML template
├── package.json                  # Dependencies and scripts
└── .gitignore                    # Git ignore rules
```

## Key Components

### Authentication Flow
- Users can register with email, password, and role
- Login uses JWT tokens (access and refresh tokens)
- Automatic token refresh on 401 responses
- Secure token storage in localStorage

### Interview Session
- Select job role, difficulty level, and interview type
- Answer AI-generated questions
- Track answer submission time
- Navigate between questions
- Real-time progress tracking

### Results Analysis
- Overall performance score
- Detailed feedback for each question
- Improvement suggestions
- Strengths identification
- Performance metrics

## API Integration

The frontend communicates with the backend API through these endpoints:

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

### Resume
- `POST /resume/upload` - Upload and process resume

### Interview
- `POST /interview/create` - Create interview session
- `POST /interview/{session_id}/generate-questions` - Generate questions
- `POST /interview/{question_id}/submit-answer` - Submit answer
- `GET /interview/{session_id}/report` - Get performance report

### User
- `GET /users/me` - Get user profile
- `GET /users/admin/users` - Get all users (admin only)
- `GET /users/admin/user/{user_id}` - Get specific user (admin only)

## Styling

The application uses custom CSS with a modern gradient design:
- Primary color: #667eea (purple-blue)
- Secondary color: #764ba2 (dark purple)
- Accent colors for success, error, and warning states

All components are responsive and optimized for mobile devices.

## Error Handling

- API errors are caught and displayed to users
- Automatic token refresh on authentication failures
- Graceful fallbacks for missing data
- User-friendly error messages

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of pages
- Memoization of components
- API request throttling and caching

## Development Tips

1. **Enable Redux DevTools** for state management debugging
2. **Use React DevTools** for component inspection
3. **Check console** for API errors and warnings
4. **Test with different network speeds** using browser DevTools

## Troubleshooting

### Backend Connection Issues
- Ensure backend is running on `http://localhost:8000`
- Check CORS configuration in backend
- Verify API endpoints are accessible

### Authentication Issues
- Clear localStorage if tokens become invalid
- Check JWT token expiration settings
- Verify refresh token endpoint is working

### Interview Questions Not Loading
- Ensure resume is uploaded (optional but recommended)
- Check backend is generating questions correctly
- Verify session ID is valid

## Future Enhancements

- [ ] Real-time video recording of answers
- [ ] AI voice interaction
- [ ] Difficulty adjustment based on performance
- [ ] Interview history and analytics
- [ ] Team/admin dashboard
- [ ] Mock interview scheduling
- [ ] Question bank customization

## Support

For issues and questions, please refer to the backend documentation or contact the development team.

## License

This project is part of the AI Interview Simulator project.
