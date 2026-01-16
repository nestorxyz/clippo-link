import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_retired-provider_URL: z.string().url(),
    NEXT_PUBLIC_retired-provider_ANON_KEY: z.string(),
    NEXT_PUBLIC_BACKEND_URL: z.string().url(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ""
  },
  server: {
    CLERK_SECRET_KEY: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_retired-provider_URL: process.env.NEXT_PUBLIC_retired-provider_URL,
    NEXT_PUBLIC_retired-provider_ANON_KEY: process.env.NEXT_PUBLIC_retired-provider_ANON_KEY,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ""
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },
});
