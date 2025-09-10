# Product Management Guide - Backend Integration Contracts

## API Contracts

### Authentication Endpoints
```
POST /api/auth/register
- Body: { email, password, name }
- Response: { user, token }

POST /api/auth/login  
- Body: { email, password }
- Response: { user, token }

POST /api/auth/logout
- Headers: Authorization: Bearer <token>
- Response: { message }

GET /api/auth/me
- Headers: Authorization: Bearer <token>
- Response: { user }
```

### User Progress Endpoints
```
GET /api/progress
- Headers: Authorization: Bearer <token>
- Response: { 
    completedSections: [sectionIds],
    assessmentScores: { scenarioId: score },
    lastAccessedModule: string,
    totalProgress: number
  }

POST /api/progress/section
- Headers: Authorization: Bearer <token>
- Body: { sectionId, moduleId, completed }
- Response: { progress }

POST /api/progress/assessment
- Headers: Authorization: Bearer <token>
- Body: { assessmentId, answers, score }
- Response: { assessment }
```

### Tools & Framework Endpoints
```
POST /api/tools/rice-calculation
- Headers: Authorization: Bearer <token>
- Body: { reach, impact, confidence, effort, featureName }
- Response: { calculation, saved }

GET /api/tools/rice-history
- Headers: Authorization: Bearer <token>
- Response: { calculations: [{ id, featureName, score, date }] }

POST /api/tools/user-story
- Headers: Authorization: Bearer <token>
- Body: { stories: [{ story, category, priority }] }
- Response: { saved }
```

### Content Endpoints
```
GET /api/content/modules
- Response: { modules: [{ id, title, description, sections }] }

GET /api/content/frameworks
- Response: { frameworks: [discovery, metrics, etc.] }

GET /api/content/case-studies
- Response: { caseStudies: [scenarios with solutions] }
```

## Database Models

### User Model
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (default: 'learner'),
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

### UserProgress Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  completedSections: [String], // section IDs
  moduleProgress: {
    'pm-basics': { completed: Boolean, completedAt: Date },
    'discovery': { completed: Boolean, completedAt: Date },
    'product-sense': { completed: Boolean, completedAt: Date },
    'metrics': { completed: Boolean, completedAt: Date },
    'ai-era': { completed: Boolean, completedAt: Date },
    'tools': { completed: Boolean, completedAt: Date }
  },
  assessmentScores: [{
    assessmentId: String,
    score: Number,
    answers: Object,
    completedAt: Date
  }],
  totalProgress: Number, // percentage
  lastAccessedModule: String,
  createdAt: Date,
  updatedAt: Date
}
```

### RiceCalculation Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  featureName: String,
  reach: Number,
  impact: Number,
  confidence: Number,
  effort: Number,
  score: Number,
  createdAt: Date
}
```

### UserStory Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  stories: [{
    story: String,
    category: String,
    priority: String,
    formattedStory: String
  }],
  projectName: String,
  createdAt: Date
}
```

## Mock Data to Replace

### Frontend Mock Data (from mockData.js)
1. **Static content data** - Move to database or keep as static
2. **User progress tracking** - Replace with API calls
3. **Assessment results** - Store in database
4. **RICE calculations** - Save to database
5. **User stories** - Persist user creations

### Components requiring backend integration:

#### HomePage.jsx
- No changes needed (static content)

#### PMBasicsPage.jsx
- Replace `completedSections` state with API data
- Save section completion to backend
- Load user progress on mount

#### DiscoveryPage.jsx  
- Replace `completedActivities` state with API data
- Persist activity completion

#### ProductSensePage.jsx
- Save assessment results to backend  
- Load previous scores
- Track scenario completion

#### MetricsPage.jsx
- Save checklist progress
- Persist user metric preferences

#### AIEraPage.jsx
- Track section completion
- Save AI tool usage

#### InteractiveToolsPage.jsx
- Save RICE calculations to database
- Persist user stories
- Load calculation history

## Frontend & Backend Integration Plan

### Phase 1: Authentication Setup
1. Create authentication context in React
2. Add login/register pages
3. Implement JWT token management
4. Add protected routes

### Phase 2: Progress Tracking
1. Replace local state with API calls
2. Add progress persistence
3. Implement progress loading
4. Add user dashboard

### Phase 3: Interactive Tools Backend
1. Save RICE calculations
2. Persist user stories  
3. Add calculation history
4. Template downloads

### Phase 4: Enhanced Features
1. User analytics
2. Learning recommendations
3. Export capabilities
4. Social features (optional)

## Implementation Priority
1. ✅ Authentication system
2. ✅ User progress tracking  
3. ✅ RICE calculator persistence
4. ✅ Assessment results storage
5. User stories persistence
6. Analytics and insights

## Security Considerations
- JWT token expiration (24 hours)
- Password hashing with bcrypt
- Input validation on all endpoints
- Rate limiting on auth endpoints
- CORS configuration
- SQL injection prevention (MongoDB)