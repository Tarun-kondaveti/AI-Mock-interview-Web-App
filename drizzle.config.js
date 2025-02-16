import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema:"./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_nbfyZFoxv04J@ep-curly-mode-a9zsqpuc-pooler.gwc.azure.neon.tech/neondb?sslmode=require",
  }
})
