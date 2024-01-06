import fastify from 'fastify'
import { userRoutes, mealsRoutes } from './routes/export-routes'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)

app.register(userRoutes, {
  prefix: '/user',
})

app.register(mealsRoutes, {
  prefix: '/meal',
})
