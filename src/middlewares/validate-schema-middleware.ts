import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodType } from 'zod'

export const validateSchema =
  (schema: ZodType) => async (request: FastifyRequest, reply: FastifyReply) => {
    const body = schema.safeParse(request.body)

    if (!body.success) {
      return reply.status(400).send({ mensagem: 'Incorret data format' })
    }
  }
