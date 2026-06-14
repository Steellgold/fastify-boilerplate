import type { FastifyPluginAsync } from "fastify"
import { readdirSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath, pathToFileURL } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ROUTES_DIR = join(__dirname, "..", "routes")
const ROUTE_FILE_NAMES = ["route.ts", "route.js"]

/** Map a Next.js-style dynamic segment to its Fastify equivalent. */
const replaceDynamicSegments = (segment: string): string => {
  // [...param] → :param*
  if (/^\[{3}\.\.\.(\w+)\]$/.test(segment)) {
    return ":" + segment.replace(/^\[\.\.\.(\w+)\]$/, "$1*")
  }
  // [[param]] → :param?
  if (/^\[{2}(\w+)\]{2}$/.test(segment)) {
    return ":" + segment.replace(/^\[\[(\w+)\]\]$/, "$1?")
  }
  // [param] → :param
  if (/^\[(\w+)\]$/.test(segment)) {
    return ":" + segment.replace(/^\[(\w+)\]$/, "$1")
  }
  return segment
}

/** Recursively collect all `route.ts` / `route.js` file paths. */
const scanRouteFiles = (dir: string): string[] => {
  const files: string[] = []
  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...scanRouteFiles(fullPath))
    } else if (ROUTE_FILE_NAMES.includes(entry.name)) {
      files.push(fullPath)
    }
  }

  return files
}

/** Convert a route directory path to a URL prefix (e.g. `users/[id]` → `/users/:id`). */
const dirPathToPrefix = (routeDir: string): string => {
  const relative = routeDir.slice(ROUTES_DIR.length).replace(/\\/g, "/")
  const segments = relative.split("/").filter(Boolean)
  return "/" + segments.map(replaceDynamicSegments).join("/")
}

/**
 * Fastify plugin that auto-discovers route files under `src/routes/`.
 *
 * Conventions:
 * - Each folder with a `route.ts` is registered as a Fastify plugin.
 * - The folder path becomes the URL prefix.
 * - `[param]` → `:param`, `[[param]]` → `:param?`, `[...param]` → `:param*`
 * - Deeper paths are registered first to avoid prefix shadowing.
 */
export const autoRoutePlugin: FastifyPluginAsync = async (fastify) => {
  const files = scanRouteFiles(ROUTES_DIR)

  // Sort descending so nested routes register before their parent prefixes
  files.sort((a, b) => b.length - a.length)

  for (const file of files) {
    const routeDir = dirname(file)
    const prefix = dirPathToPrefix(routeDir)

    try {
      const mod = await import(pathToFileURL(file).href)
      const plugin = mod.default ?? mod
      await fastify.register(plugin, { prefix })
    } catch (err) {
      fastify.log.error({ err, file }, `Failed to load route: ${prefix}`)
    }
  }

  fastify.log.trace(`\n${fastify.printRoutes({ commonPrefix: false })}\nRoutes loaded: ${files.length}`)
}