import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const getDatabaseUrl = () => {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set')
  }

  if (databaseUrl?.includes('supabase')) {
    // use Session Mode Connection string
    // ref: https://github.com/drizzle-team/drizzle-orm/issues/4047
    return databaseUrl.replace('6543', '5432')
  }

  return databaseUrl
}

export default defineConfig({
  out: './src/db/migrations',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: getDatabaseUrl(),
  },
})
