import { jstack } from "jstack"

interface Env {
  // Using Record<never, never> for an intentionally empty object type
  Bindings: Record<never, never>
}

export const j = jstack.init<Env>()

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = j.procedure
