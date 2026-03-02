import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'sonner'
import App from './app/App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
                style: {
                    background: '#fff',
                    color: '#1e293b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                },
            }}
        />
    </React.StrictMode>
)
