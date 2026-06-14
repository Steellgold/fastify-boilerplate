import { buildApp } from "@/app"
import { env } from "@/config/env"

try {
  const app = await buildApp()
  await app.listen({ port: env.PORT, host: env.HOST })
} catch (err) {
  console.error("Failed to start server:", err)
  process.exit(1)
}