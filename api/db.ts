import { Client } from '@neondb/serverless';

export class NeonDb {
  private client: ReturnType<typeof createClient>;
  
  constructor() {
    const connectionString = process.env.NEON_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('NEON_CONNECTION_STRING environment variable is required');
    }
    this.client = createClient({connectionString});
  }

  async getConfig(key: string): Promise<any> {
    const result = await this.client.query(
      'SELECT data FROM site_configs WHERE config_key = $1',
      [key]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0].data;
  }

  async setConfig(key: string, data: any): Promise<void> {
    await this.client.query(
      `INSERT INTO site_configs (config_key, data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (config_key) 
       DO UPDATE SET data = $2, updated_at = NOW()`,
      [key, JSON.stringify(data)]
    );
  }
}

function createClient(config: { connectionString: string }) {
  return new Client(config);
}