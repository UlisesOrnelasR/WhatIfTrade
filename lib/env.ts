import 'server-only';

type RequiredEnvKey =
  | 'BETTER_AUTH_SECRET'
  | 'BETTER_AUTH_URL'
  | 'FINNHUB_API_KEY'
  | 'GEMINI_API_KEY'
  | 'MONGODB_URI'
  | 'NODEMAILER_EMAIL'
  | 'NODEMAILER_PASSWORD';

let hasWarnedAboutPublicFinnhubKey = false;
let hasWarnedAboutLocalBetterAuthSecret = false;

const LOCAL_BETTER_AUTH_SECRET = 'local-dev-only-better-auth-secret-change-me';
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

function getRequiredEnv(key: RequiredEnvKey): string {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function getOptionalEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();

  return value ? value : undefined;
}

function isLocalDevelopment(): boolean {
  const nodeEnv = getOptionalEnv('NODE_ENV') ?? 'development';

  if (nodeEnv === 'production') {
    return false;
  }

  const authUrl = getOptionalEnv('BETTER_AUTH_URL') ?? getOptionalEnv('NEXT_PUBLIC_BASE_URL');

  if (!authUrl) {
    return nodeEnv === 'development';
  }

  try {
    return LOCAL_HOSTNAMES.has(new URL(authUrl).hostname);
  } catch {
    return nodeEnv === 'development';
  }
}

function getBetterAuthSecret(): string {
  const value = getOptionalEnv('BETTER_AUTH_SECRET');

  if (value) {
    return value;
  }

  if (isLocalDevelopment()) {
    if (!hasWarnedAboutLocalBetterAuthSecret) {
      hasWarnedAboutLocalBetterAuthSecret = true;
      console.warn(
        'BETTER_AUTH_SECRET is missing. Using a local development fallback secret. Set BETTER_AUTH_SECRET in .env before deploying or sharing auth sessions across environments.'
      );
    }

    return LOCAL_BETTER_AUTH_SECRET;
  }

  throw new Error('Missing required environment variable: BETTER_AUTH_SECRET');
}

export const env = {
  get nodeEnv(): string {
    return getOptionalEnv('NODE_ENV') ?? 'development';
  },
  get appUrl(): string {
    return getOptionalEnv('NEXT_PUBLIC_BASE_URL') ?? 'http://localhost:3000';
  },
  get mongodbUri(): string {
    return getRequiredEnv('MONGODB_URI');
  },
  get betterAuthSecret(): string {
    return getBetterAuthSecret();
  },
  get betterAuthUrl(): string {
    return getRequiredEnv('BETTER_AUTH_URL');
  },
  get finnhubApiKey(): string {
    const serverKey = getOptionalEnv('FINNHUB_API_KEY');

    if (serverKey) {
      return serverKey;
    }

    const publicKey = getOptionalEnv('NEXT_PUBLIC_FINNHUB_API_KEY');

    if (publicKey) {
      if (!hasWarnedAboutPublicFinnhubKey) {
        hasWarnedAboutPublicFinnhubKey = true;
        console.warn(
          'Using NEXT_PUBLIC_FINNHUB_API_KEY on the server. Rename it to FINNHUB_API_KEY to avoid exposing it to the client bundle.'
        );
      }

      return publicKey;
    }

    throw new Error('Missing required environment variable: FINNHUB_API_KEY');
  },
  get geminiApiKey(): string {
    return getRequiredEnv('GEMINI_API_KEY');
  },
  get nodemailerEmail(): string {
    return getRequiredEnv('NODEMAILER_EMAIL');
  },
  get nodemailerPassword(): string {
    return getRequiredEnv('NODEMAILER_PASSWORD');
  },
};
