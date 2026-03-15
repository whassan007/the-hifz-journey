import { OAuth2Client } from 'google-auth-library';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Validate email array against process.env.ADMIN_EMAILS
function isAdminEmail(email: string): boolean {
  const whitelist = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim().toLowerCase()) ?? [];
  return whitelist.includes(email.toLowerCase());
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: 'Missing credential parameter' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.status(400).json({ error: 'Token missing email' });
    }

    if (!isAdminEmail(payload.email)) {
      // Required explicitly by spec: Log the rejection
      console.warn(`Admin login rejected for non-whitelisted email: ${payload.email}`);
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Success - in a full implementation, you'd set a secure HttpOnly cookie here
    // For this scaffold, we're passing back the validated profile to be held in a secure client context.
    return res.status(200).json({ 
      success: true, 
      admin: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      }
    });

  } catch (error) {
    console.error('OAuth token verification failed:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
