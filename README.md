# Autonomous Testing Framework (ATF) - Demo

This is an AI-powered autonomous testing framework that automates the end-to-end software testing process using five specialized AI agents.

## Features

- **File Upload**: Upload DOCX requirements documents
- **Five AI Agents**:
  1. Requirements Analyst - Analyzes requirements documents
  2. User Story Creator - Generates user stories from requirements
  3. Test Case Generator - Creates comprehensive test cases
  4. Test Data Generator - Generates Test Data in JSON format
  5. Selenium Automation Engineer - Generates Python Selenium scripts
- **Summary Tab**: View test coverage and summary
- **AI Assistant**: Chat with AI about the generated artifacts
- **Ontology Tab**: Access ontology creator tool

## Setup

### Backend Setup

1. Navigate to the ATF_Demo directory:
```bash
cd ATF_Demo
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with your Azure OpenAI credentials:
```
AZURE_ENDPOINT=https://your-endpoint.openai.azure.com/
AZURE_DEPLOYMENT=gpt-4.1
AZURE_API_KEY=your-api-key
AZURE_API_VERSION=2024-08-01-preview
```

4. Run the backend server:
```bash
uvicorn app:app --host 0.0.0.0 --port 1456
```
The backend will be available at:
- `http://localhost:1456` (local access)
- `http://155.17.172.33:1456` (network access)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at:
- `http://localhost:1455` (local access)
- `http://155.17.172.33:1455` (network access)

## Sample Input Files

Sample requirements documents are available in the `SampleInputs/` directory:
- `ECommerce_ProductSearch_Requirements.docx` - E-commerce product search feature
- `UserAuth_Authorization_Requirements.docx` - User authentication and authorization system
- `PaymentProcessing_Requirements.docx` - Payment processing system
- `OrderManagement_Requirements.docx` - Order management system

You can use these files to test the ATF system. To create more sample files, run:
```bash
python create_sample_files.py
```

## Usage

1. **Upload Files**: 
   - Go to the Workflow tab
   - Drag and drop DOCX files from `SampleInputs/` folder or click to browse
   - Files will be processed in-memory

2. **Run Agents**:
   - Select a file from the uploaded files list
   - Click "Execute: Run" button
   - All five agents will run sequentially
   - Progress bars will show the status

3. **View Summary**:
   - Go to the Summary tab to see test coverage information

4. **Ask Questions**:
   - Go to the Assistant tab
   - Ask questions about the generated artifacts
   - The AI will answer based on the knowledge base

5. **Create Ontology**:
   - Go to the Ontology tab
   - Access the ontology creator tool

## Output Files

All outputs are saved in the `Output` directory:
- `UserStory/` - Generated user stories (DOCX or JSON)
- `TestCases/` - Test cases (JSON)
- `TestDATF/` - Test Data (JSON)
- `TestCoverage/` - Coverage reports (JSON)
- `SeleniumScripts/` - Python Selenium scripts (.py)

## API Endpoints

- `POST /upload` - Upload DOCX files
- `GET /uploaded-files` - Get list of uploaded files
- `POST /run-all-agents` - Run all agents for a file
- `POST /agent/requirements-analyst` - Run requirements analyst
- `POST /agent/user-story-creator` - Run user story creator
- `POST /agent/test-case-generator` - Run test case generator
- `POST /agent/test-dATF-generator` - Run Test Data generator
- `POST /agent/selenium-engineer` - Run Selenium engineer
- `POST /chat` - Chat with AI assistant
- `GET /output-path` - Get output directory paths

## Notes

- The system uses Azure OpenAI for AI capabilities
- Files are processed in-memory (not saved to disk initially)
- Output files are saved to the `Output` directory
- The ontology tab embeds an external tool at `http://155.17.173.96:5173/create`

## Troubleshooting

- If you get import errors for `docx`, make sure `python-docx` is installed
- If the frontend can't connect to the backend, check the API_BASE URL in App.jsx
- Make sure Azure OpenAI credentials are correctly set in the `.env` file

