import type { FastifyPluginAsync } from "fastify"

const NOISE_PATTERNS = [
  { method: "GET", url: "/favicon.ico" },
  { method: "GET", url: "/robots.txt" },
  { method: "GET", url: "/" },
]

export const noiseRejectionPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", async (request, reply) => {
    for (const pattern of NOISE_PATTERNS) {
      if (request.method === pattern.method && request.url === pattern.url) {
        return reply.code(204).send()
      }
    }
  })
}
