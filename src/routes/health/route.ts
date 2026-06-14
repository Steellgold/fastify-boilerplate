import { healthController } from "@/controllers/health.controller"
import type { FastifyPluginAsync } from "fastify"

const route: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", healthController.check)
}

export default route