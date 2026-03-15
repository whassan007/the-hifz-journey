import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'

// Lazy evaluate the route to strictly split chunks
const isAdminRoute = window.location.pathname.startsWith('/admin');

if (isAdminRoute) {
  import('./admin/AdminApp').then(({ AdminApp }) => {
    // We pass VITE_GOOGLE_CLIENT_ID from the environment. Since Vite statically replaces this,
    // we use a fallback for local development if it wasn't provided yet
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'mock-client-id-for-dev.apps.googleusercontent.com';
    
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <GoogleOAuthProvider clientId={clientId}>
          <AdminApp />
        </GoogleOAuthProvider>
      </StrictMode>,
    );
  });
} else {
  import('./App').then(({ default: App }) => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });
}
