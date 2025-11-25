@echo off
echo Creating .env.local file...

(
echo MONGODB_URI=mongodb+srv://lokeshnix_db_user:yF167KGc5orr96wG@cluster0.faiop3n.mongodb.net/focusflow?retryWrites=true^&w=majority^&appName=Cluster0
echo.
echo JWT_SECRET=84f983305db3b1a8e64975142248ce14
echo JWT_EXPIRES_IN=7d
echo.
echo GEMINI_API_KEY=AIzaSyD-iDT6sGobEGYSC29JI9UE2uSytg4ZvCg
echo.
echo NEXT_PUBLIC_APP_URL=http://localhost:3000
) > .env.local

echo .env.local file created successfully!
echo.
echo Your credentials have been configured:
echo - MongoDB: Connected to cluster0.faiop3n.mongodb.net
echo - Google Gemini API: Ready
echo - JWT: Configured
echo.
echo Next steps:
echo 1. Run: npm install
echo 2. Run: npm run dev
echo 3. Open: http://localhost:3000
echo.
pause
