# Pepsico Manufacturing Production Line Management System

This application manages production lines, workers, and form processing for Pepsico manufacturing facilities.

## Features

### 4 Main Windows

1. **Ontology** - Access to ontology creator tool for knowledge modeling
2. **Upload** - Upload production line status forms (online or offline/handwritten)
3. **Dashboard** - Real-time view of production line status, workers, and recent forms
4. **Summary** - Processing results, Go/No-Go classifications, and worker reallocation recommendations
5. **Chatbot** - AI assistant with RAG framework for context-aware responses

### Key Capabilities

- **100 Production Lines**: Each with 20 workers (2000 total workers)
- **Form Processing**:
  - Online Forms: Direct text extraction from digital documents (DOCX, PDF)
  - Offline Forms: OCR processing for handwritten forms (JPG, PNG, PDF)
- **Go/No-Go Classification**: Automatic classification using AI/LLM
- **Attribute Extraction**: Extracts production line ID, manager name, date, reason, worker count, skills
- **Worker Reallocation**: For No-Go forms, provides intelligent recommendations for reallocating workers to available production lines based on skillset matching
- **RAG Chatbot**: Context-aware AI assistant that understands current production status

## Setup

### Backend Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. For OCR support, install Tesseract:
   - **Windows**: Download from https://github.com/UB-Mannheim/tesseract/wiki
   - **Linux**: `sudo apt-get install tesseract-ocr`
   - **Mac**: `brew install tesseract`

3. Create a `.env` file with your Azure OpenAI credentials:
```
AZURE_ENDPOINT=https://your-endpoint.openai.azure.com/
AZURE_DEPLOYMENT=gpt-4.1
AZURE_API_KEY=your-api-key
AZURE_API_VERSION=2024-08-01-preview
```

4. Run the backend server:
```bash
uvicorn app_manufacturing:app --host 0.0.0.0 --port 1788
```

The backend will be available at:
- `http://localhost:1788` (local access)
- `http://155.17.172.33:1788` (network access - default)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update `vite.config.js` or create `.env` file in `frontend/` folder:
```
VITE_API_BASE=http://155.17.172.33:1788
```

Or update the default in `AppManufacturing.jsx` if you want to use localhost instead.

4. Update `index.html` to use the manufacturing app:
   - Change `main.jsx` import to `mainManufacturing.jsx` in `index.html`, OR
   - Update `vite.config.js` entry point

5. Run the development server:
```bash
npm run dev
```

The frontend will be available at:
- `http://localhost:1789` (local access)
- `http://155.17.172.33:1789` (network access)

## Usage

### Upload Forms

1. Go to the **Upload** tab
2. Select form type:
   - **Online Form**: For digital documents (DOCX, PDF)
   - **Offline Form**: For handwritten forms (JPG, PNG, PDF) - OCR will be applied
3. Drag and drop files or click to browse
4. Forms are automatically processed:
   - Text extraction (OCR for handwritten)
   - Go/No-Go classification
   - Attribute extraction
   - Worker reallocation recommendations (for No-Go forms)

### Dashboard

- View real-time production line status
- See running vs. down production lines
- Monitor worker statistics
- View recent form submissions

### Summary

- See all processed forms
- View Go vs. No-Go classifications
- Review worker reallocation recommendations
- Access detailed processing results

### Chatbot

Ask questions about:
- Production line status
- Recent forms
- Worker reallocation
- System operations

The chatbot uses RAG (Retrieval-Augmented Generation) to provide context-aware responses based on current system state.

## API Endpoints

- `POST /upload-form` - Upload a production line status form
- `GET /dashboard/status` - Get current dashboard status
- `GET /production-lines` - Get all production lines
- `GET /workers` - Get all workers (optionally filtered by production line)
- `GET /forms` - Get all uploaded forms
- `GET /processing-results` - Get all processing results
- `POST /chat` - Chat with AI assistant

## Architecture

### Backend
- **FastAPI** for REST API
- **Azure OpenAI** for LLM-based classification and recommendations
- **Pytesseract** for OCR (with fallback simulation)
- **In-memory storage** for demo (can be replaced with database)

### Frontend
- **React** with modern hooks
- **4 Main Windows**: Ontology, Upload, Dashboard, Summary
- **Real-time updates** via polling
- **Responsive design**

### AI/ML Components
- **Form Classification**: LLM-based Go/No-Go classification
- **Attribute Extraction**: LLM-based structured data extraction
- **Worker Reallocation**: LLM-based recommendation system considering skillset matching
- **RAG Chatbot**: Context-aware responses using current system state

## User Story

**As a Production Line Manager**, I want to:
1. Upload production line status forms (either digital or handwritten)
2. Automatically classify forms as Go (line running) or No-Go (line down)
3. When a line is down, get intelligent recommendations for reallocating workers to other production lines based on their skillsets
4. View real-time dashboard of all production lines and workers
5. Get summary of all processed forms and reallocation recommendations
6. Chat with an AI assistant about production status and operations

## Notes

- The system initializes with mock data: 100 production lines, 2000 workers
- OCR requires Tesseract installation (or uses simulation mode)
- Worker reallocation recommendations use LLM to match worker skills with line requirements
- All processing results are stored in memory (for demo purposes)

