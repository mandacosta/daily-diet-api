import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'
import { validateSchema } from '../middlewares/validate-schema-middleware'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists-middleware'

const createMealSchema = z.object({
  title: z.string(),
  description: z.string(),
  dateTime: z.string().refine((dataHora) => {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/
    return regex.test(dataHora)
  }),
  onDiet: z.boolean(),
})

const editMealSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  dateTime: z
    .string()
    .refine((dataHora) => {
      const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/
      return regex.test(dataHora)
    })
    .optional(),
  onDiet: z.boolean().optional(),
})

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists, validateSchema(createMealSchema)],
    },
    async (request, reply) => {
      const { title, description, dateTime, onDiet } = createMealSchema.parse(
        request.body,
      )

      await knex('mealsDailyDiet').insert({
        id: crypto.randomUUID(),
        session_id: request.cookies.sessionId,
        title,
        description,
        dateTime,
        onDiet,
      })

      return reply.status(201).send()
    },
  )

  app.patch(
    '/:id',
    {
      preHandler: [checkSessionIdExists, validateSchema(editMealSchema)],
    },
    async (request, reply) => {
      const editedMeal = editMealSchema.parse(request.body)

      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      await knex('mealsDailyDiet').where('id', id).update(editedMeal)

      return reply.status(200).send()
    },
  )

  app.get(
    '/:id?',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const sessionId = request.cookies.sessionId
      const getMealParamsSchema = z.object({
        id: z.string().uuid().optional(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      if (id) {
        const meal = await knex('mealsDailyDiet')
          .select('*')
          .where({
            session_id: sessionId,
            id,
          })
          .first()

        return { ...meal }
      }

      const meals = await knex('mealsDailyDiet')
        .select('*')
        .where('session_id', sessionId)

      return { meals }
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId
      const deleteMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = deleteMealParamsSchema.parse(request.params)

      await knex('mealsDailyDiet').delete().where({
        session_id: sessionId,
        id,
      })

      return reply.status(204).send()
    },
  )

  app.get(
    '/metrics',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const sessionId = request.cookies.sessionId
      const meals = await knex('mealsDailyDiet')
        .select()
        .where({
          session_id: sessionId,
        })
        .orderBy('dateTime', 'desc')
      const totalOffDiet = await knex('mealsDailyDiet')
        .select()
        .where({
          session_id: sessionId,
          onDiet: false,
        })
        .count('id', { as: 'totalMealsOff' })
        .first()

      const totalOnDiet = await knex('mealsDailyDiet')
        .select()
        .where({
          session_id: sessionId,
          onDiet: true,
        })
        .count('id', { as: 'totalMealsOn' })
        .first()

      const { bestOnDietSequence } = meals.reduce(
        (acc, meal) => {
          meal.onDiet ? (acc.currentSequence += 1) : (acc.currentSequence = 0)

          if (acc.currentSequence > acc.bestOnDietSequence) {
            acc.bestOnDietSequence = acc.currentSequence
          }

          return acc
        },
        { bestOnDietSequence: 0, currentSequence: 0 },
      )

      return {
        total: meals.length,
        ...totalOnDiet,
        ...totalOffDiet,
        bestOnDietSequence,
      }
    },
  )
}
