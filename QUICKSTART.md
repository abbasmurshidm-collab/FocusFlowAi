# 🚀 QUICK START GUIDE - FocusFlow AI

## ⚡ 5-Minute Setup

### Step 1: Fix PowerShell Issue (Windows)
Open **Command Prompt** (not PowerShell) or run this in PowerShell as Admin:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 2: Install Dependencies
```cmd
cd c:\Users\abbas\Downloads\Antigravity\FocusFlowAI_Public
npm install
```

### Step 3: Setup MongoDB (2 minutes)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create FREE M0 cluster
3. Create database user + password
4. Network Access → Add IP → Allow 0.0.0.0/0
5. Connect → Get connection string

### Step 4: Get Google Gemini API Key (1 minute)
1. Visit https://aistudio.google.com/app/apikey
2. Sign in with Google account (free)
3. Click "Create API Key"
4. Copy key

### Step 5: Create .env.local
Copy `.env.local.example` to `.env.local` and fill in:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/focusflow
JWT_SECRET=make_this_a_long_random_string_32_chars_minimum
GEMINI_API_KEY=your_gemini_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 6: Run Development Server
```cmd
npm run dev
```

Open http://localhost:3000 🎉

---

## 📁 Project Structure

```
FocusFlow-AI/
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── auth/              # Login, Register, Logout
│   │   ├── tasks/             # Task management
│   │   ├── notes/             # Notes CRUD
│   │   ├── goals/             # Goal tracking
│   │   ├── focus/             # Focus sessions
│   │   └── ai/                # AI features (Gemini)
│   ├── auth/                  # Auth pages
│   ├── dashboard/             # Main dashboard
│   ├── tasks/                 # Tasks page
│   ├── focus/                 # Pomodoro timer
│   ├── notes/                 # Notes page
│   ├── goals/                 # Goals page
│   ├── analytics/             # Analytics
│   └── page.tsx               # Landing page
├── components/                # Reusable components
├── contexts/                  # React contexts
├── lib/                       # Utilities
│   ├── db.ts                 # MongoDB connection
│   ├── auth.ts               # JWT functions
│   ├── groq.ts               # AI functions
│   └── middleware.ts         # API middleware
├── models/                    # Database models
└── types/                     # TypeScript types
```

---

## 🎯 Main Features

### 1. Tasks (/tasks)
- ✅ Create, update, delete tasks
- 🎨 Priority levels (low, medium, high)
- 📊 Status tracking (todo, in-progress, completed)
- 🏷️ Tags and categories
- ⏱️ Time tracking

### 2. Focus Timer (/focus)
- ⏰ Pomodoro technique (25/5/15 min)
- 📈 Session tracking
- 🎯 Task linking
- 📊 Statistics

### 3. Notes (/notes)
- 📝 Rich text notes
- 🤖 AI summarization
- 🏷️ Tag organization
- 🔍 Search functionality

### 4. Goals (/goals)
- 🎯 Goal setting with deadlines
- ✅ Milestone tracking
- 📊 Progress visualization
- 📁 Category organization

### 5. AI Features
- 🤖 Task planning
- 📅 Smart scheduling
- 📝 Note summarization
- 💪 Motivation & coaching

---

## 🎨 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion

**Backend:**
- Next.js API Routes
- MongoDB + Mongoose
- JWT Authentication
- bcrypt

**AI:**
- Google Gemini API
- gemini-1.5-flash

---

## 🔧 Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Run production build

# Utilities
npm run lint         # Run ESLint
```

---

## 🌐 Deploy to Vercel

```bash
# Quick deploy
npm install -g vercel
vercel

# Or via GitHub
git init
git add .
git commit -m "Initial commit"
git push
# Then import in Vercel dashboard
```

Don't forget to add environment variables in Vercel!

---

## 🐛 Troubleshooting

**npm install fails?**
→ Use Command Prompt instead of PowerShell

**MongoDB connection error?**
→ Check connection string, password, and IP whitelist

**Google Gemini API error?**
→ Verify API key and check https://aistudio.google.com

**Port 3000 in use?**
→ `npx kill-port 3000` or use different port

---

## 📚 Documentation

- `README.md` - Main documentation
- `DEPLOYMENT.md` - Deployment guide
- `API_DOCUMENTATION.md` - API reference
- `.env.local.example` - Environment variables

---

## ✅ Verification Checklist

After setup, check:
- [ ] `npm install` completed without errors
- [ ] `.env.local` file exists with all variables
- [ ] MongoDB connection works
- [ ] Google Gemini API key is valid
- [ ] `npm run dev` starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can register new account
- [ ] Can create tasks, notes, goals
- [ ] AI features work

---

## 🎯 First Steps After Setup

1. ✅ Register your account
2. ✅ Create your first task
3. ✅ Try the focus timer
4. ✅ Write a note
5. ✅ Set a goal
6. ✅ Check the analytics

---

## 💡 Tips

- Use **Command Prompt** for npm commands on Windows
- Keep `.env.local` file secret (never commit it)
- MongoDB free tier gives 0.5GB storage
- Gemini free tier has generous quota
- Deploy to Vercel for free hosting

---

## 📞 Need Help?

1. Check error messages in console
2. Review DEPLOYMENT.md
3. Verify environment variables
4. Check MongoDB/Gemini dashboards
5. Review API_DOCUMENTATION.md

---

## 🚀 Production Deployment

**Vercel (Recommended):**
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy ✅

**Requirements:**
- MongoDB Atlas (already setup)
- Google Gemini API key (already have)
- Environment variables configured

---

**You're all set! Start building your productivity empire! 🎉**

---

### Quick Reference: Environment Variables

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=long_random_string
GEMINI_API_KEY=your_key...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Quick Reference: Key Files

- `app/page.tsx` - Landing page
- `app/dashboard/page.tsx` - Main dashboard
- `lib/groq.ts` - AI functions
- `models/` - Database schemas
- `.env.local` - Your secrets (DON'T COMMIT!)

---

**Happy coding! 🚀**
