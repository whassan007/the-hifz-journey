import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Vercel handlers directly
import authHandler from './api/admin/auth.js';
import auditHandler from './api/admin/audit.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Type adapter for Express (req, res) -> Vercel (req, res)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createVercelAdapter = (handler: any) => {
  return async (req: express.Request, res: express.Response) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.error('API Error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
};

// Route mappings mirroring the Vercel filesystem paths
app.post('/api/admin/auth', createVercelAdapter(authHandler));
app.post('/api/admin/audit', createVercelAdapter(auditHandler));

// standard GCP health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', environment: process.env.NODE_ENV });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 [hifz-api] Cloud Run Express Server listening on port ${PORT}`);
});
