# Quick Connection Check

## Step 1: Verify Backend is Running
Open in your browser: **http://localhost:1788/health**

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "azure_openai_configured": true,
  "ocr_available": false,
  "docx_available": true
}
```

## Step 2: Check Browser Console
1. Open your frontend app (http://localhost:1789)
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. You should see:
   - `🔗 API Base URL: http://localhost:1788`
   - `🌐 Frontend URL: http://localhost:1789`
   - `Testing connection to: http://localhost:1788`
   - `Health check response: 200 OK`

## Step 3: Check Network Tab
1. In DevTools, go to **Network** tab
2. Refresh the page or try uploading a form
3. Look for requests to `localhost:1788`
4. Click on any failed request to see the error

## Step 4: Common Solutions

### If you see CORS errors:
- Backend CORS is already enabled
- Try restarting the backend server
- Clear browser cache

### If you see "Failed to fetch":
- Backend might have crashed - check backend terminal
- Restart backend: `uvicorn app_manufacturing:app --host 0.0.0.0 --port 1788`
- Check Windows Firewall

### If backend health check works but frontend can't connect:
- Check browser console for exact error
- Verify frontend is using correct API_BASE
- Try hard refresh: Ctrl+Shift+R

## Quick Restart
Run `restart_backend.bat` to restart the backend server.

