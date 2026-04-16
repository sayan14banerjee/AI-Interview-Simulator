# Quick Start Guide - AI Interview Simulator Frontend

## Prerequisites
- Node.js v14+ and npm v6+
- Backend API running on `http://localhost:8000`

## Installation & Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env` and update if needed:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm start
```

The app will automatically open at `http://localhost:3000`

## Usage Flow

### 1. **Register/Login**
   - Click "Register here" to create a new account
   - Or login with existing credentials
   - Roles available: `candidate`, `admin`

### 2. **Dashboard**
   - Select job role (e.g., Software Engineer)
   - Choose difficulty level (beginner, intermediate, advanced)
   - Select interview type (technical, behavioral, system-design)
   - Click "Start Interview"

### 3. **Interview Session**
   - Answer questions displayed on screen
   - Use Previous/Next/Skip buttons to navigate
   - Track your progress in the sidebar
   - Submit each answer when ready

### 4. **View Results**
   - Get overall performance score
   - Read detailed feedback
   - View improvement suggestions
   - Identify your strengths

### 5. **Optional: Upload Resume**
   - Go to "Upload Resume" to personalize questions
   - Supports PDF and DOCX formats
   - Extracts skills and experience for better question matching

## Available Routes

- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Main dashboard
- `/upload-resume` - Resume upload page
- `/interview/:sessionId` - Interview session
- `/results/:sessionId` - Results page

## API Endpoints Used

### Authentication
- `POST /auth/register` - Create account
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout

### Interview
- `POST /interview/create` - Start new interview
- `POST /interview/{id}/generate-questions` - Get questions
- `POST /interview/{id}/submit-answer` - Submit answer
- `GET /interview/{id}/report` - Get results

### Resume
- `POST /resume/upload` - Upload resume

### User
- `GET /users/me` - Get profile
- `GET /users/admin/users` - Get all users (admin)

## Troubleshooting

### Issue: Backend Connection Failed
**Solution**: Ensure backend is running on port 8000
```bash
# In backend folder
uvicorn app.main:main --reload
```

### Issue: Tokens Not Persisting
**Solution**: Check browser localStorage permissions
- Open DevTools → Application → Local Storage
- Should see `access_token` and `refresh_token`

### Issue: Questions Not Loading
**Solution**: Make sure backend question generation is working
- Check backend logs for errors
- Try uploading a resume first for better results

### Issue: CORS Errors
**Solution**: Enable CORS in backend (should be pre-configured)
```python
# In app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    ...
)
```

## Development Commands

```bash
# Start development server with hot reload
npm start

# Build for production
npm run build

# Run tests
npm test

# Clean build
rm -rf build && npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── Interview.js
│   │   ├── Results.js
│   │   └── ResumeUpload.js
│   ├── api.js (API client with axios)
│   ├── App.js (Main component)
│   └── index.js (Entry point)
├── public/
│   └── index.html
├── package.json
└── README.md
```

## Key Features Implemented

✅ Complete authentication system (register, login, logout, token refresh)
✅ Interview session management with question generation
✅ Real-time answer submission with feedback
✅ Performance scoring and detailed reports
✅ Resume upload for personalization
✅ Responsive UI for mobile and desktop
✅ Error handling and user notifications
✅ JWT token management with auto-refresh
✅ Role-based access control

## Next Steps

1. Install dependencies: `npm install`
2. Start backend server
3. Run development server: `npm start`
4. Open browser and start practicing!

## Support & Documentation

For more details, see:
- [Frontend README](README.md)
- Backend API documentation at `http://localhost:8000/docs`

---

Happy interviewing! 🚀
