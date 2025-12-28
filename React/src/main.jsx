import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import Fns, { Ppp, One } from './App.jsx'
// import Array from './Array.jsx'
import Home from "./Home.jsx"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Home/>
  </StrictMode>,
)
