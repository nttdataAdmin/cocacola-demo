import { useState, useEffect, useRef } from 'react'
import './App.css'
import './chat-styles.css'

// API Base URL
const API_BASE = import.meta.env.VITE_API_BASE || 'http://155.17.172.33:1788'

// Log API base for debugging
if (typeof window !== 'undefined') {
  console.log('🔗 API Base URL:', API_BASE)
  console.log('🌐 Frontend URL:', window.location.origin)
}

// Icons
const Icons = {
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  upload: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>,
  dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  summary: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M16 13H8M16 17H8M10 9H8"/></svg>,
  chat: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>,
  ontology: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  send: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>,
  warning: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>,
  file: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
  image: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  close: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
}

// Login Component
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username && password) {
      onLogin({ username, password })
    }
  }

  return (
    <div className="login-container-manufacturing">
      <div className="login-background-manufacturing"></div>
      <div className="login-content-manufacturing">
        <div className="login-card-manufacturing">
          <div className="login-header-manufacturing">
            <h1>Pepsico Manufacturing</h1>
            <h2>Production Line Management</h2>
          </div>
          <form onSubmit={handleSubmit} className="login-form-manufacturing">
            <div className="form-group-manufacturing">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <small>Default: admin</small>
            </div>
            <div className="form-group-manufacturing">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <small>Default: admin</small>
            </div>
            <button type="submit" className="btn-login-manufacturing">
              {Icons.check}
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function AppManufacturing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('upload')
  const [uploadedForms, setUploadedForms] = useState([])
  const [dashboardData, setDashboardData] = useState(null)
  const [processingResults, setProcessingResults] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [formType, setFormType] = useState('online')
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if already logged in
    const savedUser = localStorage.getItem('manufacturing_user')
    if (savedUser) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (credentials) => {
    localStorage.setItem('manufacturing_user', JSON.stringify(credentials))
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('manufacturing_user')
    setIsLoggedIn(false)
  }

  // Test backend connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing connection to:', API_BASE)
        const response = await fetch(`${API_BASE}/health`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors'
        })
        console.log('Health check response:', response.status, response.statusText)
        if (!response.ok) {
          setError(`Backend server not responding (${response.status}). Please check backend on ${API_BASE}`)
        } else {
          const data = await response.json()
          console.log('Backend health:', data)
          setError(null) // Clear error if connection successful
        }
      } catch (err) {
        console.error('Backend connection test failed:', err)
        setError(`Cannot connect to backend server at ${API_BASE}. 
        Error: ${err.message}
        Please ensure:
        1. Backend is running: uvicorn app_manufacturing:app --host 0.0.0.0 --port 1788
        2. Backend is accessible at ${API_BASE}
        3. Check browser console (F12) for CORS errors`)
      }
    }
    if (isLoggedIn) {
      testConnection()
    }
  }, [isLoggedIn])

  // Fetch dashboard data and processing results
  useEffect(() => {
    if (!isLoggedIn) return
    fetchDashboardData()
    fetchProcessingResults()
    const interval = setInterval(() => {
      fetchDashboardData()
      fetchProcessingResults()
    }, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [isLoggedIn])

  const fetchProcessingResults = async () => {
    try {
      const response = await fetch(`${API_BASE}/processing-results`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors'
      })
      if (!response.ok) {
        console.error('Failed to fetch processing results:', response.status)
        return
      }
      const data = await response.json()
      setProcessingResults(data.results || [])
    } catch (err) {
      console.error('Error fetching processing results:', err)
    }
  }

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE}/dashboard/status`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors'
      })
      if (!response.ok) {
        throw new Error(`Backend not responding: ${response.status}`)
      }
      const data = await response.json()
      setDashboardData(data)
      setError(null) // Clear error on success
    } catch (err) {
      console.error('Error fetching dashboard:', err)
      if (err.message.includes('Failed to fetch') || err.message.includes('Backend not responding')) {
        setError(`Cannot connect to backend server. Make sure it's running on ${API_BASE}. Error: ${err.message}`)
      }
    }
  }

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('form_type', formType)

        console.log('📤 Uploading file:', file.name, 'to:', `${API_BASE}/upload-form`)
        const response = await fetch(`${API_BASE}/upload-form?form_type=${formType}`, {
          method: 'POST',
          body: formData,
          mode: 'cors',
          credentials: 'omit'
        })
        console.log('📥 Upload response:', response.status, response.statusText)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Upload error response:', errorText)
          let errorMessage = `Failed to upload ${file.name}`
          try {
            const errorData = JSON.parse(errorText)
            errorMessage = errorData.detail || errorData.message || errorMessage
          } catch {
            errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`
          }
          throw new Error(errorMessage)
        }

        const data = await response.json()
        setUploadedForms(prev => [...prev, data.form])
        setProcessingResults(prev => [...prev, data.form])
      }

      // Refresh dashboard and switch to dashboard tab after successful upload
      await fetchDashboardData()
      await fetchProcessingResults()
      
      // Switch to dashboard tab to show processing results
      setActiveTab('dashboard')
      
      // Show workflow visualization automatically after upload
      // This will be handled by DashboardTab component
    } catch (err) {
      let errorMessage = err.message
      if (err.message.includes('Failed to fetch')) {
        errorMessage = `Cannot connect to backend server. Please ensure:
        1. Backend is running on ${API_BASE}
        2. Check browser console for CORS errors
        3. Verify the API_BASE URL is correct`
      }
      setError(errorMessage)
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.files = e.dataTransfer.files
    input.onchange = (event) => handleFileUpload(event)
    handleFileUpload({ target: { files: e.dataTransfer.files } })
  }

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="app-manufacturing">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>Pepsico Manufacturing</h1>
            <p className="subtitle">Production Line Management System</p>
          </div>
          <button className="btn-logout-manufacturing" onClick={handleLogout} title="Logout">
            {Icons.close}
            Logout
          </button>
        </div>
        
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'ontology' ? 'active' : ''}`}
            onClick={() => setActiveTab('ontology')}
          >
            {Icons.ontology} Ontology
          </button>
          <button 
            className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            {Icons.upload} Upload
          </button>
          <button 
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            {Icons.dashboard} Dashboard
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
            {Icons.chat} Chatbot
          </button>
        </div>
      </header>

      <main className="main-content">
        {error && (
          <div className="error-banner" style={{ marginBottom: '1rem', padding: '1rem', background: '#fef2f2', border: '2px solid #ef4444', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {Icons.warning}
              <strong>Connection Error</strong>
            </div>
            <div style={{ whiteSpace: 'pre-line', fontSize: '0.875rem' }}>{error}</div>
            <button 
              onClick={() => {
                setError(null)
                fetchDashboardData()
                fetchProcessingResults()
              }}
              style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#F40009', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Retry Connection
            </button>
          </div>
        )}
        {activeTab === 'ontology' && <OntologyTab />}
        {activeTab === 'upload' && (
          <UploadTab 
            onFileUpload={handleFileUpload}
            onDrop={handleDrop}
            isUploading={isUploading}
            formType={formType}
            setFormType={setFormType}
            error={error}
          />
        )}
        {activeTab === 'dashboard' && <DashboardTab data={dashboardData} />}
        {activeTab === 'summary' && <SummaryTab results={processingResults} />}
        {activeTab === 'chat' && <ChatTab />}
      </main>
    </div>
  )
}

// Ontology Tab
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
        />
      </div>
    </div>
  )
}

// Upload Tab
const UploadTab = ({ onFileUpload, onDrop, isUploading, formType, setFormType, error }) => {
  return (
    <div className="upload-section">
      <h2 className="section-title">
        {Icons.upload}
        Form Upload
      </h2>
      
      <div className="form-type-selector">
        <label>Form Type:</label>
        <div className="radio-group">
          <label className="radio-label">
            <input 
              type="radio" 
              name="formType" 
              value="online" 
              checked={formType === 'online'}
              onChange={() => setFormType('online')}
            />
            <span>Online Form (Digital)</span>
          </label>
          <label className="radio-label">
            <input 
              type="radio" 
              name="formType" 
              value="offline" 
              checked={formType === 'offline'}
              onChange={() => setFormType('offline')}
            />
            <span>Offline Form (Handwritten - OCR)</span>
          </label>
        </div>
      </div>

      <div 
        className="file-upload-zone"
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept={formType === 'offline' ? 'image/*' : '.docx,.pdf'}
          onChange={onFileUpload}
          style={{ display: 'none' }}
        />
        <div className="upload-placeholder">
          {formType === 'offline' ? (
            <>
              {Icons.image}
              <p>Drag and drop handwritten forms here</p>
              <p className="upload-hint">Supports: JPG, PNG, PDF (OCR will be applied)</p>
            </>
          ) : (
            <>
              {Icons.file}
              <p>Drag and drop digital forms here</p>
              <p className="upload-hint">Supports: DOCX, PDF</p>
            </>
          )}
          <button className="btn-browse" disabled={isUploading}>
            {isUploading ? 'Processing...' : 'Browse files'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          {Icons.warning}
          {error}
        </div>
      )}

      <div className="upload-info">
        <h3>Form Processing:</h3>
        <ul>
          <li><strong>Online Forms:</strong> Direct text extraction from digital documents</li>
          <li><strong>Offline Forms:</strong> OCR processing for handwritten forms</li>
          <li><strong>Classification:</strong> Automatic Go/No-Go classification using AI</li>
          <li><strong>Attributes:</strong> Extraction of production line ID, manager name, date, etc.</li>
          <li><strong>Reallocation:</strong> For No-Go forms, automatic worker reallocation recommendations</li>
        </ul>
      </div>
    </div>
  )
}

// Workflow Visualization Component
const WorkflowVisualization = () => {
  const [activeStep, setActiveStep] = useState(0)
  const steps = [
    {
      id: 'upload',
      name: 'Form Upload',
      agent: 'Upload Agent',
      description: 'Receives form file (DOCX/PDF/Image)',
      icon: Icons.upload,
      color: '#3B82F6'
    },
    {
      id: 'ocr',
      name: 'OCR Processing',
      agent: 'OCR Agent',
      description: 'Extracts text from handwritten forms using Tesseract',
      icon: Icons.image,
      color: '#8B5CF6',
      condition: 'For offline/handwritten forms'
    },
    {
      id: 'extract',
      name: 'Text Extraction',
      agent: 'Text Extraction Agent',
      description: 'Extracts text from digital documents (DOCX/PDF)',
      icon: Icons.file,
      color: '#10B981',
      condition: 'For online/digital forms'
    },
    {
      id: 'classify',
      name: 'Form Classification',
      agent: 'Classification Agent (LLM)',
      description: 'Classifies form as GO or NO-GO using Azure OpenAI',
      icon: Icons.check,
      color: '#F59E0B'
    },
    {
      id: 'attributes',
      name: 'Attribute Extraction',
      agent: 'Attribute Extraction Agent (LLM)',
      description: 'Extracts production line ID, manager, date, skills, etc.',
      icon: Icons.file,
      color: '#EF4444'
    },
    {
      id: 'reallocation',
      name: 'Worker Reallocation',
      agent: 'Reallocation Agent (LLM)',
      description: 'Generates worker reallocation recommendations for NO-GO forms',
      icon: Icons.dashboard,
      color: '#EC4899',
      condition: 'Only for NO-GO forms'
    },
    {
      id: 'dashboard',
      name: 'Dashboard Update',
      agent: 'Dashboard Agent',
      description: 'Updates dashboard with processed form data',
      icon: Icons.dashboard,
      color: '#06B6D4'
    }
  ]

  useEffect(() => {
    // Animate through steps
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="workflow-container" style={{ 
      marginBottom: '2rem', 
      padding: '1.5rem', 
      background: 'white', 
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {Icons.ontology}
        Agent Workflow & Processing Pipeline
      </h3>
      
      <div className="workflow-steps" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem',
        position: 'relative'
      }}>
        {steps.map((step, index) => (
          <div key={step.id} style={{ position: 'relative' }}>
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div 
                className={`workflow-connector ${activeStep >= index ? 'active' : ''}`}
                style={{
                  position: 'absolute',
                  left: '24px',
                  top: '48px',
                  width: '2px',
                  height: 'calc(100% + 1rem)',
                  background: activeStep > index ? step.color : '#E5E7EB',
                  transition: 'background 0.3s ease',
                  zIndex: 0
                }}
              />
            )}
            
            {/* Step Card */}
            <div 
              className={`workflow-step ${activeStep === index ? 'active' : activeStep > index ? 'completed' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem',
                background: activeStep === index ? '#FEF3C7' : activeStep > index ? '#D1FAE5' : '#F9FAFB',
                borderRadius: '8px',
                border: `2px solid ${activeStep === index ? step.color : activeStep > index ? step.color : '#E5E7EB'}`,
                transition: 'all 0.3s ease',
                position: 'relative',
                zIndex: 1,
                cursor: 'pointer'
              }}
              onClick={() => setActiveStep(index)}
            >
              {/* Step Icon */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: activeStep >= index ? step.color : '#9CA3AF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0,
                boxShadow: activeStep === index ? `0 4px 12px ${step.color}40` : 'none',
                transition: 'all 0.3s ease'
              }}>
                {step.icon}
              </div>
              
              {/* Step Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h4 style={{ margin: 0, color: '#1F2937', fontSize: '1rem', fontWeight: 600 }}>
                    {step.name}
                  </h4>
                  {activeStep > index && (
                    <span style={{ color: '#10B981', fontSize: '0.875rem' }}>✓ Completed</span>
                  )}
                  {activeStep === index && (
                    <span style={{ 
                      color: step.color, 
                      fontSize: '0.875rem',
                      animation: 'pulse 2s infinite'
                    }}>
                      ● Processing...
                    </span>
                  )}
                </div>
                <p style={{ 
                  margin: '0.25rem 0', 
                  color: '#6B7280', 
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}>
                  Agent: <span style={{ color: step.color }}>{step.agent}</span>
                </p>
                <p style={{ margin: '0.25rem 0', color: '#6B7280', fontSize: '0.875rem' }}>
                  {step.description}
                </p>
                {step.condition && (
                  <p style={{ 
                    margin: '0.25rem 0', 
                    color: '#9CA3AF', 
                    fontSize: '0.75rem',
                    fontStyle: 'italic'
                  }}>
                    {step.condition}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow Summary */}
      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1rem', 
        background: '#F3F4F6', 
        borderRadius: '8px',
        border: '1px solid #E5E7EB'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#1F2937' }}>Workflow Summary</h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#6B7280', fontSize: '0.875rem' }}>
          <li>Total Agents: {steps.length}</li>
          <li>LLM-Powered Agents: 3 (Classification, Attribute Extraction, Reallocation)</li>
          <li>Processing Time: ~2-5 seconds per form</li>
          <li>Automatic Dashboard Update: Enabled</li>
        </ul>
      </div>
    </div>
  )
}

// Dashboard Charts Component
const DashboardCharts = ({ data }) => {
  if (!data) return null

  const goForms = data.recent_forms?.filter(f => f.classification === 'GO').length || 0
  const noGoForms = data.recent_forms?.filter(f => f.classification === 'NO-GO').length || 0
  const totalForms = goForms + noGoForms
  const goPercentage = totalForms > 0 ? (goForms / totalForms) * 100 : 0
  const noGoPercentage = totalForms > 0 ? (noGoForms / totalForms) * 100 : 0

  const runningLines = data.production_lines?.running || 0
  const downLines = data.production_lines?.down || 0
  const totalLines = data.production_lines?.total || 100
  const runningPercentage = (runningLines / totalLines) * 100
  const downPercentage = (downLines / totalLines) * 100

  // Calculate form submissions by hour (last 24 hours)
  const formsByHour = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date()
    hour.setHours(hour.getHours() - (23 - i))
    const hourStr = hour.toISOString().substring(0, 13)
    const count = data.recent_forms?.filter(f => 
      f.uploaded_at && f.uploaded_at.startsWith(hourStr)
    ).length || 0
    return { hour: hour.getHours(), count, label: `${hour.getHours()}:00` }
  })

  // Production lines by status
  const lineStatusData = [
    { name: 'Running', value: runningLines, color: '#10B981', percentage: runningPercentage },
    { name: 'Down', value: downLines, color: '#EF4444', percentage: downPercentage }
  ]

  // Form classification data
  const formClassificationData = [
    { name: 'GO', value: goForms, color: '#10B981', percentage: goPercentage },
    { name: 'NO-GO', value: noGoForms, color: '#EF4444', percentage: noGoPercentage }
  ]

  // Top production lines by activity
  const lineActivity = {}
  data.recent_forms?.forEach(form => {
    const plId = form.attributes?.production_line_id
    if (plId) {
      lineActivity[plId] = (lineActivity[plId] || 0) + 1
    }
  })
  const topLines = Object.entries(lineActivity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([line, count]) => ({ line, count }))

  return (
    <div className="dashboard-charts-section" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    }}>
      {/* Production Line Status Pie Chart */}
      <div className="chart-card" style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#1F2937', fontSize: '1.1rem', fontWeight: 600 }}>
          Production Line Status
        </h3>
        <PieChart data={lineStatusData} size={180} />
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {lineStatusData.map(item => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color }}></div>
                <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>{item.name}</span>
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F2937' }}>
                {item.value} ({item.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Classification Pie Chart */}
      <div className="chart-card" style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#1F2937', fontSize: '1.1rem', fontWeight: 600 }}>
          Form Classification
        </h3>
        <PieChart data={formClassificationData} size={180} />
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {formClassificationData.map(item => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color }}></div>
                <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>{item.name}</span>
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F2937' }}>
                {item.value} ({item.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Submissions Timeline */}
      <div className="chart-card" style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        gridColumn: 'span 2'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#1F2937', fontSize: '1.1rem', fontWeight: 600 }}>
          Form Submissions (Last 24 Hours)
        </h3>
        <BarChart data={formsByHour} maxValue={Math.max(...formsByHour.map(d => d.count), 1)} />
      </div>

      {/* Top Production Lines */}
      {topLines.length > 0 && (
        <div className="chart-card" style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          gridColumn: 'span 2'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#1F2937', fontSize: '1.1rem', fontWeight: 600 }}>
            Top Production Lines by Activity
          </h3>
          <HorizontalBarChart data={topLines} />
        </div>
      )}

      {/* Analysis Insights */}
      <div className="analysis-card" style={{
        background: 'linear-gradient(135deg, #F40009 0%, #C8102E 100%)',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(244, 0, 9, 0.2)',
        gridColumn: 'span 2',
        color: 'white'
      }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 600 }}>
          📊 Analysis Insights
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>Utilization Rate</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {data.production_lines?.utilization || '0%'}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>
              {runningLines} of {totalLines} lines operational
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>Success Rate</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {totalForms > 0 ? goPercentage.toFixed(1) : 0}%
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>
              {goForms} GO forms out of {totalForms} total
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>Risk Level</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {noGoPercentage < 10 ? 'Low' : noGoPercentage < 25 ? 'Medium' : 'High'}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>
              {noGoForms} production lines down
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>Worker Efficiency</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {data.workers?.total > 0 ? ((data.workers?.active / data.workers?.total) * 100).toFixed(1) : 0}%
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>
              {data.workers?.active || 0} active workers
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Pie Chart Component
const PieChart = ({ data, size = 200 }) => {
  const radius = size / 2 - 10
  const center = size / 2
  let currentAngle = -90

  const paths = data.map((item, index) => {
    const percentage = item.percentage
    const angle = (percentage / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const x1 = center + radius * Math.cos((startAngle * Math.PI) / 180)
    const y1 = center + radius * Math.sin((startAngle * Math.PI) / 180)
    const x2 = center + radius * Math.cos((endAngle * Math.PI) / 180)
    const y2 = center + radius * Math.sin((endAngle * Math.PI) / 180)
    const largeArcFlag = angle > 180 ? 1 : 0

    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ')

    return (
      <path
        key={index}
        d={pathData}
        fill={item.color}
        stroke="white"
        strokeWidth="2"
        style={{ transition: 'all 0.3s ease' }}
      />
    )
  })

  return (
    <svg width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
      {paths}
      <circle cx={center} cy={center} r={radius * 0.6} fill="white" />
      <text
        x={center}
        y={center - 5}
        textAnchor="middle"
        fontSize="20"
        fontWeight="600"
        fill="#1F2937"
      >
        {data.reduce((sum, item) => sum + item.value, 0)}
      </text>
      <text
        x={center}
        y={center + 15}
        textAnchor="middle"
        fontSize="12"
        fill="#6B7280"
      >
        Total
      </text>
    </svg>
  )
}

// Bar Chart Component
const BarChart = ({ data, maxValue = 10 }) => {
  const maxHeight = 150
  const barWidth = Math.max(20, (100 / data.length) - 2)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: maxHeight + 40, padding: '0.5rem' }}>
      {data.map((item, index) => {
        const height = maxValue > 0 ? (item.count / maxValue) * maxHeight : 0
        return (
          <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '100%',
                height: `${height}px`,
                background: `linear-gradient(to top, #F40009, #C8102E)`,
                borderRadius: '4px 4px 0 0',
                minHeight: item.count > 0 ? '4px' : '0',
                transition: 'height 0.3s ease',
                position: 'relative'
              }}
              title={`${item.label}: ${item.count} forms`}
            >
              {item.count > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '10px',
                  color: '#6B7280',
                  whiteSpace: 'nowrap'
                }}>
                  {item.count}
                </span>
              )}
            </div>
            <span style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '4px', writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              {item.hour}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// Horizontal Bar Chart Component
const HorizontalBarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.count), 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {data.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ minWidth: '80px', fontSize: '0.875rem', fontWeight: 600, color: '#1F2937' }}>
            {item.line}
          </div>
          <div style={{ flex: 1, height: '32px', background: '#F3F4F6', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(item.count / maxValue) * 100}%`,
                background: `linear-gradient(90deg, #F40009, #C8102E)`,
                borderRadius: '4px',
                transition: 'width 0.5s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '0.5rem'
              }}
            >
              <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
                {item.count}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Dashboard Tab
const DashboardTab = ({ data }) => {
  const [showWorkflow, setShowWorkflow] = useState(true) // Show workflow by default after upload
  
  if (!data) {
    return <div className="loading">Loading dashboard data...</div>
  }

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="section-title" style={{ margin: 0 }}>
          {Icons.dashboard}
          Production Line Dashboard
        </h2>
        <button 
          onClick={() => setShowWorkflow(!showWorkflow)}
          className="btn-workflow-toggle"
          style={{ 
            padding: '0.5rem 1rem', 
            background: showWorkflow ? '#6B7280' : '#F40009', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.3s ease'
          }}
        >
          {showWorkflow ? 'Hide' : 'Show'} Workflow
        </button>
      </div>

      {showWorkflow && <WorkflowVisualization />}

      {/* Charts and Analysis Section */}
      <DashboardCharts data={data} />

      <div className="dashboard-stats">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon-wrapper">
            {Icons.dashboard}
          </div>
          <h3>Production Lines</h3>
          <div className="stat-value">{data.production_lines?.total || 100}</div>
          <div className="stat-details">
            <div className="stat-detail-item">
              <span className="stat-label">Running:</span>
              <span className="stat-running">{data.production_lines?.running || 0}</span>
            </div>
            <div className="stat-detail-item">
              <span className="stat-label">Down:</span>
              <span className="stat-down">{data.production_lines?.down || 0}</span>
            </div>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${parseFloat(data.production_lines?.utilization || '0')}%` }}
              ></div>
            </div>
            <span className="stat-utilization">{data.production_lines?.utilization || '0%'} Utilization</span>
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon-wrapper">
            {Icons.check}
          </div>
          <h3>Workers</h3>
          <div className="stat-value">{data.workers?.total || 2000}</div>
          <div className="stat-details">
            <div className="stat-detail-item">
              <span className="stat-label">Active:</span>
              <span className="stat-active">{data.workers?.active || 0}</span>
            </div>
            <div className="stat-detail-item">
              <span className="stat-label">Reallocated:</span>
              <span className="stat-reallocated">{data.workers?.reallocated || 0}</span>
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon-wrapper">
            {Icons.file}
          </div>
          <h3>Forms Processed</h3>
          <div className="stat-value">{data.recent_forms?.length || 0}</div>
          <div className="stat-details">
            <div className="stat-detail-item">
              <span className="stat-label">Go Forms:</span>
              <span className="stat-go">{data.recent_forms?.filter(f => f.classification === 'GO').length || 0}</span>
            </div>
            <div className="stat-detail-item">
              <span className="stat-label">No-Go Forms:</span>
              <span className="stat-no-go">{data.recent_forms?.filter(f => f.classification === 'NO-GO').length || 0}</span>
            </div>
          </div>
          <div className="stat-timestamp">
            Last updated: {new Date(data.timestamp).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="recent-forms-section">
        <h3>Recent Form Submissions</h3>
        {data.recent_forms && data.recent_forms.length > 0 ? (
          <div className="forms-list">
            {data.recent_forms.map((form, idx) => (
              <div key={idx} className={`form-item ${form.classification === 'NO-GO' ? 'no-go' : 'go'}`}>
                <div className="form-header">
                  <span className="form-filename">{form.filename}</span>
                  <span className={`form-badge ${form.classification === 'NO-GO' ? 'badge-no-go' : 'badge-go'}`}>
                    {form.classification}
                  </span>
                </div>
                <div className="form-details">
                  <span>Type: {form.form_type}</span>
                  <span>Line: {form.attributes?.production_line_id || 'N/A'}</span>
                  <span>Date: {new Date(form.uploaded_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No forms submitted yet</p>
        )}
      </div>
    </div>
  )
}

// Summary Tab
const SummaryTab = ({ results }) => {
  const noGoForms = results.filter(r => r.classification === 'NO-GO')
  const goForms = results.filter(r => r.classification === 'GO')

  return (
    <div className="summary-container">
      <h2 className="section-title">
        {Icons.summary}
        Processing Summary
      </h2>

      <div className="summary-stats">
        <div className="summary-card">
          <h3>Total Forms Processed</h3>
          <div className="summary-value">{results.length}</div>
        </div>
        <div className="summary-card go">
          <h3>Go Forms</h3>
          <div className="summary-value">{goForms.length}</div>
        </div>
        <div className="summary-card no-go">
          <h3>No-Go Forms</h3>
          <div className="summary-value">{noGoForms.length}</div>
        </div>
      </div>

      {noGoForms.length > 0 && (
        <div className="reallocation-section">
          <h3>Worker Reallocation Recommendations</h3>
          {noGoForms.map((form, idx) => (
            <div key={idx} className="reallocation-card">
              <div className="reallocation-header">
                <h4>Production Line: {form.attributes?.production_line_id || 'Unknown'}</h4>
                <span className="badge-no-go">NO-GO</span>
              </div>
              {form.reallocation_recommendations && (
                <div className="recommendations">
                  <p><strong>Summary:</strong> {form.reallocation_recommendations.summary}</p>
                  <div className="recommendations-list">
                    <h5>Worker Reallocation Details:</h5>
                    {form.reallocation_recommendations.recommendations?.slice(0, 5).map((rec, rIdx) => (
                      <div key={rIdx} className="recommendation-item">
                        <span><strong>{rec.worker_id}</strong></span>
                        <span>→ {rec.recommended_line}</span>
                        <span className="skill-score">Match: {(rec.skill_match_score * 100).toFixed(0)}%</span>
                        <span className="reason">{rec.reason}</span>
                      </div>
                    ))}
                    {form.reallocation_recommendations.recommendations?.length > 5 && (
                      <p>... and {form.reallocation_recommendations.recommendations.length - 5} more</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="all-results-section">
        <h3>All Processing Results</h3>
        <div className="results-table">
          <table>
            <thead>
              <tr>
                <th>Filename</th>
                <th>Type</th>
                <th>Classification</th>
                <th>Production Line</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <tr key={idx}>
                  <td>{result.filename}</td>
                  <td>{result.form_type}</td>
                  <td>
                    <span className={`form-badge ${result.classification === 'NO-GO' ? 'badge-no-go' : 'badge-go'}`}>
                      {result.classification}
                    </span>
                  </td>
                  <td>{result.attributes?.production_line_id || 'N/A'}</td>
                  <td>{new Date(result.uploaded_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Format message content - convert markdown to HTML
const formatMessage = (text) => {
  if (!text) return ''
  
  // Escape HTML first to prevent XSS
  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }
  
  let formatted = escapeHtml(text)
  
  // Replace markdown bold **text** with <strong>
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Replace markdown italic *text* with <em> (but not if it's part of **)
  formatted = formatted.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>')
  
  // Replace markdown code `text` with <code>
  formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>')
  
  // Replace markdown headers
  formatted = formatted.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  formatted = formatted.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  formatted = formatted.replace(/^# (.*$)/gim, '<h1>$1</h1>')
  
  // Replace markdown lists (bullet points) - prioritize this
  const lines = formatted.split('\n')
  let result = []
  let inList = false
  
  lines.forEach((line) => {
    const trimmed = line.trim()
    
    // Check for bullet points (-, *, •)
    if (trimmed.match(/^[\*\-\+•]\s+/)) {
      if (!inList) {
        result.push('<ul>')
        inList = true
      }
      const content = trimmed.replace(/^[\*\-\+•]\s+/, '')
      result.push(`<li>${content}</li>`)
    }
    // Check for numbered lists
    else if (trimmed.match(/^\d+\.\s+/)) {
      if (!inList) {
        result.push('<ol>')
        inList = true
      }
      const content = trimmed.replace(/^\d+\.\s+/, '')
      result.push(`<li>${content}</li>`)
    }
    // Regular line
    else {
      if (inList) {
        result.push('</ul>')
        inList = false
      }
      if (trimmed) {
        result.push(trimmed)
      }
    }
  })
  
  if (inList) {
    result.push('</ul>')
  }
  
  formatted = result.join('')
  
  // Replace remaining line breaks (for non-list content) with <br />
  formatted = formatted.replace(/\n/g, '<br />')
  
  // Replace markdown links [text](url)
  formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #F40009; text-decoration: underline;">$1</a>')
  
  return formatted
}

// Chat Tab
const ChatTab = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
          chat_history: messages.slice(-5)
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
    "How many production lines are running?",
    "What are the recent No-Go forms?",
    "Show me worker reallocation recommendations",
    "What is the current production line status?",
    "How many workers need reallocation?"
  ]

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">
          {Icons.chat}
          <h2>Manufacturing Assistant</h2>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <div className="welcome-icon">{Icons.chat}</div>
            <h3>Ask me about production lines, forms, or workers</h3>
            <p>I have access to real-time manufacturing data</p>
            
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
            <div className="message-content">
              <div 
                className="message-text" 
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                style={{
                  lineHeight: '1.6',
                  wordWrap: 'break-word'
                }}
              />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-message assistant">
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
          placeholder="Ask about production lines, forms, or workers..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
          {Icons.send}
        </button>
      </div>
    </div>
  )
}

export default AppManufacturing

