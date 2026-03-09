import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import StageEditor from './editor/StageEditor'

const isEditor = window.location.pathname.endsWith('/edit') ||
    window.location.search.includes('edit=1') ||
    window.location.hash === '#edit';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {isEditor ? <StageEditor /> : <App />}
    </StrictMode>,
)
