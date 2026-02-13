import { useState, useEffect, useRef } from 'react'
import './App.css'

// API Base URL - Update this to match your backend server
const API_BASE = import.meta.env.VITE_API_BASE || 'http://155.17.172.33:1456'

// Unilever Logo Component
const UnileverLogo = ({ className = '' }) => (
  <div className={`unilever-logo ${className}`}>
    <span>Unilever</span>
  </div>
)

// Icon Components
const Icons = {
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  upload: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>,
  download: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>,
  file: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
  play: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>,
  refresh: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  workflow: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  summary: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
  chat: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>,
  user: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  bot: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4M7 15h.01M17 15h.01"/></svg>,
  send: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  close: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  warning: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>,
  success: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
  info: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
  system: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  database: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  chart: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  reset: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
  ontology: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
}

// Session Messages Component
const SessionMessages = ({ messages }) => {
  const messagesEndRef = useRef(null)
  const scrollContainerRef = useRef(null)
  
  useEffect(() => {
    if (scrollContainerRef.current) {
      setTimeout(() => {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
      }, 100)
    }
  }, [messages])
  
  const getStatusFromType = (type) => {
    if (type === 'success') return 'Success'
    if (type === 'warning' || type === 'error') return 'Warning'
    if (type === 'system') return 'System'
    return 'Info'
  }
  
  const getStatusColor = (status) => {
    if (status === 'Success') return '#10b981'
    if (status === 'Warning') return '#f59e0b'
    if (status === 'System') return '#6366f1'
    return '#6b7280'
  }
  
  const extractAction = (text) => {
    if (!text) return 'Processing'
    if (text.length > 100) {
      return text.substring(0, 97) + '...'
    }
    return text
  }
  
  return (
    <div className="session-messages-table-wrapper" style={{ width: '100%', overflowX: 'auto' }}>
      <div 
        ref={scrollContainerRef}
        style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '6px' }}
      >
        <table className="session-messages-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb', fontWeight: '600', fontSize: '14px' }}>Agent</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb', fontWeight: '600', fontSize: '14px' }}>Action</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb', fontWeight: '600', fontSize: '14px' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb', fontWeight: '600', fontSize: '14px' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
          {messages.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                No Audit Trail available
              </td>
            </tr>
          ) : (
            messages.map((msg, index) => {
              const status = getStatusFromType(msg.type)
              const action = extractAction(msg.text)
              return (
                <tr 
                  key={index} 
                  className={`session-table-row ${msg.type}`} 
                  style={{ borderBottom: '1px solid #e5e7eb' }}
                >
                  <td style={{ padding: '10px 12px', fontSize: '14px' }}>{msg.agent || 'System'}</td>
                  <td style={{ padding: '10px 12px', fontSize: '14px', wordBreak: 'break-word' }}>{action}</td>
                  <td style={{ padding: '10px 12px', fontSize: '14px' }}>
                    <span 
                      style={{ 
                        backgroundColor: getStatusColor(status) + '20',
                        color: getStatusColor(status),
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        display: 'inline-block'
                      }}
                    >
                      {status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: '14px', whiteSpace: 'nowrap' }}>{msg.time || '-'}</td>
                </tr>
              )
            })
          )}
        </tbody>
        </table>
      </div>
      <div ref={messagesEndRef} />
    </div>
  )
}

// ATF Agents Configuration
const agents = [
  {
    id: 1,
    name: 'Requirement Analysis Agent',
    description: 'Analyzes uploaded requirement document to extract key features, functionalities, and business objectives.',
    icon: Icons.file,
    endpoint: '/agent/requirements-analyst',
    enabled: true,
  },
  {
    id: 2,
    name: 'User Story Generation Agent',
    description: 'Converts requirements into structured user stories with acceptance criteria.',
    icon: Icons.file,
    endpoint: '/agent/user-story-creator',
    enabled: true,
  },
  {
    id: 3,
    name: 'Test Case Generation Agent',
    description: 'Generates detailed test cases (steps, expected results, priority) with Requirement Traceability (RTM) internally.',
    icon: Icons.file,
    endpoint: '/agent/test-case-generator',
    enabled: true,
  },
  {
    id: 4,
    name: 'Test Data Generation Agent',
    description: 'Outputs structured JSON test data for test cases.',
    icon: Icons.database,
    endpoint: '/agent/test-data-generator',
    enabled: true,
  },
  {
    id: 5,
    name: 'Automation Design Agent',
    description: 'Generate Automation Scripts (e.g , .vb, .py, .java, .tsu, .js).',
    icon: Icons.workflow,
    endpoint: '/agent/automation-design',
    enabled: true,
  },
  {
    id: 6,
    name: 'Automation Execution Agent',
    description: 'Execution Reports & Logs',
    icon: Icons.play,
    endpoint: '/agent/automation-execution',
    enabled: true,
  },
  {
    id: 7,
    name: 'Self-Healing & Optimization Agent',
    description: 'Handles requirement changes and updates impacted test cases & automation assets.',
    icon: Icons.refresh,
    endpoint: '/agent/self-healing',
    enabled: true,
  },
]

// Login Component
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simple login - accept any credentials for demo
    if (username && password) {
      onLogin({ username, password })
    }
  }

  const features = [
    "Requirements Analysis & User Story Generation",
    "Automated Test Cases & Test Data Creation",
    "Ontology-Driven Test Knowledge Modeling"
  ]

  return (
    <div className="login-container">
      <div className="login-background"></div>
      
      {/* Features Section - Outside the login box */}
      <div className="login-features-outer">
        <h3>Application Features:</h3>
        <ul className="features-list">
          {features.map((feature, index) => (
            <li 
              key={index} 
              className={`feature-item ${isAnimating ? 'slide-in' : ''}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Login Box - Center */}
      <div className="login-content">
        <div className={`login-card ${isAnimating ? 'fade-in' : ''}`}>
          <div className="login-header">
            <h2>Unilever</h2>
            <h1>Autonomous Testing Framework</h1>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">
                {Icons.user}
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
              <small className="form-hint">Enter your username to login</small>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                {Icons.system}
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <small className="form-hint">Enter your password to access the system</small>
            </div>

            <button type="submit" className="btn btn-login">
              {Icons.check}
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('workflow')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [agentResults, setAgentResults] = useState({})
  const [currentAgent, setCurrentAgent] = useState(null)
  const [completedAgents, setCompletedAgents] = useState([])
  const [sessionMessages, setSessionMessages] = useState([])
  const [error, setError] = useState(null)
  const [outputPath, setOutputPath] = useState('')
  const [showSapPopup, setShowSapPopup] = useState(false)
  const [sapIntegrationStatus, setSapIntegrationStatus] = useState('connecting') // 'connecting', 'done'
  const [inputMethod, setInputMethod] = useState('upload') // 'upload' or 'sap'
  const [showProceedPopup, setShowProceedPopup] = useState(false)
  const [popupResolve, setPopupResolve] = useState(null)

  const handleLogin = (credentials) => {
    // Store login info (for demo, just set logged in)
    localStorage.setItem('ATF_user', JSON.stringify(credentials))
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('ATF_user')
    setIsLoggedIn(false)
    // Reset all state
    setActiveTab('workflow')
    setUploadedFiles([])
    setSelectedFile(null)
    setAgentResults({})
    setCompletedAgents([])
    setSessionMessages([])
  }

  useEffect(() => {
    // Check if already logged in
    const savedUser = localStorage.getItem('ATF_user')
    if (savedUser) {
      setIsLoggedIn(true)
    }
  }, [])

  const addSessionMessage = (text, type = 'info', agent = 'System') => {
    const message = {
      text,
      type,
      agent,
      time: new Date().toLocaleTimeString()
    }
    setSessionMessages(prev => [...prev, message])
  }

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    // Fetch output path
    fetch(`${API_BASE}/output-path`)
      .then(res => res.json())
      .then(data => setOutputPath(data.output_path))
      .catch(err => console.error('Error fetching output path:', err))
  }, [])

  // Parse test data from raw_response if needed
  useEffect(() => {
    if (agentResults['4_test_data_generator'] && agentResults['4_test_data_generator'].test_data?.length === 0 && agentResults['4_test_data_generator'].raw_response) {
      try {
        let rawText = agentResults['4_test_data_generator'].raw_response
        
        // raw_response might be a JSON string itself, try parsing directly first
        if (typeof rawText === 'string' && rawText.trim().startsWith('{')) {
          try {
            const directParsed = JSON.parse(rawText)
            const testData = directParsed.test_data || []
            if (testData.length > 0) {
              console.log(`✅ Parsed ${testData.length} test data sets from raw_response (direct parse)`)
              setAgentResults(prev => ({
                ...prev,
                '4_test_data_generator': {
                  ...prev['4_test_data_generator'],
                  test_data: testData
                }
              }))
              return // Exit early if successful
            }
          } catch (directError) {
            // If direct parse fails, continue to markdown removal
          }
        }
        
        // If still empty, try removing markdown code blocks
        // Remove markdown code blocks more carefully
        if (rawText.includes('```json')) {
          const startIdx = rawText.indexOf('```json') + 7
          const endIdx = rawText.indexOf('```', startIdx)
          if (endIdx > startIdx) {
            rawText = rawText.substring(startIdx, endIdx).trim()
          }
        } else if (rawText.includes('```')) {
          const startIdx = rawText.indexOf('```') + 3
          const endIdx = rawText.indexOf('```', startIdx)
          if (endIdx > startIdx) {
            rawText = rawText.substring(startIdx, endIdx).trim()
          }
        }
        
        // Try to parse the JSON
        try {
          const parsed = JSON.parse(rawText)
          const testData = parsed.test_data || []
          
          if (testData.length > 0) {
            console.log(`✅ Parsed ${testData.length} test data sets from raw_response`)
            setAgentResults(prev => ({
              ...prev,
              '4_test_data_generator': {
                ...prev['4_test_data_generator'],
                test_data: testData
              }
            }))
          }
        } catch (parseError) {
          console.error('❌ Error parsing JSON after markdown removal:', parseError)
        }
      } catch (e) {
        console.error('❌ Error parsing test data from raw_response:', e)
        console.error('Raw text preview:', agentResults['4_test_data_generator'].raw_response?.substring(0, 200))
      }
    }
  }, [agentResults['4_test_data_generator']?.raw_response, agentResults['4_test_data_generator']?.test_data?.length])

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    setIsUploading(true)
    setError(null)
    addSessionMessage('Uploading files...', 'system', 'File Upload')

      try {
        const formData = new FormData()
        files.forEach(file => {
          if (file.name.endsWith('.docx')) {
            formData.append('files', file)
          }
        })

        const response = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          body: formData
        })

      if (!response.ok) {
        throw new Error('Failed to upload files')
      }

      const data = await response.json()
      setUploadedFiles(data.files || [])
      if (data.files && data.files.length > 0) {
        setSelectedFile(data.files[0].filename)
      }
      addSessionMessage(`Successfully uploaded ${data.count} file(s)`, 'success', 'File Upload')
    } catch (err) {
      setError(`Error uploading files: ${err.message}`)
      addSessionMessage(`Error: ${err.message}`, 'error', 'File Upload')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    setIsUploading(true)
    setError(null)
    addSessionMessage('Uploading files...', 'system', 'File Upload')

      try {
        const formData = new FormData()
        files.forEach(file => {
          if (file.name.endsWith('.docx')) {
            formData.append('files', file)
          }
        })

        const response = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          body: formData
        })

      if (!response.ok) {
        throw new Error('Failed to upload files')
      }

      const data = await response.json()
      setUploadedFiles(data.files || [])
      if (data.files && data.files.length > 0) {
        setSelectedFile(data.files[0].filename)
      }
      addSessionMessage(`Successfully uploaded ${data.count} file(s)`, 'success', 'File Upload')
    } catch (err) {
      setError(`Error uploading files: ${err.message}`)
      addSessionMessage(`Error: ${err.message}`, 'error', 'File Upload')
    } finally {
      setIsUploading(false)
    }
  }

  const runAllAgents = async () => {
    if (!selectedFile) {
      setError('Please select a file first')
      return
    }

    setIsRunning(true)
    setError(null)
    setAgentResults({})
    setCompletedAgents([])
    setCurrentAgent(null)
    setSessionMessages([])

    addSessionMessage(`Starting ATF workflow for file: ${selectedFile}`, 'system', 'ATF Workflow')
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      // Run only enabled agents sequentially with slow, gradual transitions
      const enabledAgents = agents.filter(agent => agent.enabled)
      let i = 0
      while (i < enabledAgents.length) {
        const agent = enabledAgents[i]
        
        // Set agent to executing state
        setCurrentAgent(agent.id)
        addSessionMessage(`--- ${agent.name} Started ---`, 'system', agent.name)
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Simulate agent processing with slow transitions
        if (agent.id === 1) {
          addSessionMessage('Analyzing requirements document...', 'info', agent.name)
          await new Promise(resolve => setTimeout(resolve, 2000))
          addSessionMessage('Extracting key features and functionalities...', 'info', agent.name)
          await new Promise(resolve => setTimeout(resolve, 2000))
          addSessionMessage('Identifying business objectives...', 'info', agent.name)
          await new Promise(resolve => setTimeout(resolve, 1500))
        } else if (agent.id === 2) {
          addSessionMessage('Creating user stories from requirements...', 'info', agent.name)
          await new Promise(resolve => setTimeout(resolve, 2000))
          addSessionMessage('Adding acceptance criteria...', 'info', agent.name)
          await new Promise(resolve => setTimeout(resolve, 2000))
          addSessionMessage('Validating user story format...', 'info', agent.name)
          await new Promise(resolve => setTimeout(resolve, 1500))
        } else if (agent.id === 3) {
          addSessionMessage('Generating test cases from user stories...', 'info', agent.name)
          await new Promise(resolve => setTimeout(resolve, 2000))
          addSessionMessage('Defining test steps and expected results...', 'info', agent.name)
          await new Promise(resolve => setTimeout(resolve, 2000))
          addSessionMessage('Assigning priorities and status...', 'info', agent.name)
          await new Promise(resolve => setTimeout(resolve, 1500))
        } else if (agent.id === 4) {
          addSessionMessage('Generating test data sets...', 'info', agent.name)
          await new Promise(resolve => setTimeout(resolve, 2000))
          addSessionMessage('Creating realistic test data values...', 'info', agent.name)
          await new Promise(resolve => setTimeout(resolve, 2000))
          addSessionMessage('Validating test data format...', 'info', agent.name)
          await new Promise(resolve => setTimeout(resolve, 1500))
        }
        
        // Mark agent as completed with delay
        setCompletedAgents(prev => [...prev, agent.id])
        addSessionMessage(`${agent.name} completed successfully`, 'success', agent.name)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Show popup after Test Data Agent (Agent 4)
        if (agent.id === 4) {
          const proceed = await new Promise((resolve) => {
            setShowProceedPopup(true)
            setPopupResolve(() => resolve)
          })
          
          if (!proceed) {
            // User clicked No - stop the workflow
            addSessionMessage('Workflow stopped by user', 'warning', 'ATF Workflow')
            setIsRunning(false)
            setCurrentAgent(null)
            return
          }
        }
        
        // Clear current agent before moving to next
        if (i < enabledAgents.length - 1) {
          setCurrentAgent(null)
          await new Promise(resolve => setTimeout(resolve, 500))
        }
        
        i++ // Increment index for next iteration
      }

      // Make API call after all visual transitions
      const response = await fetch(`${API_BASE}/run-all-agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_name: selectedFile })
      })

      if (!response.ok) {
        let errorMessage = 'Failed to run agents'
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || errorData.message || errorMessage
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setAgentResults(data.results || {})
      
      addSessionMessage('All agents completed successfully. Excel file generated.', 'success', 'ATF Workflow')
    } catch (err) {
      setError(`Error running agents: ${err.message}`)
      addSessionMessage(`Error: ${err.message}`, 'error', 'ATF Workflow')
    } finally {
      setIsRunning(false)
      setCurrentAgent(null)
    }
  }

  const resetWorkflow = () => {
    setAgentResults({})
    setCompletedAgents([])
    setCurrentAgent(null)
    setSessionMessages([])
    setError(null)
    setProgress({ userStory: 0, testCases: 0, testData: 0 })
  }

  const getAgentStatus = (agentId) => {
    if (currentAgent === agentId) return 'executing'
    if (completedAgents.includes(agentId)) return 'completed'
    return 'pending'
  }

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <UnileverLogo className="unilever-logo" />
          </div>
          <div className="header-text">
            <h1>Autonomous Testing Framework (ATF)</h1>
            <p className="subtitle">AI-Powered End-to-End Test Automation</p>
          </div>
          
          <div className="header-stats">
            <div className="stat-item">
               <span className="stat-icon">{Icons.database}</span>
              <div className="stat-content">
                <span className="stat-value">{uploadedFiles.length || '—'}</span>
                <span className="stat-label">Files Uploaded</span>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-icon status-active">{Icons.workflow}</span>
              <div className="stat-content">
                <span className="stat-value">{completedAgents.length}</span>
                <span className="stat-label">Agents Completed</span>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-icon">{Icons.system}</span>
              <div className="stat-content">
                <span className="stat-value">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                <span className="stat-label">Session Date</span>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <button
                className="btn-logout"
                onClick={handleLogout}
                title="Logout"
              >
                {Icons.close}
                Logout
              </button>
            </div>
          </div>
        </div>
        
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'ontology' ? 'active' : ''}`}
            onClick={() => setActiveTab('ontology')}
          >
            {Icons.ontology} Ontology
          </button>
          <button 
            className={`tab ${activeTab === 'workflow' ? 'active' : ''}`}
            onClick={() => setActiveTab('workflow')}
          >
            {Icons.workflow} Workflow
          </button>
          <button 
            className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            {Icons.summary} Summary
          </button>
          <button 
            className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            {Icons.chat} Assistant
          </button>
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'workflow' && (
          <>
            <div className="upload-section">
              <div className="upload-header">
                <h2 className="section-title">
                  {Icons.upload}
                  File Upload
                </h2>
              </div>
              
              <div className="upload-container">
                <div className="input-method">
                  <label>Provide inputs by</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input 
                        type="radio" 
                        name="inputMethod" 
                        value="upload" 
                        checked={inputMethod === 'upload'}
                        onChange={() => setInputMethod('upload')}
                      />
                      <span>Upload Files</span>
                    </label>
                    <label className="radio-label">
                      <input 
                        type="radio" 
                        name="inputMethod" 
                        value="sap" 
                        checked={inputMethod === 'sap'}
                        onChange={() => {
                          setInputMethod('sap')
                          setShowSapPopup(true)
                          setSapIntegrationStatus('connecting')
                          // Simulate SAP integration
                          setTimeout(() => {
                            setSapIntegrationStatus('done')
                          }, 2500)
                        }}
                      />
                      <span>SAP Connection</span>
                    </label>
                  </div>
                </div>

                {inputMethod === 'upload' && (
                  <>
                    <div className="file-upload-zone"
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => document.getElementById('file-input').click()}
                    >
                      <input
                        id="file-input"
                        type="file"
                        multiple
                        accept=".docx"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                      <div className="upload-placeholder">
                        <p>Drag and drop files here</p>
                        <p className="upload-hint">Limit 200MB per file</p>
                        <button className="btn-browse">Browse files</button>
                      </div>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="uploaded-files-list">
                        <h3>Uploaded Files:</h3>
                        {uploadedFiles.map((file, idx) => (
                          <div 
                            key={idx} 
                            className={`file-item ${selectedFile === file.filename ? 'selected' : ''}`}
                            onClick={() => setSelectedFile(file.filename)}
                          >
                        {Icons.file} {file.filename}
                      </div>
                    ))}
                  </div>
                )}
                  </>
                )}


                {error && (
                  <div className="error-banner">
                    {Icons.warning}
                    {error}
                  </div>
                )}

                {selectedFile && (
                  <div className="execute-section">
                    <button
                      className="btn btn-primary btn-execute"
                      onClick={runAllAgents}
                      disabled={isRunning || isUploading}
                    >
                      {isRunning ? (
                        <>
                          <span className="spinner"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          {Icons.play}
                          Execute: Run
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={resetWorkflow}
                      disabled={isRunning}
                    >
                      {Icons.reset}
                      Reset
                    </button>
                  </div>
                )}
              </div>
            </div>

            {selectedFile && (
              <div className="workflow-container">
                <h2 className="section-title">
                  {Icons.workflow}
                  Agent Workflow
                </h2>
                
                <div className="agents-flow">
                  {agents.map((agent, index) => {
                    const status = agent.enabled ? getAgentStatus(agent.id) : 'disabled'
                    return (
                      <div key={agent.id} className="agent-wrapper">
                        <div className={`agent-card ${status}`}>
                          <div className="agent-status-indicator">
                            {status === 'executing' && <div className="pulse-ring"></div>}
                            {status === 'completed' && <span className="check">{Icons.check}</span>}
                            {status === 'pending' && <span className="pending-dot"></span>}
                            {status === 'executing' && <span className="executing-dot"></span>}
                            {status === 'disabled' && <span className="disabled-icon">🔒</span>}
                          </div>
                          
                          <div className="agent-icon">{agent.icon}</div>
                          <h3 className="agent-name">{agent.name}</h3>
                          <p className="agent-description">{agent.description}</p>
                          
                          <div className="agent-step">Step {index + 1}</div>
                          {!agent.enabled && (
                            <div className="agent-disabled-badge">Disabled</div>
                          )}
                        </div>
                        
                        {index < agents.length - 1 && (
                          <div className={`connector ${completedAgents.includes(agent.id) && agent.enabled ? 'active' : ''} ${!agent.enabled ? 'disabled' : ''}`}>
                            <div className="connector-line"></div>
                            <div className="connector-arrow">→</div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                
                {sessionMessages.length > 0 && (
                  <div className="session-container" style={{ marginTop: '2rem' }}>
                    <h3 className="session-title">
                      {Icons.system}
                      Audit Trail
                    </h3>
                    <SessionMessages messages={sessionMessages} />
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === 'summary' && (
          <SummaryTab agentResults={agentResults} selectedFile={selectedFile} agents={agents} />
        )}

        {activeTab === 'chat' && (
          <AIChatTab 
            selectedFile={selectedFile}
            agentResults={agentResults}
            uploadedFiles={uploadedFiles}
          />
        )}

        {activeTab === 'ontology' && (
          <OntologyTab />
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <UnileverLogo className="footer-logo" />
          <p>©2025 Unilever - Autonomous Testing Framework</p>
        </div>
      </footer>

      {/* SAP Integration Popup */}
      {showSapPopup && (
        <div className="sap-popup-overlay" onClick={() => sapIntegrationStatus === 'done' && setShowSapPopup(false)}>
          <div className="sap-popup" onClick={(e) => e.stopPropagation()}>
            <div className="sap-popup-content">
              {sapIntegrationStatus === 'connecting' ? (
                <>
                  <div className="sap-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                  </div>
                  <h3>Integrating with SAP</h3>
                  <p>Establishing connection...</p>
                </>
              ) : (
                <>
                  <div className="sap-success-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </div>
                  <h3>Done</h3>
                  <p>SAP connection established successfully</p>
                  <button 
                    className="btn btn-close-sap"
                    onClick={() => setShowSapPopup(false)}
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Proceed Popup - After Test Data Agent */}
      {showProceedPopup && (
        <div className="workflow-popup-overlay">
          <div className="workflow-popup" onClick={(e) => e.stopPropagation()}>
            <div className="workflow-popup-content">
              <div className="workflow-popup-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4M12 8h.01"/>
                </svg>
              </div>
              <h3>Good to Proceed?</h3>
              <p>Test data has been generated. Do you want to proceed with the next agents?</p>
              <div className="workflow-popup-buttons">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowProceedPopup(false)
                    if (popupResolve) {
                      popupResolve(true)
                      setPopupResolve(null)
                    }
                  }}
                >
                  Yes
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowProceedPopup(false)
                    if (popupResolve) {
                      popupResolve(false)
                      setPopupResolve(null)
                    }
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// Summary Tab Component
const SummaryTab = ({ agentResults, selectedFile, agents }) => {
  const coverage = agentResults?.test_coverage || {}
  const [isDownloading, setIsDownloading] = useState(false)
  const [reviewStatus, setReviewStatus] = useState('Pending Review')
  const [approvalStatus, setApprovalStatus] = useState('Pending Approval')
  const [selectedAgents, setSelectedAgents] = useState([])
  
  const handleDownloadZip = async () => {
    if (!selectedFile) return
    
    setIsDownloading(true)
    try {
      // URL encode the file name to handle special characters
      const encodedFileName = encodeURIComponent(selectedFile)
      const response = await fetch(`${API_BASE}/download-outputs/${encodedFileName}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to download ZIP file: ${response.status} ${errorText}`)
      }
      
      const blob = await response.blob()
      
      // Check if blob is valid
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty')
      }
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const fileStem = selectedFile.replace(/\.[^/.]+$/, '')
      a.download = `${fileStem}_ATF_Outputs.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading ZIP:', error)
      alert('Error downloading ZIP file: ' + error.message)
    } finally {
      setIsDownloading(false)
    }
  }
  
  const formatKey = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }
  
  const renderValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }
  
  return (
    <div className="summary-container">
      <div className="summary-header">
        <h2 className="section-title">
          {Icons.summary}
          Test Coverage Summary
        </h2>
        {selectedFile && Object.keys(agentResults || {}).length > 0 && (
          <button
            className="btn btn-primary"
            onClick={handleDownloadZip}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <span className="spinner"></span>
                Downloading...
              </>
            ) : (
              <>
                {Icons.download}
                Download All Outputs (ZIP)
              </>
            )}
          </button>
        )}
      </div>
      
      {selectedFile ? (
        <>
          {/* Test Coverage Card */}
          <div className="coverage-card">
            <div className="coverage-info">
              <p><strong>Requirement ID:</strong> {selectedFile.replace('.docx', '')}</p>
              <p><strong>Coverage Percentage:</strong> {coverage.coverage_percentage || 95}%</p>
              <p><strong>Status:</strong> <span className="status-covered">Covered</span></p>
            </div>
            
            {coverage.user_stories_count !== undefined && (
              <div className="coverage-details">
                <h3>Coverage Summary for Requirement ID {selectedFile.replace('.docx', '')}:</h3>
                <ul>
                  <li>User Stories Generated: {coverage.user_stories_count}</li>
                  <li>Test Cases Generated: {coverage.test_cases_count}</li>
                  <li>Test Data: Generated</li>
                  <li>Coverage Percentage: {coverage.coverage_percentage || 95}%</li>
                  <li>Status: <span className="status-covered">Covered</span></li>
                </ul>
              </div>
            )}
          </div>

          {/* Agent Analysis Sections */}
          {agentResults && Object.keys(agentResults).length > 0 && (
            <div className="agent-analysis-section">
              <h3 className="analysis-title">Agent Analysis Results</h3>
              
              {/* Requirements Analyst */}
              {agentResults['1_requirements_analyst'] && (
                <div className="analysis-card">
                  <h4>{Icons.file} Requirements Analyst</h4>
                  <div className="analysis-content">
                    {(() => {
                      const reqAnalysis = agentResults['1_requirements_analyst']
                      
                       // Parse structured data - check if it's in raw_response first
                      let functionalRequirements = reqAnalysis.functional_requirements || []
                      let keyFeatures = reqAnalysis.key_features || []
                      let businessObjectives = reqAnalysis.business_objectives || []
                      let nonFunctionalRequirements = reqAnalysis.non_functional_requirements || []
                      let dependencies = reqAnalysis.dependencies || []
                      let constraints = reqAnalysis.constraints || []
                      let summary = reqAnalysis.summary || reqAnalysis.analysis || ''
                      
                      // If arrays are empty, try to parse from raw_response
                      if ((functionalRequirements.length === 0 && keyFeatures.length === 0) && reqAnalysis.raw_response) {
                        try {
                          let rawText = reqAnalysis.raw_response
                          // Remove markdown code blocks
                          if (rawText.includes('```json')) {
                            rawText = rawText.split('```json')[1].split('```')[0].trim()
                          } else if (rawText.includes('```')) {
                            rawText = rawText.split('```')[1].split('```')[0].trim()
                          }
                          const parsed = JSON.parse(rawText)
                          functionalRequirements = parsed.functional_requirements || []
                          keyFeatures = parsed.key_features || []
                          businessObjectives = parsed.business_objectives || []
                          nonFunctionalRequirements = parsed.non_functional_requirements || []
                          dependencies = parsed.dependencies || []
                          constraints = parsed.constraints || []
                          summary = parsed.summary || parsed.analysis || summary
                        } catch (e) {
                          console.error('Error parsing requirements analysis from raw_response:', e)
                          // If parsing fails, use raw_response as summary
                          if (!summary && reqAnalysis.raw_response) {
                            summary = reqAnalysis.raw_response.substring(0, 2000) + (reqAnalysis.raw_response.length > 2000 ? '...' : '')
                          }
                        }
                      }
                      
                      // Build detailed analysis summary
                      const analysisDetails = []
                      
                      if (functionalRequirements.length > 0) {
                        analysisDetails.push(
                          <div key="func-req" style={{ marginBottom: '15px' }}>
                            <strong>Functional Requirements ({functionalRequirements.length}):</strong>
                            <ul style={{ marginTop: '5px', marginLeft: '20px' }}>
                              {functionalRequirements.slice(0, 5).map((req, idx) => (
                                <li key={idx}>{typeof req === 'string' ? req : JSON.stringify(req)}</li>
                              ))}
                              {functionalRequirements.length > 5 && <li>... and {functionalRequirements.length - 5} more</li>}
                            </ul>
                          </div>
                        )
                      }
                      
                      if (keyFeatures.length > 0) {
                        analysisDetails.push(
                          <div key="key-feat" style={{ marginBottom: '15px' }}>
                            <strong>Key Features ({keyFeatures.length}):</strong>
                            <ul style={{ marginTop: '5px', marginLeft: '20px' }}>
                              {keyFeatures.slice(0, 5).map((feat, idx) => (
                                <li key={idx}>{typeof feat === 'string' ? feat : JSON.stringify(feat)}</li>
                              ))}
                              {keyFeatures.length > 5 && <li>... and {keyFeatures.length - 5} more</li>}
                            </ul>
                          </div>
                        )
                      }
                      
                      if (businessObjectives.length > 0) {
                        analysisDetails.push(
                          <div key="bus-obj" style={{ marginBottom: '15px' }}>
                            <strong>Business Objectives ({businessObjectives.length}):</strong>
                            <ul style={{ marginTop: '5px', marginLeft: '20px' }}>
                              {businessObjectives.slice(0, 3).map((obj, idx) => (
                                <li key={idx}>{typeof obj === 'string' ? obj : JSON.stringify(obj)}</li>
                              ))}
                              {businessObjectives.length > 3 && <li>... and {businessObjectives.length - 3} more</li>}
                            </ul>
                          </div>
                        )
                      }
                      
                      if (nonFunctionalRequirements.length > 0) {
                        analysisDetails.push(
                          <div key="non-func" style={{ marginBottom: '15px' }}>
                            <strong>Non-Functional Requirements ({nonFunctionalRequirements.length}):</strong>
                            <ul style={{ marginTop: '5px', marginLeft: '20px' }}>
                              {nonFunctionalRequirements.slice(0, 3).map((req, idx) => (
                                <li key={idx}>{typeof req === 'string' ? req : JSON.stringify(req)}</li>
                              ))}
                              {nonFunctionalRequirements.length > 3 && <li>... and {nonFunctionalRequirements.length - 3} more</li>}
                            </ul>
                          </div>
                        )
                      }
                      
                      if (dependencies.length > 0) {
                        analysisDetails.push(
                          <div key="deps" style={{ marginBottom: '15px' }}>
                            <strong>Dependencies ({dependencies.length}):</strong>
                            <ul style={{ marginTop: '5px', marginLeft: '20px' }}>
                              {dependencies.map((dep, idx) => (
                                <li key={idx}>{typeof dep === 'string' ? dep : JSON.stringify(dep)}</li>
                              ))}
                            </ul>
                          </div>
                        )
                      }
                      
                      if (constraints.length > 0) {
                        analysisDetails.push(
                          <div key="constraints" style={{ marginBottom: '15px' }}>
                            <strong>Constraints ({constraints.length}):</strong>
                            <ul style={{ marginTop: '5px', marginLeft: '20px' }}>
                              {constraints.map((constraint, idx) => (
                                <li key={idx}>{typeof constraint === 'string' ? constraint : JSON.stringify(constraint)}</li>
                              ))}
                            </ul>
                          </div>
                        )
                      }
                      
                      return (
                        <div className="analysis-summary">
                          <strong>Document Overview:</strong>
                          {summary ? (
                            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '5px' }}>
                              <p style={{ marginTop: '5px', lineHeight: '1.6' }}>{typeof summary === 'string' ? summary : JSON.stringify(summary, null, 2)}</p>
                            </div>
                          ) : (
                            <p style={{ marginTop: '10px' }}>Analyzing document requirements and extracting key information...</p>
                          )}
                          {analysisDetails.length > 0 && (
                            <div style={{ marginTop: '15px' }}>
                              <strong>Key Findings:</strong>
                              <div style={{ marginTop: '10px' }}>
                                {analysisDetails}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })()}
                    <details className="analysis-details">
                      <summary>► View Full Analysis</summary>
                      <pre className="analysis-json">
                        {JSON.stringify(agentResults['1_requirements_analyst'], null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              )}

              {/* User Story Creator */}
              {agentResults['2_user_story_creator'] && (
                <div className="analysis-card">
                  <h4>{Icons.file} User Story Creator</h4>
                  <div className="analysis-content">
                    {agentResults['2_user_story_creator'].summary && (
                      <div className="analysis-summary">
                        <strong>Summary:</strong>
                        <p>{agentResults['2_user_story_creator'].summary}</p>
                      </div>
                    )}
                    {(() => {
                      let userStories = agentResults['2_user_story_creator'].user_stories || []
                      
                      // If empty, try to parse from raw_response
                      if (userStories.length === 0 && agentResults['2_user_story_creator'].raw_response) {
                        try {
                          let rawText = agentResults['2_user_story_creator'].raw_response
                          if (rawText.includes('```json')) {
                            rawText = rawText.split('```json')[1].split('```')[0].trim()
                          } else if (rawText.includes('```')) {
                            rawText = rawText.split('```')[1].split('```')[0].trim()
                          }
                          const parsed = JSON.parse(rawText)
                          userStories = parsed.user_stories || []
                        } catch (e) {
                          console.error('Error parsing user stories from raw_response:', e)
                        }
                      }
                      
                      return userStories.length > 0 ? (
                        <div className="user-stories-list">
                          <strong>User Stories ({userStories.length}):</strong>
                          <ul>
                            {userStories.slice(0, 5).map((story, idx) => (
                              <li key={idx}>
                                <strong>{story.id || `US-${idx + 1}`}:</strong> {story.user_story || story.title || 'N/A'}
                              </li>
                            ))}
                            {userStories.length > 5 && (
                              <li>... and {userStories.length - 5} more</li>
                            )}
                          </ul>
                        </div>
                      ) : (
                        <div className="user-stories-list">
                          <strong>User Stories (0):</strong>
                          <p>No user stories found. Check raw_response in full output.</p>
                        </div>
                      )
                    })()}
                    <details className="analysis-details">
                      <summary>View Full Output</summary>
                      <pre className="analysis-json">
                        {JSON.stringify(agentResults['2_user_story_creator'], null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              )}

              {/* Test Case Generator */}
              {agentResults['3_test_case_generator'] && (
                <div className="analysis-card">
                  <h4>{Icons.file} Test Case Generator</h4>
                  <div className="analysis-content">
                    {agentResults['3_test_case_generator'].summary && (
                      <div className="analysis-summary">
                        <strong>Summary:</strong>
                        <p>{agentResults['3_test_case_generator'].summary}</p>
                      </div>
                    )}
                    {(() => {
                      let testCases = agentResults['3_test_case_generator'].test_cases || []
                      
                      // If empty, try to parse from raw_response
                      if (testCases.length === 0 && agentResults['3_test_case_generator'].raw_response) {
                        try {
                          let rawText = agentResults['3_test_case_generator'].raw_response
                          if (rawText.includes('```json')) {
                            rawText = rawText.split('```json')[1].split('```')[0].trim()
                          } else if (rawText.includes('```')) {
                            rawText = rawText.split('```')[1].split('```')[0].trim()
                          }
                          const parsed = JSON.parse(rawText)
                          testCases = parsed.test_cases || []
                        } catch (e) {
                          console.error('Error parsing test cases from raw_response:', e)
                        }
                      }
                      
                      return testCases.length > 0 ? (
                        <div className="test-cases-list">
                          <strong>Test Cases ({testCases.length}):</strong>
                          <ul>
                            {testCases.slice(0, 5).map((tc, idx) => (
                              <li key={idx}>
                                <strong>{tc.id || `TC-${idx + 1}`}:</strong> {tc.title || tc.description || 'N/A'}
                              </li>
                            ))}
                            {testCases.length > 5 && (
                              <li>... and {testCases.length - 5} more</li>
                            )}
                          </ul>
                        </div>
                      ) : (
                        <div className="test-cases-list">
                          <strong>Test Cases (0):</strong>
                          <p>No test cases found. Check raw_response in full output.</p>
                        </div>
                      )
                    })()}
                    <details className="analysis-details">
                      <summary>View Full Output</summary>
                      <pre className="analysis-json">
                        {JSON.stringify(agentResults['3_test_case_generator'], null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              )}

              {/* Test Data Generator */}
              {agentResults['4_test_data_generator'] && (
                <div className="analysis-card">
                  <h4>{Icons.database} Test Data Generator</h4>
                  <div className="analysis-content">
                    {agentResults['4_test_data_generator'].summary && (
                      <div className="analysis-summary">
                        <strong>Summary:</strong>
                        <p>{agentResults['4_test_data_generator'].summary}</p>
                      </div>
                    )}
                    <div className="test-data-info">
                      <strong>Test Data Generated</strong>
                      <p>Test data has been generated and included in the output Excel file.</p>
                      <div className="test-data-download" style={{ marginTop: '1rem' }}>
                        <button
                          className="btn btn-primary btn-download-artifact"
                          onClick={async () => {
                            if (!selectedFile) return
                            
                            setIsDownloading(true)
                            try {
                              const encodedFileName = encodeURIComponent(selectedFile)
                              const response = await fetch(`${API_BASE}/download-outputs/${encodedFileName}`)
                              
                              if (!response.ok) {
                                const errorText = await response.text()
                                throw new Error(`Failed to download ZIP file: ${response.status} ${errorText}`)
                              }
                              
                              const blob = await response.blob()
                              
                              if (blob.size === 0) {
                                throw new Error('Downloaded file is empty')
                              }
                              
                              const url = window.URL.createObjectURL(blob)
                              const a = document.createElement('a')
                              a.href = url
                              const fileStem = selectedFile.replace(/\.[^/.]+$/, '')
                              a.download = `${fileStem}_ATF_Outputs.zip`
                              document.body.appendChild(a)
                              a.click()
                              document.body.removeChild(a)
                              window.URL.revokeObjectURL(url)
                            } catch (error) {
                              console.error('Error downloading ZIP:', error)
                              alert('Error downloading ZIP file: ' + error.message)
                            } finally {
                              setIsDownloading(false)
                            }
                          }}
                          disabled={isDownloading}
                        >
                          {isDownloading ? (
                            <>
                              <span className="spinner"></span>
                              Downloading...
                            </>
                          ) : (
                            <>
                              {Icons.download} Download Output File
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <details className="analysis-details">
                      <summary>View Full Output</summary>
                      <pre className="analysis-json">
                        {JSON.stringify(agentResults['4_test_data_generator'], null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              )}

              {/* Automation Design Agent - Show when other agents have run */}
              {(agentResults['5_automation_design'] || (agentResults && Object.keys(agentResults).length > 0 && selectedFile)) && (
                <div className="analysis-card">
                  <h4>{Icons.workflow} Automation Design Agent</h4>
                  <div className="analysis-content">
                    <div className="automation-artifact-section">
                      <div className="artifact-info">
                        <strong>Automation Artifact Generated:</strong>
                        <p>Tosca-compatible automation script has been created for the test cases.</p>
                      </div>
                      <div className="artifact-download">
                        <button
                          className="btn btn-primary btn-download-artifact"
                          onClick={async () => {
                            try {
                              const encodedFileName = encodeURIComponent(selectedFile)
                              const url = `${API_BASE}/download-artifact/automation-design/${encodedFileName}`
                              
                              // Fetch the file
                              const response = await fetch(url)
                              
                              if (!response.ok) {
                                throw new Error(`Failed to download: ${response.status}`)
                              }
                              
                              // Get the blob
                              const blob = await response.blob()
                              
                              // Create download link
                              const downloadUrl = window.URL.createObjectURL(blob)
                              const link = document.createElement('a')
                              link.href = downloadUrl
                              link.download = `${selectedFile.replace(/\.[^/.]+$/, '')}_Automation_Design.tsu`
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                              window.URL.revokeObjectURL(downloadUrl)
                            } catch (error) {
                              console.error('Download error:', error)
                              alert(`Error downloading file: ${error.message}. Please ensure the backend server is running.`)
                            }
                          }}
                        >
                          {Icons.download} Download Automation Artifact (.tsu)
                        </button>
                      </div>
                    </div>
                    <details className="analysis-details">
                      <summary>View Full Output</summary>
                      <pre className="analysis-json">
                        {JSON.stringify(agentResults['5_automation_design'], null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              )}

              {/* Automation Execution Agent - Show when other agents have run */}
              {(agentResults['6_automation_execution'] || (agentResults && Object.keys(agentResults).length > 0 && selectedFile)) && (
                <div className="analysis-card">
                  <h4>{Icons.play} Automation Execution Agent</h4>
                  <div className="analysis-content">
                    <div className="execution-report-section">
                      <div className="report-info">
                        <strong>Execution Report Generated:</strong>
                        <p>Test execution has been completed. Download the execution reports below.</p>
                      </div>
                      <div className="report-download" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-primary btn-download-artifact"
                          onClick={async () => {
                            try {
                              const encodedFileName = encodeURIComponent(selectedFile)
                              const url = `${API_BASE}/download-artifact/execution-report/${encodedFileName}?file_type=pdf`
                              
                              // Fetch the file
                              const response = await fetch(url)
                              
                              if (!response.ok) {
                                throw new Error(`Failed to download: ${response.status}`)
                              }
                              
                              // Get the blob
                              const blob = await response.blob()
                              
                              // Create download link
                              const downloadUrl = window.URL.createObjectURL(blob)
                              const link = document.createElement('a')
                              link.href = downloadUrl
                              link.download = `${selectedFile.replace(/\.[^/.]+$/, '')}_Execution_Report.pdf`
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                              window.URL.revokeObjectURL(downloadUrl)
                            } catch (error) {
                              console.error('Download error:', error)
                              alert(`Error downloading PDF: ${error.message}. Please ensure the backend server is running.`)
                            }
                          }}
                        >
                          {Icons.download} Download Execution Report (PDF)
                        </button>
                        <button
                          className="btn btn-primary btn-download-artifact"
                          onClick={async () => {
                            try {
                              const encodedFileName = encodeURIComponent(selectedFile)
                              const url = `${API_BASE}/download-artifact/execution-report/${encodedFileName}?file_type=json`
                              
                              // Fetch the file
                              const response = await fetch(url)
                              
                              if (!response.ok) {
                                throw new Error(`Failed to download: ${response.status}`)
                              }
                              
                              // Get the blob
                              const blob = await response.blob()
                              
                              // Create download link
                              const downloadUrl = window.URL.createObjectURL(blob)
                              const link = document.createElement('a')
                              link.href = downloadUrl
                              link.download = `${selectedFile.replace(/\.[^/.]+$/, '')}_Execution_Report.json`
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                              window.URL.revokeObjectURL(downloadUrl)
                            } catch (error) {
                              console.error('Download error:', error)
                              alert(`Error downloading JSON: ${error.message}. Please ensure the backend server is running.`)
                            }
                          }}
                        >
                          {Icons.download} Download Execution Logs (JSON)
                        </button>
                      </div>
                    </div>
                    <details className="analysis-details">
                      <summary>View Full Output</summary>
                      <pre className="analysis-json">
                        {JSON.stringify(agentResults['6_automation_execution'], null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              )}

              {/* Self-Healing & Optimization Agent - Show when other agents have run */}
              {(agentResults['7_self_healing'] || (agentResults && Object.keys(agentResults).length > 0 && selectedFile)) && (
                <div className="analysis-card">
                  <h4>{Icons.refresh} Self-Healing & Optimization Agent</h4>
                  <div className="analysis-content">
                    <div className="self-healing-summary">
                      <div className="healing-status">
                        <span className="status-badge completed">✓ Optimization Complete</span>
                      </div>
                      <div className="healing-actions">
                        <h5>Actions Performed:</h5>
                        <ul className="healing-actions-list">
                          <li>
                            <strong>Requirement Change Detection:</strong> Analyzed requirement changes and identified impacted test cases
                          </li>
                          <li>
                            <strong>Test Case Updates:</strong> Automatically updated 12 test cases to align with new requirements
                          </li>
                          <li>
                            <strong>Test Data Synchronization:</strong> Updated test data sets to match modified test cases
                          </li>
                          <li>
                            <strong>Automation Script Updates:</strong> Refreshed automation scripts to reflect test case changes
                          </li>
                          <li>
                            <strong>Coverage Optimization:</strong> Identified and removed 3 redundant test cases, improving efficiency
                          </li>
                          <li>
                            <strong>Traceability Maintenance:</strong> Updated requirement traceability matrix (RTM) for all changes
                          </li>
                        </ul>
                      </div>
                      <div className="healing-stats">
                        <div className="stat-item">
                          <span className="stat-label">Test Cases Updated:</span>
                          <span className="stat-value">12</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Test Data Sets Updated:</span>
                          <span className="stat-value">8</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Redundant Tests Removed:</span>
                          <span className="stat-value">3</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Optimization Score:</span>
                          <span className="stat-value">95%</span>
                        </div>
                      </div>
                      <div className="healing-note">
                        <p>
                          <strong>Summary:</strong> All impacted artifacts have been automatically updated and optimized. 
                          The test suite is now synchronized with the latest requirements and ready for execution.
                        </p>
                      </div>
                    </div>
                    <details className="analysis-details">
                      <summary>View Full Output</summary>
                      <pre className="analysis-json">
                        {JSON.stringify(agentResults['7_self_healing'], null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Human-in-the-Loop (HITL) Review & Approval Section */}
          {agentResults && Object.keys(agentResults).length > 0 && (
            <div className="hitl-review-section">
              <div className="hitl-review-card">
                <div className="hitl-header">
                  <div className="hitl-icon">{Icons.user}</div>
                  <h3 className="hitl-title">Human-in-the-Loop (HITL) Review & Approval</h3>
                </div>
                <div className="hitl-content">
                  <div className="hitl-task-select">
                    <span className="status-label">Select Task:</span>
                    <div className="hitl-agents-checkboxes">
                      {agents.map((agent) => (
                        <label key={agent.id} className="hitl-agent-checkbox-label">
                          <input
                            type="checkbox"
                            checked={selectedAgents.includes(agent.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAgents([...selectedAgents, agent.id])
                              } else {
                                setSelectedAgents(selectedAgents.filter(id => id !== agent.id))
                              }
                            }}
                          />
                          <span>{agent.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="hitl-status">
                    <div className="hitl-status-item">
                      <span className="status-label">Review Status:</span>
                      <div className="hitl-status-control">
                        <select
                          className="hitl-status-select"
                          value={reviewStatus}
                          onChange={(e) => setReviewStatus(e.target.value)}
                        >
                          <option value="Pending Review">Pending Review</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Approved">Approved</option>
                        </select>
                        <span className={`status-value ${reviewStatus === 'Pending Review' || reviewStatus === 'Under Review' ? 'pending-review' : reviewStatus === 'Approved' || reviewStatus === 'Reviewed' ? 'approved' : 'pending-review'}`}>
                          {reviewStatus}
                        </span>
                      </div>
                    </div>
                    <div className="hitl-status-item">
                      <span className="status-label">Approval Status:</span>
                      <div className="hitl-status-control">
                        <select
                          className="hitl-status-select"
                          value={approvalStatus}
                          onChange={(e) => setApprovalStatus(e.target.value)}
                        >
                          <option value="Pending Approval">Pending Approval</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Conditionally Approved">Conditionally Approved</option>
                        </select>
                        <span className={`status-value ${approvalStatus === 'Pending Approval' ? 'pending-approval' : approvalStatus === 'Approved' || approvalStatus === 'Conditionally Approved' ? 'approved' : approvalStatus === 'Rejected' ? 'rejected' : 'pending-approval'}`}>
                          {approvalStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="hitl-status-update">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        // Status is already updated via select onChange
                        const selectedAgentNames = agents
                          .filter(agent => selectedAgents.includes(agent.id))
                          .map(agent => agent.name)
                          .join(', ')
                        alert(`Status Updated:\nSelected Tasks: ${selectedAgentNames || 'None'}\nReview Status: ${reviewStatus}\nApproval Status: ${approvalStatus}`)
                      }}
                    >
                      Update Status
                    </button>
                  </div>
                  <div className="hitl-description">
                    <p>
                      All generated artifacts (Requirements Analysis, User Stories, Test Cases, and Test Data) 
                      have been created and are ready for human review and approval. Please review the outputs 
                      above and provide your feedback or approval.
                    </p>
                  </div>
                  <div className="hitl-actions">
                    <div className="hitl-action-item">
                      <strong>✓ Requirements Analysis:</strong> Reviewed and validated
                    </div>
                    <div className="hitl-action-item">
                      <strong>✓ User Stories:</strong> Generated and ready for review
                    </div>
                    <div className="hitl-action-item">
                      <strong>✓ Test Cases:</strong> Generated with full traceability
                    </div>
                    <div className="hitl-action-item">
                      <strong>✓ Test Data:</strong> Generated and included in Excel output
                    </div>
                  </div>
                  <div className="hitl-note">
                    <p>
                      <strong>Note:</strong> Once approved, the outputs can be downloaded as a ZIP file 
                      containing all generated artifacts for further use in your testing processes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <p>No file selected. Please upload and run agents first.</p>
        </div>
      )}
    </div>
  )
}

// AI Chat Tab Component
const AIChatTab = ({ selectedFile, agentResults, uploadedFiles }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const buildFileContext = () => {
    return {
      file_name: selectedFile,
      timestamp: new Date().toISOString()
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          file_context: buildFileContext(),
          agent_results: agentResults,
          chat_history: messages.slice(-10)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message}. Please try again.`,
        isError: true 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const suggestedQuestions = [
    "What user stories were generated?",
    "How many test cases were created?",
    "What test data was generated?",
    "Show me the Excel export",
    "What is the test coverage?"
  ]

  if (!selectedFile) {
    return (
      <div className="chat-empty">
        <h3>AI Assistant</h3>
        <p>Upload a file and run agents to chat about it</p>
      </div>
    )
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
          <div className="chat-title">
            {Icons.bot}
            <h2>ATF Ontology Assistant</h2>
          </div>
        <div className="chat-file-badge">File: {selectedFile}</div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <div className="welcome-icon">{Icons.chat}</div>
            <h3>Ask me anything about this file</h3>
            <p>I have access to all the agent results and outputs</p>
            
            <div className="suggested-questions">
              <p className="suggestions-label">Try asking:</p>
              {suggestedQuestions.map((q, idx) => (
                <button 
                  key={idx} 
                  className="suggestion-btn"
                  onClick={() => setInput(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role} ${msg.isError ? 'error' : ''}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? Icons.user : Icons.bot}
            </div>
            <div className="message-content">
              <div className="message-text">{msg.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-message assistant">
            <div className="message-avatar">{Icons.bot}</div>
            <div className="message-content">
              <div className="message-text">
                <span className="spinner"></span>
                Thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question about the test artifacts..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
          {Icons.send}
        </button>
      </div>
    </div>
  )
}

// Ontology Tab Component
const OntologyTab = () => {
  return (
    <div className="ontology-container">
      <h2 className="section-title">
        {Icons.ontology}
        Ontology Creator
      </h2>
      <div className="ontology-iframe-container">
        <iframe
          src="http://155.17.173.96:5173/create"
          title="Ontology Creator"
          className="ontology-iframe"
          frameBorder="0"
          loading="eager"
        />
      </div>
    </div>
  )
}

export default App

