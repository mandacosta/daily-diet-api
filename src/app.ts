import fastify from 'fastify'
import { userRoutes, mealsRoutes } from './routes/export-routes'

export const app = fastify()

app.register(userRoutes, {
  prefix: '/user',
})

app.register(mealsRoutes, {
  prefix: '/meal',
})
