// eslint-disable-next-line
import fastify from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    userId: string
  }
}
