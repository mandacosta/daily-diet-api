import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }

  const checkUser = await knex('userDailyDiet')
    .select()
    .where('session_id', sessionId)
    .returning('*')
    .first()

  if (!checkUser) {
    return reply.status(404).send({ error: 'User not found' })
  }

  request.userId = checkUser.id
}
