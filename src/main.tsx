import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import StageEditor from './editor/StageEditor.tsx'

const isEditor = window.location.pathname === '/edit';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {isEditor ? <StageEditor /> : <App />}
    </StrictMode>,
)
