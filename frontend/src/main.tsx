import { ThemeProvider } from '@/app/providers/ThemeProvider.tsx'
import QueryProvider from '@/app/providers/QueryProvider.tsx'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <ThemeProvider defaultTheme='light'>
          <App />
        </ThemeProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>,
)
