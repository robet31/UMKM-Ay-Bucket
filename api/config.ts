import { NeonDb } from './db';
import type { VercelApiHandler } from '@vercel/node';

const handler: VercelApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const neon = new NeonDb();
    const { action, data, key } = req.body;

    if (action === 'get') {
      const result = await neon.getConfig(key || 'site_config');
      return res.status(200).json({ success: true, data: result });
    }

    if (action === 'set') {
      await neon.setConfig(key || 'site_config', data);
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export default handler;