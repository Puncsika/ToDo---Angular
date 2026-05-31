import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve(process.cwd(), '.env');
const outputDir = resolve(process.cwd(), 'src/environments');
const outputPath = resolve(outputDir, 'environment.ts');

function cleanValue(value = '') {
  return value
    .trim()
    .replace(/^['"]/, '')
    .replace(/['"];?$/, '')
    .replace(/;$/, '');
}

function parseEnv(content) {
  return content
    .split('\n')
    .filter((line) => line.trim() !== '' && !line.trim().startsWith('#'))
    .reduce((env, line) => {
      const [key, ...valueParts] = line.split('=');
      env[key.trim()] = cleanValue(valueParts.join('='));
      return env;
    }, {});
}

const localEnv = existsSync(envPath)
  ? parseEnv(readFileSync(envPath, 'utf-8'))
  : {};

const supabaseUrl = cleanValue(
  process.env.NG_APP_SUPABASE_URL || localEnv.NG_APP_SUPABASE_URL
);

const supabaseAnonKey = cleanValue(
  process.env.NG_APP_SUPABASE_ANON_KEY || localEnv.NG_APP_SUPABASE_ANON_KEY
);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Hiányzik az NG_APP_SUPABASE_URL vagy az NG_APP_SUPABASE_ANON_KEY. Lokálisan .env fájlban, Vercelen Environment Variables alatt add meg.');
}

mkdirSync(outputDir, { recursive: true });

writeFileSync(
  outputPath,
  `export const environment = {
  supabaseUrl: ${JSON.stringify(supabaseUrl)},
  supabaseAnonKey: ${JSON.stringify(supabaseAnonKey)}
};
`
);

console.log('environment.ts legenerálva.');