import assert from 'node:assert'
import { drizzle } from 'drizzle-orm/neon-http'

assert(process.env.DATABASE_URL, 'DATABASE_URL is required')

export const db = drizzle(process.env.DATABASE_URL)
