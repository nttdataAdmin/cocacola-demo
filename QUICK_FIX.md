# Quick Fix for "Cannot connect to backend server"

## Backend is Running ✅
The backend is already running on port 1788. The issue is likely a frontend connection problem.

## Steps to Fix:

### 1. Verify Backend is Accessible
Open in browser: **http://localhost:1788/health**

You should see:
```json
{"status":"healthy","timestamp":"...","azure_openai_configured":true,...}
```

### 2. Check Frontend Console
1. Open your browser (where frontend is running)
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Look for:
   - `🔗 API Base URL: http://localhost:1788`
   - Any CORS errors
   - Any network errors

### 3. Check Network Tab
1. In DevTools, go to **Network** tab
2. Try to upload a form or refresh the page
3. Look for requests to `http://localhost:1788`
4. Click on the request to see:
   - Status code
   - Response
   - Headers
   - Error messages

### 4. Common Issues & Fixes

#### Issue: CORS Error
**Fix**: Backend already has CORS enabled. If still seeing CORS errors:
- Make sure backend is running: `uvicorn app_manufacturing:app --host 0.0.0.0 --port 1788`
- Restart backend server

#### Issue: "Failed to fetch"
**Possible causes**:
- Backend crashed (check backend terminal)
- Firewall blocking connection
- Browser blocking mixed content

**Fix**:
1. Check backend terminal for errors
2. Restart backend if needed
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try in incognito/private mode

#### Issue: Wrong Port
**Fix**: 
- Verify frontend is using correct API_BASE
- Check browser console for the logged API_BASE URL
- Should be: `http://localhost:1788`

### 5. Test Backend Directly
Open this file in browser: `ATA_Demo/test_backend.html`

It will test the connection and show you the exact error.

### 6. Restart Everything
```bash
# Terminal 1 - Backend
cd "D:\Netcare demo\cococola\ATA_Demo"
uvicorn app_manufacturing:app --host 0.0.0.0 --port 1788

# Terminal 2 - Frontend  
cd "D:\Netcare demo\cococola\ATA_Demo\frontend"
npm run dev
```

### 7. Check Browser Console Output
After login, you should see in console:
- `🔗 API Base URL: http://localhost:1788`
- `🌐 Frontend URL: http://localhost:1789` (or your frontend URL)
- `Testing connection to: http://localhost:1788`
- `Health check response: 200 OK`
- `Backend health: {status: "healthy", ...}`

If you see errors, copy them and check the troubleshooting guide.

## Still Not Working?

1. **Check if backend process is actually running**:
   ```bash
   netstat -ano | findstr :1788
   ```

2. **Kill and restart backend**:
   ```bash
   # Find process ID from netstat output
   taskkill /PID <PID> /F
   # Then restart
   uvicorn app_manufacturing:app --host 0.0.0.0 --port 1788
   ```

3. **Try different browser** (Chrome, Firefox, Edge)

4. **Check Windows Firewall** - might be blocking localhost connections

