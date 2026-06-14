import { app } from "@/app"
import { env } from "@/config/env"

const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: env.HOST })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()