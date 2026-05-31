import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve(process.cwd(), '.env');
const outputDir = resolve(process.cwd(), 'src/environments');
const outputPath = resolve(outputDir, 'environment.ts');

function parseEnv(content) {
  return content
    .split('\n')
    .filter((line) => line.trim() !== '' && !line.trim().startsWith('#'))
    .reduce((env, line) => {
      const [key, ...valueParts] = line.split('=');
      env[key.trim()] = valueParts.join('=').trim();
      return env;
    }, {});
}

const env = parseEnv(readFileSync(envPath, 'utf-8'));

const supabaseUrl = env.NG_APP_SUPABASE_URL;
const supabaseAnonKey = env.NG_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Hiányzik az NG_APP_SUPABASE_URL vagy az NG_APP_SUPABASE_ANON_KEY a .env fájlból.');
}

mkdirSync(outputDir, { recursive: true });

writeFileSync(
  outputPath,
  `export const environment = {
  supabaseUrl: '${supabaseUrl}',
  supabaseAnonKey: '${supabaseAnonKey}'
};
`
);

console.log('environment.ts legenerálva.');