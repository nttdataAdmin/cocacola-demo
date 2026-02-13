# Quick Start Guide - Running Frontend and Backend

## Prerequisites
- Python 3.x installed
- Node.js and npm installed
- Azure OpenAI credentials (for AI features)

## Step 1: Backend Setup

### 1.1 Navigate to the project directory
```bash
cd "D:\Netcare demo\ATA\ATA_Demo"
```

### 1.2 Activate virtual environment (if using)
```bash
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1

# On Windows CMD:
venv\Scripts\activate.bat
```

### 1.3 Install Python dependencies
```bash
pip install -r requirements.txt
```

### 1.4 Create `.env` file (if not exists)
Create a `.env` file in the `ATA_Demo` directory with:
```
AZURE_ENDPOINT=https://your-endpoint.openai.azure.com/
AZURE_DEPLOYMENT=gpt-4.1
AZURE_API_KEY=your-api-key
AZURE_API_VERSION=2024-08-01-preview
```

### 1.5 Run the backend server
```bash
uvicorn app:app --host 0.0.0.0 --port 1456
```

The backend will be available at:
- **Local**: `http://localhost:1456`
- **Network**: `http://155.17.172.33:1456`

You should see output like:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:1456
```

---

## Step 2: Frontend Setup

### 2.1 Open a NEW terminal window (keep backend running)

### 2.2 Navigate to frontend directory
```bash
cd "D:\Netcare demo\ATA\ATA_Demo\frontend"
```

### 2.3 Install dependencies (if not already installed)
```bash
npm install
```

### 2.4 Create `.env` file for frontend (optional - for local backend)
Create a `.env` file in the `frontend` directory:
```
VITE_API_BASE=http://localhost:1456
```

If you skip this step, the frontend will use the default network URL: `http://155.17.172.33:1456`

### 2.5 Run the frontend development server
```bash
npm run dev
```

The frontend will be available at:
- **Local**: `http://localhost:1455`
- **Network**: `http://155.17.172.33:1455`

You should see output like:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:1455/
  ➜  Network: http://155.17.172.33:1455/
```

---

## Step 3: Access the Application

1. Open your browser and go to: **http://localhost:1455**
2. The frontend will connect to the backend automatically
3. You can now upload DOCX files and run the AI agents

---

## Running Both Services Together

### Option 1: Two Separate Terminals
- **Terminal 1**: Run backend (`uvicorn app:app --host 0.0.0.0 --port 1456`)
- **Terminal 2**: Run frontend (`npm run dev`)

### Option 2: Using PowerShell Background Jobs
```powershell
# Start backend in background
Start-Job -ScriptBlock { cd "D:\Netcare demo\ATA\ATA_Demo"; uvicorn app:app --host 0.0.0.0 --port 1456 }

# Start frontend in background
Start-Job -ScriptBlock { cd "D:\Netcare demo\ATA\ATA_Demo\frontend"; npm run dev }
```

---

## Troubleshooting

### Backend Issues
- **Port already in use**: Change port with `--port 1457` (and update frontend `.env`)
- **Module not found**: Run `pip install -r requirements.txt`
- **Azure OpenAI errors**: Check your `.env` file credentials

### Frontend Issues
- **Cannot connect to backend**: 
  - Check if backend is running
  - Verify `VITE_API_BASE` in frontend `.env` matches backend URL
  - Check CORS settings (should be enabled in `app.py`)
- **Port already in use**: Vite will automatically try the next available port

### General
- Make sure both services are running before using the application
- Check browser console (F12) for any connection errors
- Verify firewall isn't blocking ports 1455 and 1456

---

## Stopping the Services

- **Backend**: Press `Ctrl+C` in the backend terminal
- **Frontend**: Press `Ctrl+C` in the frontend terminal
- **Background Jobs**: Use `Get-Job | Stop-Job` in PowerShell
