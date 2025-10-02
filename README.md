# PM Guide - Vercel Deployment

A comprehensive Product Management learning platform with React frontend and Python serverless backend.

## 🚀 Deployment on Vercel

This project has been restructured for seamless Vercel deployment with the following architecture:

### Frontend (React)
- React 19 with Tailwind CSS and Radix UI components
- Located in the root directory
- Built using standard React Scripts (no CRACO dependency)

### Backend (Python Serverless Functions)
- Python serverless functions in `/api` directory
- MongoDB with Motor async driver for data persistence
- JWT authentication
- Individual functions for each endpoint

## 📁 Project Structure

```
/
├── src/                     # React frontend source
├── public/                  # Static assets
├── api/                     # Python serverless functions
│   ├── utils/              # Shared utilities
│   ├── auth/               # Authentication endpoints
│   ├── progress/           # Progress tracking endpoints
│   └── tools/              # Interactive tools endpoints
├── package.json            # Frontend dependencies
├── requirements.txt        # Backend dependencies
└── vercel.json            # Vercel configuration
```

## ⚙️ Environment Setup

### Required Environment Variables

Set these in your Vercel project settings:

```bash
# Database
MONGO_URL=mongodb://your-mongo-connection-string
DB_NAME=your-database-name

# Security
SECRET_KEY=your-secret-key-change-in-production

# Frontend (optional - leave empty for same-domain API)
REACT_APP_BACKEND_URL=
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Progress Tracking
- `GET /api/progress` - Get user progress
- `POST /api/progress/section` - Update section progress
- `POST /api/progress/assessment` - Submit assessment

### Tools
- `POST /api/tools/rice-calculation` - Save RICE calculation
- `GET /api/tools/rice-history` - Get RICE calculation history
- `POST /api/tools/user-story` - Save user stories
- `GET /api/tools/user-story` - Get user stories

## 📦 Dependencies

### Frontend
- React 19 with React Router
- Axios for API calls
- Tailwind CSS + Radix UI for styling
- React Hook Form for forms

### Backend
- Motor (MongoDB async driver)
- PyJWT for authentication
- Passlib for password hashing
- Pydantic for data validation

## 🔧 Local Development

1. Install frontend dependencies:
```bash
npm install
```

2. Start the React development server:
```bash
npm start
```

3. For API testing, you'll need to set up the Python environment:
```bash
pip install -r requirements.txt
```

## 🚀 Deployment Steps

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy - Vercel will automatically:
   - Build the React frontend
   - Set up Python serverless functions
   - Configure API routes

## 🎯 Features

- **User Management**: Registration, login, progress tracking
- **Learning Modules**: PM Basics, Discovery, Product Sense, Metrics, AI Era, Tools
- **Interactive Tools**: RICE prioritization calculator, User story generator
- **Progress Tracking**: Section completion, assessments, overall progress
- **Responsive Design**: Mobile-friendly interface

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration for cross-origin requests
- Input validation with Pydantic models

---

**Original Custom AI Platform Architecture Converted to Vercel-Compatible Structure**