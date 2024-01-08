import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto, { randomUUID } from 'node:crypto'
import { validateSchema } from '../middlewares/validate-schema-middleware'
import { knex } from '../database'

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
      const checkUser = await knex('userDailyDiet')
        .select()
        .where('email', email)
        .returning('*')
        .first()

      if (checkUser) {
        reply.cookie('sessionId', checkUser.session_id, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
        })

        return reply.status(200).send({ message: 'User logged in' })
      }

      const sessionId = randomUUID()
      await knex('userDailyDiet').insert({
        id: crypto.randomUUID(),
        name,
        email,
        session_id: sessionId,
      })

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
      })

      return reply.status(201).send()
    },
  )
}
