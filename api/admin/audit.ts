import type { VercelRequest, VercelResponse } from '@vercel/node';

// Immutable append-only logging abstraction
// Until a persistent database is defined, we'll pipe these to Vercel's immutable execution logs.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { adminEmail, action, targetType, targetId, targetLabel, metadata } = req.body;

  if (!adminEmail || !action) {
    return res.status(400).json({ error: 'Missing required audit fields' });
  }

  // Construct the Audit object exactly as declared in the User Request
  const auditEntry = {
    id: crypto.randomUUID(),
    adminEmail,
    action,
    targetType,
    targetId,
    targetLabel,
    metadata: metadata || {},
    timestamp: new Date().toISOString(),
    ipAddress: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
  };

  // Log permanently to the immutable server environment execution trace
  console.log('[AUDIT_LOG_ENTRY]', JSON.stringify(auditEntry));

  return res.status(200).json({ success: true, timestamp: auditEntry.timestamp });
}
