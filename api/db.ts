import { neon } from "@neondatabase/serverless";

type UsageStats = {
  usedBytes: number;
  itemCount: number;
};

let sqlClient: any = null;

function getSql() {
  if (sqlClient) return sqlClient;
  const connectionString = process.env.NEON_CONNECTION_STRING || process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("Database connection string missing!");
    // Return a dummy client that just throws if used
    return () => { throw new Error("NEON_CONNECTION_STRING or DATABASE_URL environment variable is required"); };
  }
  sqlClient = neon(connectionString);
  return sqlClient;
}

const sql = (strings: TemplateStringsArray, ...values: any[]) => getSql()(strings, ...values);

let initPromise: Promise<void> | null = null;

async function ensureSchema() {
  if (!initPromise) {
    initPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS site_configs (
          id SERIAL PRIMARY KEY,
          config_key VARCHAR(255) UNIQUE NOT NULL,
          data JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS idx_configs_key ON site_configs(config_key);
      `;
    })();
  }

  await initPromise;
}

export async function getConfig(key: string): Promise<any | null> {
  await ensureSchema();
  const rows = await sql`SELECT data FROM site_configs WHERE config_key = ${key} LIMIT 1`;
  return rows[0]?.data ?? null;
}

export async function getConfigs(keys: string[]): Promise<Record<string, any>> {
  await ensureSchema();
  if (!keys.length) return {};

  const rows = await sql`SELECT config_key, data FROM site_configs WHERE config_key = ANY(${keys})`;

  const out: Record<string, any> = {};
  for (const row of rows) out[row.config_key] = row.data;
  return out;
}

export async function setConfig(key: string, data: any): Promise<void> {
  await ensureSchema();
  await sql`
    INSERT INTO site_configs (config_key, data, updated_at)
    VALUES (${key}, ${JSON.stringify(data)}, NOW())
    ON CONFLICT (config_key)
    DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
  `;
}

export async function setConfigs(payload: Record<string, any>): Promise<void> {
  const entries = Object.entries(payload);
  for (const [key, value] of entries) {
    await setConfig(key, value);
  }
}

export async function getUsageStats(): Promise<UsageStats> {
  await ensureSchema();
  const rows = await sql`
    SELECT
       COALESCE(SUM(octet_length(data::text)), 0) AS used_bytes,
       COUNT(*) AS item_count
     FROM site_configs
  `;

  const row = rows[0] || { used_bytes: 0, item_count: 0 };
  return {
    usedBytes: Number(row.used_bytes) || 0,
    itemCount: Number(row.item_count) || 0,
  };
}