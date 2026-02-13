# Complete Agentic Framework Documentation - ATF (Autonomous Testing Framework)

## Table of Contents
1. [Overview](#overview)
2. [Architecture Design](#architecture-design)
3. [Agent Pipeline Flow](#agent-pipeline-flow)
4. [Individual Agent Details](#individual-agent-details)
5. [DATF Flow & State Management](#dATF-flow--state-management)
6. [Implementation Details](#implementation-details)
7. [Error Handling & Resilience](#error-handling--resilience)
8. [Output Management](#output-management)

---

## Overview

The ATF (Autonomous Testing Framework) uses a **Sequential Agent-Based Architecture** where 4 specialized AI agents work together in a pipeline to transform requirements documents (DOCX) into comprehensive test artifacts. Each agent is an independent AI-powered component that performs a specific task and passes its output to the next agent in the chain.

### Key Principles
- **Sequential Execution**: Agents run one after another (not in parallel)
- **DATF Dependency**: Each agent depends on the previous agent's output
- **Specialization**: Each agent has a specific, focused responsibility
- **LLM-Powered**: All agents use Azure OpenAI GPT-4.1 for intelligent processing
- **Structured Output**: All agents produce JSON-formatted results

---

## Architecture Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│  - File Upload UI                                            │
│  - Agent Workflow Visualization                              │
│  - Results Display (Summary Tab)                            │
│  - AI Chat Assistant                                        │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP REST API
┌──────────────────────▼──────────────────────────────────────┐
│              Backend (FastAPI - Python)                      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Agent Orchestrator                         │     │
│  │  POST /run-all-agents                              │     │
│  └──────────┬────────────────────────────────────────┘     │
│             │                                                │
│  ┌──────────▼────────────────────────────────────────┐     │
│  │  Sequential Agent Pipeline                         │     │
│  │                                                     │     │
│  │  Agent 1 → Agent 2 → Agent 3 → Agent 4           │     │
│  │     ↓         ↓         ↓         ↓               │     │
│  │  Results   Results  Results  Results              │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Azure OpenAI GPT-4.1                       │     │
│  │  (Shared LLM instance for all agents)              │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘
```

---

## Agent Pipeline Flow

### Complete Execution Flow

```
1. USER UPLOADS DOCX FILE
   ↓
   File stored in memory: uploaded_files[filename] = {content: text, ...}
   
2. USER CLICKS "RUN AGENTS" BUTTON
   ↓
   Frontend: POST /run-all-agents {file_name: "sample.docx"}
   ↓
   
3. BACKEND: run_all_agents() FUNCTION
   ↓
   
   ┌─────────────────────────────────────────────────┐
   │ AGENT 1: Requirements Analyst                  │
   │ Input:  DOCX document text                       │
   │ Output: {summary, functional_requirements, ...} │
   └──────────────┬───────────────────────────────────┘
                  ↓
   ┌─────────────────────────────────────────────────┐
   │ AGENT 2: User Story Creator                     │
   │ Input:  DOCX document + Agent 1 output          │
   │ Output: {user_stories: [...]}                   │
   └──────────────┬───────────────────────────────────┘
                  ↓
   ┌─────────────────────────────────────────────────┐
   │ AGENT 3: Test Case Generator                    │
   │ Input:  DOCX document + Agent 2 output          │
   │ Output: {test_cases: [...]}                     │
   └──────────────┬───────────────────────────────────┘
                  ↓
   ┌─────────────────────────────────────────────────┐
   │ AGENT 4: Test Data Generator                    │
   │ Input:  DOCX document + Agent 3 output          │
   │ Output: {test_dATF: [...]}                      │
   └──────────────┬───────────────────────────────────┘
                  ↓
   
4. POST-PROCESSING
   - Parse raw_response if arrays are empty
   - Generate test coverage summary
   - Export to Excel (Test Cases + Test Data)
   - Save all outputs to JSON files
   ↓
   
5. RETURN RESULTS TO FRONTEND
   {
     "1_requirements_analyst": {...},
     "2_user_story_creator": {...},
     "3_test_case_generator": {...},
     "4_test_dATF_generator": {...},
     "test_coverage": {...},
     "excel_file": "path/to/file.xlsx"
   }
```

---

## Individual Agent Details

### Agent 1: Requirements Analyst

**Purpose**: Analyze and extract structured information from requirements documents

**Function**: `requirements_analyst_agent(file_name: str)`

**Input**:
- `file_name`: Name of uploaded DOCX file
- Reads document text from `uploaded_files[file_name]["content"]`

**LLM Prompt Structure**:
```
System: "You are an expert Requirements Analyst..."
User: "Analyze this document: [DOCUMENT TEXT]
       Extract: functional requirements, key features, 
       business objectives, non-functional requirements,
       dependencies, constraints"
```

**LLM Configuration**:
- Model: `gpt-4.1` (Azure OpenAI)
- Temperature: `0.3` (deterministic, focused)
- Max Tokens: `4000` (increased for comprehensive overview)

**Output Structure**:
```json
{
  "summary": "2-3 paragraph overview of document...",
  "functional_requirements": ["req1", "req2", ...],
  "key_features": ["feature1", "feature2", ...],
  "business_objectives": ["obj1", "obj2", ...],
  "non_functional_requirements": ["perf", "security", ...],
  "dependencies": ["dep1", "dep2", ...],
  "constraints": ["constraint1", ...],
  "agent_name": "Requirements Analyst",
  "file_name": "sample.docx",
  "timestamp": "2026-02-05T...",
  "raw_response": "..." // If JSON parsing fails
}
```

**Processing**:
1. Validates document content exists
2. Creates LLM prompt with document text
3. Calls Azure OpenAI API
4. Parses JSON response (handles markdown code blocks)
5. Returns structured result

---

### Agent 2: User Story Creator

**Purpose**: Transform requirements into user stories

**Function**: `user_story_creator_agent(file_name: str)`

**Input**:
- `file_name`: Name of uploaded DOCX file
- Implicitly uses Agent 1 output (requirements analysis)

**LLM Prompt Structure**:
```
System: "You are an expert in creating user stories..."
User: "Based on this requirements document: [DOCUMENT TEXT]
       Create minimum 15-20 user stories in format:
       'As a [user], I want [feature], so that [benefit]'"
```

**LLM Configuration**:
- Model: `gpt-4.1`
- Temperature: `0.3`
- Max Tokens: `8000` (increased for bulk output)

**Output Structure**:
```json
{
  "user_stories": [
    {
      "id": "US-001",
      "title": "User Story Title",
      "user_story": "As a user, I want...",
      "acceptance_criteria": ["criteria1", "criteria2"],
      "priority": "High"
    },
    ...
  ],
  "summary": "Generated X user stories...",
  "agent_name": "User Story Creator",
  "file_name": "sample.docx",
  "timestamp": "...",
  "raw_response": "..." // Fallback if parsing fails
}
```

**Processing**:
1. Reads document text
2. Creates prompt requesting bulk user stories (15-20 minimum)
3. Calls LLM
4. Parses JSON, handles markdown
5. Saves to DOCX file (using python-docx)
6. Returns structured result

---

### Agent 3: Test Case Generator

**Purpose**: Generate comprehensive test cases from user stories

**Function**: `test_case_generator_agent(file_name: str, user_stories: dict)`

**Input**:
- `file_name`: Name of uploaded DOCX file
- `user_stories`: Output from Agent 2 (user stories dict)

**LLM Prompt Structure**:
```
System: "You are an expert in creating comprehensive test cases..."
User: "Based on requirements: [DOCUMENT TEXT]
       And user stories: [USER_STORIES_JSON]
       Generate minimum 50-100 test cases.
       Create 3-5 test cases per user story covering:
       - Positive scenarios
       - Negative scenarios
       - Boundary conditions
       - Edge cases"
```

**LLM Configuration**:
- Model: `gpt-4.1`
- Temperature: `0.3`
- Max Tokens: `16000` (largest - for bulk test cases)

**Output Structure**:
```json
{
  "test_cases": [
    {
      "id": "TC-001",
      "title": "Test Case Title",
      "description": "Test case description",
      "preconditions": ["precondition1", ...],
      "test_steps": ["step1", "step2", ...],
      "expected_results": "Expected result description",
      "priority": "High",
      "test_type": "Functional",
      "user_story_id": "US-001"
    },
    ...
  ],
  "summary": "Generated X test cases...",
  "agent_name": "Test Case Generator",
  "file_name": "sample.docx",
  "timestamp": "...",
  "raw_response": "..."
}
```

**Processing**:
1. Reads document text
2. Extracts user stories from Agent 2 output
3. Creates prompt with both document and user stories
4. Calls LLM requesting bulk test cases (50-100 minimum)
5. Parses JSON response
6. Saves to JSON file
7. Returns structured result

---

### Agent 4: Test Data Generator

**Purpose**: Generate realistic Test Data for test cases

**Function**: `test_dATF_generator_agent(file_name: str, test_cases: dict)`

**Input**:
- `file_name`: Name of uploaded DOCX file
- `test_cases`: Output from Agent 3 (test cases dict)

**LLM Prompt Structure**:
```
System: "You are an expert in generating Test Data..."
User: "Based on requirements: [DOCUMENT TEXT]
       And test cases: [TEST_CASES_JSON]
       Generate Test Data for EACH test case.
       Create 2-3 dATF sets per test case:
       - Positive Test Data
       - Negative Test Data
       - Boundary Test Data"
```

**LLM Configuration**:
- Model: `gpt-4.1`
- Temperature: `0.3`
- Max Tokens: `12000` (large - for comprehensive Test Data)

**Output Structure**:
```json
{
  "test_dATF": [
    {
      "test_case_id": "TC-001",
      "dATF_set_name": "Positive Test Data",
      "dATF": {
        "field1": "value1",
        "field2": "value2",
        ...
      },
      "description": "Test Data description"
    },
    ...
  ],
  "summary": "Generated X Test Data sets...",
  "agent_name": "Test Data Generator",
  "file_name": "sample.docx",
  "timestamp": "...",
  "raw_response": "..." // Often contains actual dATF if parsing fails
}
```

**Processing**:
1. Reads document text
2. Extracts test cases from Agent 3 output
3. Creates prompt with both document and test cases
4. Calls LLM requesting comprehensive Test Data
5. Parses JSON response (handles double-encoded JSON strings)
6. Saves to JSON file
7. Returns structured result

---

## DATF Flow & State Management

### Backend State Management

**In-Memory Storage**:
```python
uploaded_files = {
    "sample.docx": {
        "filename": "sample.docx",
        "content": "extracted text from DOCX...",
        "size": 12345,
        "uploaded_at": "2026-02-05T..."
    }
}
```

**Agent Execution State**:
```python
results = {
    "1_requirements_analyst": {...},      # Agent 1 output
    "2_user_story_creator": {...},         # Agent 2 output
    "3_test_case_generator": {...},         # Agent 3 output
    "4_test_dATF_generator": {...},        # Agent 4 output
    "test_coverage": {...},                # Calculated coverage
    "excel_file": "path/to/file.xlsx"      # Excel export path
}
```

### DATF Passing Between Agents

**Agent 1 → Agent 2**:
- Agent 2 receives: `file_name` only
- Agent 2 reads: Document text directly from `uploaded_files`
- Agent 2 uses: Implicit understanding of requirements (not explicit Agent 1 output)

**Agent 2 → Agent 3**:
- Agent 3 receives: `file_name` + `user_story_result` (dict)
- Agent 3 extracts: `user_story_result["user_stories"]` array
- Agent 3 uses: User stories in LLM prompt

**Agent 3 → Agent 4**:
- Agent 4 receives: `file_name` + `test_case_result` (dict)
- Agent 4 extracts: `test_case_result["test_cases"]` array
- Agent 4 uses: Test cases in LLM prompt

### Frontend State Management

**React State Variables**:
```javascript
const [agentResults, setAgentResults] = useState({})
const [currentAgent, setCurrentAgent] = useState(null)
const [completedAgents, setCompletedAgents] = useState([])
const [sessionMessages, setSessionMessages] = useState([])
```

**State Flow**:
1. User uploads file → `uploadedFiles` state updated
2. User clicks "Run Agents" → `isRunning = true`
3. Visual transitions → `currentAgent` updates for each agent
4. API call completes → `agentResults` populated with all agent outputs
5. UI updates → Summary tab displays results

---

## Implementation Details

### JSON Parsing Strategy

**Problem**: LLM responses may be:
- Wrapped in markdown code blocks: ` ```json {...} ``` `
- Double-encoded JSON strings: `"{\"test_dATF\": [...]}"`
- Plain JSON objects
- Plain text (if JSON parsing fails)

**Solution - Multi-Layer Parsing**:

```python
def parse_agent_response(result_text):
    # Step 1: Remove markdown code blocks
    if "```json" in result_text:
        cleaned = result_text.split("```json")[1].split("```")[0].strip()
    elif "```" in result_text:
        cleaned = result_text.split("```")[1].split("```")[0].strip()
    else:
        cleaned = result_text.strip()
    
    # Step 2: Try parsing as JSON
    try:
        parsed = json.loads(cleaned)
        return parsed
    except json.JSONDecodeError:
        # Step 3: If it's a string that looks like JSON, parse again
        if isinstance(cleaned, str) and cleaned.startswith('{'):
            try:
                double_parsed = json.loads(cleaned)
                if isinstance(double_parsed, str):
                    return json.loads(double_parsed)
                return double_parsed
            except:
                pass
        
        # Step 4: Fallback - return raw response
        return {
            "raw_response": result_text,
            "analysis": result_text  # For requirements analyst
        }
```

**Post-Processing Parsing**:
After all agents complete, the system attempts to parse `raw_response` if arrays are empty:

```python
# In run_all_agents() function
test_dATF_list = test_dATF_result.get("test_dATF", [])
if not test_dATF_list and "raw_response" in test_dATF_result:
    # Try parsing raw_response
    # Handle double-encoded JSON
    # Update test_dATF_result["test_dATF"] with parsed dATF
```

### LLM Call Pattern

**Standard Pattern for Each Agent**:
```python
# 1. Get Azure OpenAI client
client = get_azure_client()

# 2. Build prompt
prompt = f"""You are a [Agent Role]...
[Instructions]
[Input DATF]
[Output Format Requirements]
"""

# 3. Call LLM
response = client.chat.completions.create(
    model=AZURE_DEPLOYMENT,  # "gpt-4.1"
    messages=[
        {"role": "system", "content": "System message..."},
        {"role": "user", "content": prompt}
    ],
    temperature=0.3,
    max_tokens=4000  # Varies by agent
)

# 4. Extract response
result_text = response.choices[0].message.content

# 5. Parse JSON
result_json = parse_agent_response(result_text)

# 6. Add metadATF
result_json["agent_name"] = "Agent Name"
result_json["file_name"] = file_name
result_json["timestamp"] = datetime.now().isoformat()

# 7. Save to file (if applicable)
save_output_to_file(result_json)

# 8. Return result
return result_json
```

### File Storage Pattern

**Output Directory Structure**:
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

**File Saving Logic**:
- Each agent saves its output immediately after generation
- JSON files: Direct JSON dump with indentation
- DOCX files: Formatted using python-docx library
- Excel files: Created after all agents complete (combines test cases + Test Data)

---

## Error Handling & Resilience

### Error Handling Strategy

**1. JSON Parsing Errors**:
```python
try:
    result_json = json.loads(cleaned_text)
except json.JSONDecodeError as e:
    print(f"JSON parsing error: {e}")
    print(f"Response preview: {result_text[:500]}")
    # Fallback: Store raw response
    result_json = {
        "raw_response": result_text,
        "analysis": result_text
    }
```

**2. Empty Array Detection**:
```python
if not result_json.get("test_dATF") or len(result_json.get("test_dATF", [])) == 0:
    print(f"Warning: No Test Data found. Raw response length: {len(result_text)}")
    result_json["raw_response"] = result_text
```

**3. Post-Processing Recovery**:
```python
# After all agents complete, try to recover dATF from raw_response
if not test_dATF_list and "raw_response" in test_dATF_result:
    # Attempt to parse raw_response
    # Handle double-encoded JSON
    # Update the result object
    test_dATF_result["test_dATF"] = parsed_dATF
```

**4. Graceful Degradation**:
- If agent fails: Returns error message, other agents can still run
- If parsing fails: Stores raw_response for manual inspection
- If Excel export fails: JSON files still available
- Frontend displays: "Check raw_response in full output" messages

### Resilience Features

1. **Multiple Parsing Attempts**: Tries direct parse, markdown removal, double-parse
2. **Raw Response Preservation**: Always stores original LLM response
3. **Partial Success**: If one agent fails, others can still succeed
4. **Logging**: Comprehensive error logging for debugging
5. **User Feedback**: Clear error messages in UI

---

## Output Management

### Excel Export Process

**Function**: `export_to_excel(file_name: str, test_cases: dict, test_dATF: dict)`

**Process**:
1. Create Excel workbook using `openpyxl`
2. Create "Test Cases" sheet
   - Parse test cases from dict or raw_response
   - Handle field name variations (id vs test_case_id)
   - Format nested structures (preconditions, test_steps)
   - Auto-adjust column widths
3. Create "Test Data" sheet
   - Parse Test Data from dict or raw_response
   - Handle double-encoded JSON strings
   - Format nested dATF structures
   - Auto-adjust column widths
4. Save to `Output/Excel/{filename}_TestCases_TestDATF.xlsx`

**Key Features**:
- Handles missing dATF gracefully
- Formats nested JSON structures for readability
- Auto-sizes columns
- Professional styling (headers with colors)

### ZIP Download

**Endpoint**: `GET /download-outputs/{file_name}`

**Process**:
1. Create in-memory ZIP file
2. Add all generated outputs:
   - User Story DOCX
   - Test Cases JSON
   - Test Data JSON
   - Test Coverage JSON
   - Excel file
3. Return ZIP as downloadable file

---

## Key Design Decisions

### Why Sequential, Not Parallel?

**Reason**: DATF dependencies
- Agent 2 needs Agent 1's analysis (implicitly)
- Agent 3 needs Agent 2's user stories (explicitly)
- Agent 4 needs Agent 3's test cases (explicitly)

**Trade-off**: Slower execution, but ensures quality and correctness

### Why Separate Agents?

**Reason**: Specialization
- Each agent has focused expertise
- Better prompt engineering for specific tasks
- Easier to debug and improve individual agents
- Can be swapped/upgraded independently

### Why JSON Output?

**Reason**: Structured dATF
- Easy to parse and process
- Can be stored, versioned, and analyzed
- Enables Excel export
- Supports frontend display

### Why Store raw_response?

**Reason**: Resilience
- LLM responses may not always be valid JSON
- Allows manual inspection and recovery
- Enables post-processing parsing
- Better debugging capabilities

---

## Usage Example

### Complete Workflow

```python
# 1. User uploads file
POST /upload
→ File stored in uploaded_files dict

# 2. User triggers agent execution
POST /run-all-agents
Body: {"file_name": "sample.docx"}

# 3. Backend executes pipeline
results = {}
req_result = await requirements_analyst_agent("sample.docx")
results["1_requirements_analyst"] = req_result

user_story_result = await user_story_creator_agent("sample.docx")
results["2_user_story_creator"] = user_story_result

test_case_result = await test_case_generator_agent("sample.docx", user_story_result)
results["3_test_case_generator"] = test_case_result

test_dATF_result = await test_dATF_generator_agent("sample.docx", test_case_result)
results["4_test_dATF_generator"] = test_dATF_result

# 4. Post-processing
excel_file = export_to_excel("sample.docx", test_case_result, test_dATF_result)
results["excel_file"] = str(excel_file)

# 5. Return results
return {"results": results}
```

---

## Summary

The ATF agentic framework is a **sequential, specialized, LLM-powered pipeline** that:

1. **Takes** a requirements document (DOCX)
2. **Processes** it through 4 specialized AI agents
3. **Generates** comprehensive test artifacts (user stories, test cases, Test Data)
4. **Exports** results in multiple formats (JSON, DOCX, Excel)
5. **Handles** errors gracefully with fallback mechanisms
6. **Provides** structured, parseable outputs for downstream use

The framework is designed for **reliability**, **resilience**, and **comprehensive output generation**, making it suitable for production use in test automation workflows.

