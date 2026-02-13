# Fix "Cannot connect to backend server" Issue

## ✅ Backend Status
Your backend IS running on port 1788 (verified).

## 🔍 Diagnosis Steps

### 1. Open Browser Console (F12)
Look for these messages:
- `🔗 API Base URL: http://localhost:1788` ✅ Should see this
- `Testing connection to: http://localhost:1788` ✅ Should see this
- Any red error messages ❌ These tell us the problem

### 2. Check Network Tab
1. Open DevTools (F12)
2. Go to **Network** tab
3. Try uploading a form or refreshing
4. Look for requests to `localhost:1788`
5. Click on failed requests to see:
   - Status code
   - Error message
   - Response headers

### 3. Test Backend Directly
Open in browser: **http://localhost:1788/health**

Should see:
```json
{"status":"healthy","timestamp":"...","azure_openai_configured":true,...}
```

## 🛠️ Quick Fixes

### Fix 1: Restart Backend
```bash
# Stop current backend (Ctrl+C in backend terminal)
# Then restart:
cd "D:\Netcare demo\cococola\ATA_Demo"
uvicorn app_manufacturing:app --host 0.0.0.0 --port 1788 --reload
```

Or use: `restart_backend.bat`

### Fix 2: Clear Browser Cache
1. Press **Ctrl+Shift+Delete**
2. Clear cached images and files
3. Or use **Ctrl+Shift+R** for hard refresh

### Fix 3: Check Frontend .env
Create `frontend/.env` file:
```
VITE_API_BASE=http://localhost:1788
```

Then restart frontend.

### Fix 4: Verify Ports
- Backend: **1788** ✅ (confirmed running)
- Frontend: **1789** (check in browser URL bar)

### Fix 5: Check CORS
Backend already has CORS enabled. If still seeing CORS errors:
- Make sure backend is restarted
- Check backend terminal for CORS-related errors

## 📋 What to Check in Browser Console

### Good Signs ✅
- `🔗 API Base URL: http://localhost:1788`
- `Health check response: 200 OK`
- `Backend health: {status: "healthy", ...}`

### Bad Signs ❌
- `Failed to fetch` → Backend not accessible
- `CORS policy` → CORS issue
- `NetworkError` → Connection problem
- `404 Not Found` → Wrong endpoint URL

## 🚀 Complete Restart Procedure

1. **Stop Backend**: Ctrl+C in backend terminal
2. **Stop Frontend**: Ctrl+C in frontend terminal
3. **Start Backend**:
   ```bash
   cd "D:\Netcare demo\cococola\ATA_Demo"
   uvicorn app_manufacturing:app --host 0.0.0.0 --port 1788 --reload
   ```
4. **Wait 3 seconds** for backend to start
5. **Test Backend**: Open http://localhost:1788/health
6. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
7. **Open Frontend**: http://localhost:1789
8. **Check Console**: F12 → Console tab

## 💡 Still Not Working?

**Copy the exact error message from browser console** and check:
- Is it a CORS error?
- Is it a network error?
- Is it a 404/500 error?
- What's the exact status code?

The backend is running, so the issue is likely:
- Browser cache
- Frontend not reloaded
- CORS preflight failing
- Network/firewall blocking

Try opening `test_backend.html` in browser to test connection directly.

