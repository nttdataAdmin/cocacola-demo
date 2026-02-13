import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppManufacturing from './AppManufacturing.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppManufacturing />
  </StrictMode>,
)

