# 🚀 FocusFlow AI - AI-Powered Productivity Platform

A comprehensive productivity web application powered by AI (Google Gemini API with gemini-1.5-flash) to help you manage tasks, track focus sessions, set goals, and boost your productivity.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🎯 Core Features
- **AI Task Planner** - Intelligent task prioritization with GPT-powered suggestions
- **Smart Focus Timer** - Pomodoro technique with AI-driven recommendations  
- **AI Notes & Summaries** - Automatic note summarization and key insight extraction
- **Goal Tracking** - Visual progress tracking with milestone management
- **Analytics Dashboard** - Comprehensive productivity insights and statistics
- **AI Coaching** - Personalized motivation and productivity guidance

### 🎨 UI/UX Highlights
- **Modern Glassmorphism Design** - Beautiful blur effects and transparent cards
- **Smooth Animations** - Powered by Framer Motion
- **Gradient Accents** - Purple & Aqua color scheme
- **Responsive Layout** - Works on all devices
- **Dark Mode** - Easy on the eyes
- **Premium Components** - Custom-designed UI elements

### 🔐 Security
- JWT Authentication with secure HTTP-only cookies
- Password hashing with bcrypt
- Protected API routes
- MongoDB injection prevention
- Refresh token rotation

## 📋 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Hot Toast** - Toast notifications
- **Heroicons** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless functions
- **MongoDB Atlas** - Cloud database (Free tier)
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

### AI Integration
- **Google Gemini API** - Fast AI inference
- **gemini-1.5-flash** - Optimized for speed and quality
- **gemini-1.5-pro** - Advanced model for complex tasks

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Step 1: Clone & Install
```bash
cd FocusFlow-AI
npm install
```

### Step 2: Environment Variables
Create a `.env.local` file in the root directory:

```env
# MongoDB Connection (replace with your connection string)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/focusflow?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_to_something_random

# JWT Expiration
JWT_EXPIRES_IN=7d

# Google Gemini API Key (get from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier (0.5 GB storage)

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select your preferred region
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access"
   - Add new database user
   - Save username and password

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Go to "Databases" → Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `focusflow`

### Step 4: Get Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. Paste into `.env.local`

### Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Deploy!

3. **Configure Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Redeploy if needed

### Alternative: Deploy Backend to Render

If you want to separate backend:

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Add environment variables
5. Deploy

## 📁 Project Structure

```
FocusFlow-AI/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/        # Authentication endpoints
│   │   ├── tasks/       # Task CRUD operations
│   │   ├── notes/       # Notes management
│   │   ├── goals/       # Goal tracking
│   │   ├── focus/       # Focus sessions
│   │   └── ai/          # AI endpoints (Gemini)
│   ├── auth/            # Auth pages (login/register)
│   ├── dashboard/       # Main dashboard
│   ├── tasks/           # Tasks page
│   ├── focus/           # Focus timer page
│   ├── notes/           # Notes page
│   ├── goals/           # Goals page
│   ├── analytics/       # Analytics page
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Landing page
│   └── globals.css      # Global styles
├── components/          # Reusable components
│   ├── Sidebar.tsx
│   └── TaskCard.tsx
├── contexts/            # React contexts
│   └── AuthContext.tsx
├── lib/                 # Utilities
│   ├── db.ts           # MongoDB connection
│   ├── auth.ts         # Auth utilities
│   ├── groq.ts         # Gemini AI functions (legacy filename)
│   └── middleware.ts   # API middleware
├── models/              # Mongoose models
│   ├── User.ts
│   ├── Task.ts
│   ├── Note.ts
│   ├── Goal.ts
│   └── FocusSession.ts
├── types/               # TypeScript types
│   └── global.d.ts
├── public/              # Static assets
├── .env.local.example   # Environment template
├── next.config.js       # Next.js config
├── tailwind.config.ts   # Tailwind config
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### AI Features
- `POST /api/ai/plan` - Generate task plan
- `POST /api/ai/schedule` - Generate daily schedule
- `POST /api/ai/summary` - Summarize note
- `POST /api/ai/motivation` - Get motivation

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create note

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal

### Focus Sessions
- `GET /api/focus` - Get focus sessions
- `POST /api/focus` - Start focus session

## 🤖 AI Capabilities

The app uses Google Gemini AI (gemini-1.5-flash) for:

1. **Task Planning** - Converts task lists into structured plans with priorities
2. **Smart Scheduling** - Generates optimized daily schedules
3. **Note Summarization** - Extracts key points and action items
4. **Productivity Coaching** - Provides personalized motivation
5. **Distraction Analysis** - Recommends blocking strategies
6. **Task Breakdown** - Splits complex tasks into subtasks

## 🎨 Design System

### Colors
- **Primary**: `#6C5CE7` (Purple)
- **Accent**: `#00CEC9` (Aqua)
- **Background**: `#0F0F17` (Dark)
- **Cards**: Glassmorphism with blur

### Typography
- **Headings**: Poppins
- **Body**: Inter

### Components
- Glassmorphism cards
- Gradient buttons
- Smooth animations
- Rounded corners (2xl)
- Soft shadows

## 📊 Database Schema

### User
```typescript
{
  email: string
  password: string (hashed)
  name: string
  preferences: {
    theme: string
    notifications: boolean
    focusDuration: number
    breakDuration: number
  }
  createdAt: Date
  updatedAt: Date
}
```

### Task
```typescript
{
  userId: ObjectId
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  deadline: Date
  aiSuggestions: string[]
  tags: string[]
  estimatedTime: number
  actualTime: number
}
```

## 🔒 Security Best Practices

✅ JWT with HTTP-only cookies  
✅ Password hashing with bcrypt (salt rounds: 10)  
✅ Environment variables for secrets  
✅ MongoDB injection prevention  
✅ Input validation  
✅ Protected API routes  
✅ CORS configuration  

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Check connection string format
- Verify username/password
- Ensure IP whitelist includes 0.0.0.0/0
- Check network connectivity

### Google Gemini API Errors
- Verify API key is correct
- Check API quota at [Google AI Studio](https://aistudio.google.com)
- Monitor rate limits
- Review error messages

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

## 🌟 Acknowledgments

- **Google Gemini** for blazing-fast AI inference
- **Vercel** for seamless deployment
- **MongoDB** for reliable database
- **Next.js** team for amazing framework
- **Tailwind CSS** for utility-first styling

---

**Built with ❤️ using Next.js, MongoDB, and Google Gemini AI**

🚀 **Start your productivity journey today!**
