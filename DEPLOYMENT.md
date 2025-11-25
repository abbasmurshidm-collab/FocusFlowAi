# 🚀 DEPLOYMENT & INSTALLATION GUIDE

## PowerShell Execution Policy Issue

If you're seeing this error:
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled
```

You have several options:

### Option 1: Use Command Prompt (CMD) Instead
1. Open Command Prompt (not PowerShell)
2. Navigate to the project: `cd c:\Users\abbas\Downloads\Antigravity\FocusFlowAI_Public`
3. Run: `npm install`
4. Then: `npm run dev`

### Option 2: Temporarily Allow PowerShell Scripts
Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try `npm install` again.

### Option 3: Use Git Bash or WSL
If you have Git Bash or Windows Subsystem for Linux installed:
```bash
cd /c/Users/abbas/Downloads/Web_App
npm install
npm run dev
```

---

## 📦 Manual Installation Steps

If npm install fails, here are the exact steps:

### 1. Install Dependencies using Command Prompt

```cmd
cd c:\Users\abbas\Downloads\Web_App
npm install next@^14.2.0 react@^18.3.0 react-dom@^18.3.0
npm install framer-motion@^11.0.0
npm install mongoose@^8.0.0
npm install bcrypt@^5.1.1
npm install jsonwebtoken@^9.0.2
npm install @google/generative-ai
npm install axios@^1.6.0
npm install react-hot-toast@^2.4.1
npm install react-icons@^5.0.0
npm install @heroicons/react@^2.1.0
npm install date-fns@^3.0.0
npm install recharts@^2.10.0
npm install -D typescript@^5.3.0
npm install -D @types/node@^20.10.0
npm install -D @types/react@^18.2.0
npm install -D @types/react-dom@^18.2.0
npm install -D @types/bcrypt@^5.0.2
npm install -D @types/jsonwebtoken@^9.0.5
npm install -D tailwindcss@^3.4.0
npm install -D postcss@^8.4.0
npm install -D autoprefixer@^10.4.0
npm install -D eslint@^8.55.0
npm install -D eslint-config-next@^14.2.0
```

---

## ⚙️ Environment Setup

### 1. Create .env.local File

Create a file named `.env.local` in the root directory with:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/focusflow?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_secret_key_here_make_it_very_long_and_random
JWT_EXPIRES_IN=7d

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. MongoDB Atlas Setup (Free Tier)

1. **Sign Up**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Create free account

2. **Create Database**
   - Click "Build a Database"
   - Select "FREE" (M0 tier - 0.5GB)
   - Choose AWS or Google Cloud + nearest region
   - Click "Create"

3. **Database User**
   - Go to "Database Access" tab
   - Click "Add New Database User"
   - Create username and strong password
   - Give "Read and write to any database" permission
   - Click "Add User"

4. **Network Access**
   - Go to "Network Access" tab  
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Confirm with 0.0.0.0/0

5. **Get Connection String**
   - Go back to "Database" tab
   - Click "Connect"
   - Select "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Replace `test` with `focusflow`

### 3. Google Gemini API Setup (Free Tier)

1. **Get API Key**
   - Visit: https://aistudio.google.com/app/apikey
   - Sign in with Google account (free)
   - Click "Create API Key"
   - Copy the key (starts with `AIza`)
   - Paste into `.env.local`

2. **Available Models**
   - `gemini-1.5-flash` (default, fast and efficient)
   - `gemini-1.5-pro` (advanced, for complex tasks)
   - `gemini-pro` (general purpose)

---

## 🏃 Running the Application

### Development Mode

```cmd
npm run dev
```

Then open: http://localhost:3000

### Production Build

```cmd
npm run build
npm start
```

---

## 🌐 Deployment to Vercel

### Method 1: GitHub → Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "FocusFlow AI - Initial commit"
   git branch -M main
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Framework Preset: Next.js
   - Add Environment Variables (copy from .env.local)
   - Click "Deploy"

3. **Add Environment Variables**
   In Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add each variable from your `.env.local`
   - Click "Save"
   - Redeploy if necessary

### Method 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow prompts and add environment variables.

---

## 🌐 Deployment to Render

### Method 1: GitHub → Render (Recommended)

1. **Push to GitHub**
   (Same steps as above)

2. **Deploy on Render**
   - Go to https://render.com
   - Click "New +" -> "Web Service"
   - Connect your GitHub account
   - Select the `FocusFlowAi` repository
   - Render will automatically detect the `render.yaml` file and configure the service.
   - Click "Create Web Service"

3. **Add Environment Variables**
   - Go to the "Environment" tab of your new service.
   - Add the following variables (copy values from your `.env.local`):
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `JWT_EXPIRES_IN` (e.g., `7d`)
     - `GEMINI_API_KEY` (Required for AI features)
     - `NEXT_PUBLIC_APP_URL` (Set this to your Render URL, e.g., `https://focusflow-ai.onrender.com`)
     - `RESEND_API_KEY` (Required for emails)
   - Click "Save Changes"

---

## 🔍 Verification Checklist

After installation, verify:

✅ All dependencies installed (`node_modules` folder exists)  
✅ `.env.local` file created with all variables  
✅ MongoDB connection string is correct  
✅ Google Gemini API key is valid  
✅ No TypeScript errors  
✅ Development server runs without errors  

---

## 🐛 Common Issues & Solutions

### Issue: Module not found error
**Solution:** Delete `node_modules` and `.next`, then reinstall:
```cmd
rmdir /s /q node_modules
rmdir /s /q .next
npm install
```

### Issue: MongoDB connection timeout
**Solutions:**
- Check internet connection
- Verify connection string format
- Ensure IP whitelist is set to 0.0.0.0/0
- Check username/password in connection string

### Issue: Google Gemini API errors
**Solutions:**
- Verify API key is correct (starts with `AIza`)
- Check API quota at https://aistudio.google.com
- Ensure you're not exceeding free tier limits
- Try a different model

### Issue: Port 3000 already in use
**Solution:**
```cmd
# Use different port
set PORT=3001
npm run dev
```

### Issue: TypeScript errors
**Solution:**
```cmd
npm install --save-dev @types/node @types/react @types/react-dom
```

---

## 📱 First Time Setup Flow

1. ✅ Enable PowerShell or use CMD
2. ✅ Install all dependencies
3. ✅ Create MongoDB Atlas account
4. ✅ Get Google Gemini API key
5. ✅ Create `.env.local` file
6. ✅ Run `npm run dev`
7. ✅ Open http://localhost:3000
8. ✅ Register your account
9. ✅ Start using FocusFlow AI!

---

## 🎯 Quick Start (TL;DR)

```cmd
cd c:\Users\abbas\Downloads\Antigravity\FocusFlowAI_Public
npm install
# Create .env.local with your credentials
npm run dev
# Open http://localhost:3000
```

---

## 📞 Getting Help

If you encounter issues:
1. Check this deployment guide
2. Review the main README.md
3. Check console for specific errors
4. Verify environment variables
5. Check MongoDB and Gemini dashboards

---

**Ready to boost your productivity? Let's go! 🚀**
