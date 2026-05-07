import { neon } from '@neondatabase/serverless';
const client = neon('postgresql://test:test@test/test');
const sql = (strings, ...values) => client(strings, ...values);
console.log(sql`SELECT 1`);
