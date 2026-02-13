# ATF Agent Framework Design

## Overview
The Autonomous Testing Framework (ATF) uses a **sequential agent-based architecture** where 4 specialized AI agents work together to transform requirements documents into comprehensive test artifacts.

## Architecture

### Agent Flow (Sequential Pipeline)
```
Requirements Document (DOCX)
    ↓
[Agent 1] Requirements Analyst
    ↓
[Agent 2] User Story Creator
    ↓
[Agent 3] Test Case Generator
    ↓
[Agent 4] Test Data Generator
    ↓
Output: User Stories, Test Cases, Test Data (JSON + Excel)
```

## Agent Details

### 1. Requirements Analyst
- **Purpose**: Analyzes and extracts key information from requirements documents
- **Input**: DOCX requirements document (text content)
- **Output**: Structured JSON with:
  - Functional requirements
  - Key features
  - Business objectives
  - Non-functional requirements
  - Dependencies and constraints
- **Technology**: Azure OpenAI GPT-4.1
- **Max Tokens**: 2000

### 2. User Story Creator
- **Purpose**: Transforms analyzed requirements into user stories
- **Input**: Requirements document + Requirements Analyst output
- **Output**: JSON with user stories (minimum 15-20 stories)
  - Each story includes: ID, Title, User Story text, Acceptance Criteria, Priority
- **Technology**: Azure OpenAI GPT-4.1
- **Max Tokens**: 8000 (increased for bulk output)
- **Format**: Standard "As a [user], I want [feature], so that [benefit]"

### 3. Test Case Generator
- **Purpose**: Creates comprehensive test cases from user stories
- **Input**: Requirements document + User Stories
- **Output**: JSON with test cases (minimum 50-100 test cases)
  - Each test case includes: ID, Title, Description, Preconditions, Test Steps, Expected Results, Priority, Test Type
- **Technology**: Azure OpenAI GPT-4.1
- **Max Tokens**: 16000 (increased for bulk output)
- **Coverage**: 3-5 test cases per user story (positive, negative, boundary, edge cases)

### 4. Test Data Generator
- **Purpose**: Generates realistic Test Data for test cases
- **Input**: Requirements document + Test Cases
- **Output**: JSON with Test Data sets (2-3 dATF sets per test case)
  - Each dATF set includes: Test Case ID, DATF Set Name, DATF Values (structured), Description
- **Technology**: Azure OpenAI GPT-4.1
- **Max Tokens**: 12000 (increased for bulk output)
- **Variations**: Positive, Negative, Boundary Test Data

## DATF Flow

1. **File Upload**: User uploads DOCX file → Stored in memory (`uploaded_files` dict)
2. **Sequential Execution**: Agents run one after another, each using previous agent's output
3. **JSON Parsing**: Each agent's response is parsed from JSON (handles markdown code blocks)
4. **Error Handling**: If JSON parsing fails, raw response is stored in `raw_response` field
5. **File Storage**: Outputs saved to local directories:
   - `Output/UserStory/` - User stories (DOCX or JSON)
   - `Output/TestCases/` - Test cases (JSON)
   - `Output/TestDATF/` - Test Data (JSON)
   - `Output/Excel/` - Combined Excel export
6. **Excel Export**: Test cases and Test Data combined into Excel file with 2 sheets

## Key Features

### JSON Parsing Strategy
- Removes markdown code blocks (```json ... ```)
- Handles both `raw_response` and parsed arrays
- Falls back to `raw_response` if parsing fails
- Validates dATF presence before using

### Bulk Output Generation
- **User Stories**: Minimum 15-20 stories
- **Test Cases**: Minimum 50-100 test cases
- **Test Data**: 2-3 dATF sets per test case
- Prompts explicitly request comprehensive coverage

### Error Handling
- JSON parsing errors logged with preview
- Empty arrays trigger warnings
- Raw responses preserved for debugging
- Graceful degradation (empty arrays instead of crashes)

## Technology Stack

- **Backend**: FastAPI (Python)
- **AI Engine**: Azure OpenAI (GPT-4.1)
- **Frontend**: React + Vite
- **DATF Storage**: Local file system (JSON, DOCX, Excel)
- **Excel Library**: openpyxl + pandas

## API Endpoints

- `POST /upload` - Upload DOCX files
- `POST /run-all-agents` - Execute all 4 agents sequentially
- `POST /agent/requirements-analyst` - Run Agent 1
- `POST /agent/user-story-creator` - Run Agent 2
- `POST /agent/test-case-generator` - Run Agent 3
- `POST /agent/test-dATF-generator` - Run Agent 4
- `GET /download-outputs/{file_name}` - Download ZIP of all outputs

## Output Structure

```
Output/
├── UserStory/
│   └── {filename}_userstory.docx
├── TestCases/
│   └── {filename}_testcases.json
├── TestDATF/
│   └── {filename}_testdATF.json
├── TestCoverage/
│   └── {filename}_testcoverage.json
└── Excel/
    └── {filename}_TestCases_TestDATF.xlsx
```

