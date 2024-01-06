import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { validateSchema } from '../middlewares/validate-schema-middleware'

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
})

export async function userRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [validateSchema(createUserSchema)],
    },
    async (request, reply) => {
      const { name, email } = createUserSchema.parse(request.body)

      return 'oi'
    },
  )
}
