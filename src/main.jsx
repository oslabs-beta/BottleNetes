import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import TestGrid from './components/TestGrid'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <TestGrid /> */}
  </StrictMode>,
)
