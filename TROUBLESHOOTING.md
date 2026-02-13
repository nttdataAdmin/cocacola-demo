# Troubleshooting Guide

## "Failed to fetch" Error

### Common Causes and Solutions

#### 1. Backend Not Running
**Problem**: Backend server is not started

**Solution**:
```bash
cd "D:\Netcare demo\cococola\ATA_Demo"
uvicorn app_manufacturing:app --host 0.0.0.0 --port 1788
```

**Verify**: Open browser and go to `http://localhost:1788/health`
- Should return: `{"status": "healthy", ...}`

#### 2. Wrong API URL
**Problem**: Frontend is trying to connect to wrong URL

**Solution**:
- Check `frontend/src/AppManufacturing.jsx` line 5:
  ```javascript
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:1788'
  ```
- Create `frontend/.env` file:
  ```
  VITE_API_BASE=http://localhost:1788
  ```
- Restart frontend after creating .env

#### 3. CORS Issues
**Problem**: Browser blocking cross-origin requests

**Solution**: 
- Backend already has CORS enabled (line 56-62 in app_manufacturing.py)
- If still having issues, check browser console for specific CORS errors
- Make sure backend is running on the correct port (1788)

#### 4. Port Already in Use
**Problem**: Another application is using port 1788

**Solution**:
```bash
# Windows - Find process using port 1788
netstat -ano | findstr :1788

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in app_manufacturing.py and update frontend
```

#### 5. Environment Variables Not Set
**Problem**: Azure OpenAI API key missing (optional, but affects LLM features)

**Solution**:
- Create `.env` file in `ATA_Demo/` folder
- Copy content from `env_template.txt`
- Fill in your Azure OpenAI credentials
- **Note**: App works without API key using keyword-based fallbacks

### Testing Connection

1. **Test Backend Health**:
   ```bash
   curl http://localhost:1788/health
   ```
   Or open in browser: `http://localhost:1788/health`

2. **Test Upload Endpoint**:
   ```bash
   curl -X POST http://localhost:1788/upload-form \
     -F "file=@MockData/form_online_01.docx" \
     -F "form_type=online"
   ```

3. **Check Browser Console**:
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for error messages
   - Check Network tab for failed requests

### Quick Fixes

1. **Restart Both Servers**:
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Start backend first
   - Then start frontend

2. **Clear Browser Cache**:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

3. **Check Firewall**:
   - Ensure ports 1788 and 1789 are not blocked
   - Windows Firewall might block connections

4. **Verify Files**:
   - Ensure `app_manufacturing.py` exists
   - Ensure `frontend/src/AppManufacturing.jsx` exists
   - Check that images are in `frontend/public/` folder

### Environment Variables

The app works **WITHOUT** Azure OpenAI API key using fallback methods:
- Form classification: Keyword-based (GO/NO-GO)
- Attribute extraction: Regex-based
- Worker reallocation: Simple distribution algorithm

**With API key**, you get:
- Better form classification accuracy
- Improved attribute extraction
- Intelligent worker reallocation recommendations

### Still Having Issues?

1. Check backend logs for error messages
2. Check browser console for JavaScript errors
3. Verify both servers are running
4. Test backend health endpoint directly
5. Check network connectivity

