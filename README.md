# AI Interview Simulator

An AI-powered online interview simulator that helps candidates practice and improve their interview skills. The application uses advanced AI to generate contextual interview questions and provide detailed feedback on candidate responses.

## 🌟 Features

### For Candidates
- 🎯 **AI-Generated Questions**: Context-aware questions based on job role, difficulty, and interview type
- 📝 **Real-time Feedback**: Instant evaluation and scoring of answers
- 📊 **Performance Reports**: Detailed analysis with strengths and improvement areas
- 📄 **Resume Integration**: Upload resume for personalized question generation
- 🎬 **Multiple Interview Types**: Technical, behavioral, and system design interviews
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### For Admins
- 👥 **User Management**: View and manage all users
- 📈 **Analytics**: Track user performance and interview statistics
- 🔐 **Role-Based Access**: Secure admin panel with role verification

## 📋 Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLAlchemy ORM with SQL database
- **Authentication**: JWT (JSON Web Tokens)
- **LLM Integration**: AI service for question generation and evaluation
- **File Storage**: AWS S3 for resume storage

### Frontend
- **Framework**: React.js 18
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Styling**: Custom CSS with responsive design
- **State Management**: React Hooks

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 14+
- npm 6+
- Docker (optional)

### Backend Setup

1. **Install dependencies**
```bash
pip install -r requirements.txt
```

2. **Configure environment variables**
Create a `.env` file with:
```env
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
LLM_API_KEY=your_llm_api_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
```

3. **Run the backend server**
```bash
uvicorn app.main:main --reload
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend folder**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

Frontend will open at `http://localhost:3000`

## 🐳 Docker Setup

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
AI_Interview_Simulator/
├── app/                          # Backend application
│   ├── models/                   # Database models
│   │   ├── user.py
│   │   ├── interview.py
│   │   ├── answer.py
│   │   ├── evaluation.py
│   │   ├── resume.py
│   │   └── refresh_token.py
│   ├── routes/                   # API endpoints
│   │   ├── auth_routes.py
│   │   ├── interview_routes.py
│   │   ├── resume_routes.py
│   │   └── user_routes.py
│   ├── schemas/                  # Pydantic schemas
│   ├── services/                 # Business logic
│   │   ├── auth_service.py
│   │   ├── interview_service.py
│   │   ├── evaluation_service.py
│   │   ├── llm_service.py
│   │   └── resume_service.py
│   ├── utils/                    # Utilities
│   │   ├── jwt_handler.py
│   │   ├── security.py
│   │   ├── roles.py
│   │   ├── dependencies.py
│   │   └── upload_s3.py
│   ├── config.py                 # Configuration
│   ├── database.py               # Database setup
│   └── main.py                   # FastAPI app
├── frontend/                     # React application
│   ├── src/
│   │   ├── pages/               # Page components
│   │   ├── api.js               # API client
│   │   ├── App.js               # Main component
│   │   └── index.js             # Entry point
│   ├── public/
│   ├── package.json
│   └── README.md
├── requirements.txt              # Python dependencies
├── Dockerfile                    # Backend Docker image
├── docker-compose.yml           # Docker compose config
└── README.md                    # This file
```

## 🔑 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get tokens
- `GET /auth/me` - Get current user info
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user
- `GET /auth/admin-only` - Admin-only endpoint

### Interview Management
- `POST /interview/create` - Create new interview session
- `POST /interview/{session_id}/generate-questions` - Generate interview questions
- `POST /interview/{question_id}/submit-answer` - Submit answer for evaluation
- `GET /interview/{session_id}/report` - Get interview report and feedback

### Resume Management
- `POST /resume/upload` - Upload and process resume

### User Management
- `GET /users/me` - Get user profile
- `GET /users/admin/users` - Get all users (admin only)
- `GET /users/admin/user/{user_id}` - Get specific user profile (admin only)

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Registration**: Users create account with email, password, and role
2. **Login**: Returns `access_token` and `refresh_token`
3. **Token Refresh**: Automatically refreshes expired tokens
4. **Role-Based Access**: Different endpoints for candidate and admin roles

### Roles
- `candidate` - Standard user role for interview practice
- `admin` - Administrator role with extended permissions

## 🎮 Usage

### 1. Register/Login
- Create account on registration page
- Login with email and password

### 2. Start Interview
- Select job role (Software Engineer, Data Scientist, etc.)
- Choose difficulty level (Beginner, Intermediate, Advanced)
- Select interview type (Technical, Behavioral, System Design)
- Click "Start Interview"

### 3. Answer Questions
- Read question carefully
- Type your answer in the text area
- Navigate between questions using Previous/Next buttons
- Submit answer when ready

### 4. Review Results
- View overall performance score
- Read detailed feedback on each answer
- Get improvement suggestions
- Identify your strengths

### 5. Upload Resume (Optional)
- Upload PDF or DOCX resume
- AI extracts skills and experience
- Questions are customized based on your background

## 🤖 AI Integration

The system uses LLM services to:
- **Generate Questions**: Context-aware questions based on role and difficulty
- **Evaluate Answers**: Score answers on various criteria
- **Provide Feedback**: Detailed feedback and improvement suggestions
- **Extract Resume Info**: Parse resume for skills and experience

## 📊 Database Schema

### Users
- id, email, name, password_hash, role, created_at

### Resumes
- id, user_id, file_url, extracted_skills, experience_years, summary

### Interview Sessions
- id, user_id, role, difficulty, interview_type, status, created_at, completed_at

### Answers
- id, question_id, session_id, answer_text, response_time

### Evaluations
- id, answer_id, question_id, final_score, feedback, improvement_suggestions

## 🧪 Testing

### Backend Tests
```bash
# Run pytest
pytest

# Run with coverage
pytest --cov=app
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📈 Performance Optimization

- **Frontend**: Code splitting, lazy loading, memoization
- **Backend**: Database query optimization, caching
- **API**: Request throttling, compression

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS configuration
- SQL injection protection via ORM
- Role-based access control
- Secure token refresh mechanism

## 🐛 Troubleshooting

### Backend Issues
- Check if port 8000 is available
- Verify database connection
- Check LLM API key configuration

### Frontend Issues
- Ensure backend is running
- Check browser console for errors
- Clear browser cache and localStorage

### Connection Issues
- Verify CORS is enabled
- Check firewall settings
- Ensure both services are running

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
LLM_API_KEY=your_api_key
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy build folder
```

### Backend (Heroku/AWS/DigitalOcean)
```bash
# Using Docker
docker build -t interview-simulator .
docker run -p 8000:8000 interview-simulator
```

## 📚 Documentation

- [Backend README](README.md)
- [Frontend README](frontend/README.md)
- [Frontend Quick Start](frontend/QUICK_START.md)
- API Docs: `http://localhost:8000/docs`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Authors

AI Interview Simulator Development Team

## 📞 Support

For issues and support:
- Check the troubleshooting section
- Review API documentation at `/docs`
- Check logs for error details

## 🎯 Future Enhancements

- [ ] Video recording of interviews
- [ ] AI voice interaction
- [ ] Difficulty adjustment based on performance
- [ ] Interview history and analytics
- [ ] Team collaboration features
- [ ] Mobile app (React Native)
- [ ] Real-time code editor for technical interviews
- [ ] Interview scheduling and reminders

---

**Happy Interviewing! 🎉**

Start practicing today and improve your interview skills with AI-powered feedback.
