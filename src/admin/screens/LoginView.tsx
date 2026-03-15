import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { Shield, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import type { AdminSession } from '../AdminApp';

interface LoginViewProps {
  onLogin: (session: AdminSession) => void;
}

export const LoginView = ({ onLogin }: LoginViewProps) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);



  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Hit our secure Vercel API
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });

      const data = await res.json();
      
      if (!res.ok) {
        setErrorMsg(data.error === 'Forbidden' 
          ? "Access denied. This account is not authorised for the admin portal." 
          : "Authentication failed. Please try again.");
        setIsLoading(false);
        return;
      }

      onLogin({
        email: data.admin.email,
        name: data.admin.name,
        picture: data.admin.picture,
        expiresAt: Date.now() + 28800000 // 8 hours
      });

    } catch (err) {
      console.error(err);
      setErrorMsg("Network error verifying authentication.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden text-center p-10">
        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-brand-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Hifz Journey Admin</h1>
        <p className="text-slate-500 mb-8">Authorised administrators only</p>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3 text-left animate-in shake">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        <div className="flex justify-center opacity-100 transition-opacity">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setErrorMsg("Google provider failed to initialize.")}
            useOneTap
            shape="rectangular"
            theme="outline"
            size="large"
          />
        </div>

        {isLoading && (
          <p className="mt-6 text-sm text-brand-500 font-medium animate-pulse">Verifying clearance...</p>
        )}
      </div>

      <div className="mt-8 text-center text-slate-500 text-sm opacity-80 max-w-sm">
        <p>This portal uses Google OAuth exclusively. Client credentials are not stored on this device.</p>
        <p className="mt-2 text-xs">Environment: {import.meta.env.MODE}</p>
      </div>
    </div>
  );
};
