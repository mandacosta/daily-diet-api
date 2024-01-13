import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import './setUp'

let COOKIES = ['']
let mealId = ''

describe('Meal Routes', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/user')
      .send({
        name: 'Mary Kate',
        email: 'marykate94@gmail.com',
      })
      .expect(201)

    COOKIES = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meal')
      .set('Cookie', COOKIES)
      .send({
        title: 'Janta',
        description: 'Arroz, feijão, bife e salada',
        dateTime: '2024-01-10T21:22:33',
        onDiet: false,
      })
      .expect(201)
  })

  it('should be able to list all meals posted', async () => {
    const sessionId = COOKIES[0].split(';')[0].split('=')[1]
    const listMealsResponse = await request(app.server)
      .get('/meal')
      .set('Cookie', COOKIES)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        session_id: sessionId,
        title: 'Janta',
        description: 'Arroz, feijão, bife e salada',
        dateTime: '2024-01-10T21:22:33',
        onDiet: 0,
      }),
    ])

    mealId = listMealsResponse.body.meals[0].id
  })

  it('should be able to get a meal by its id', async () => {
    const sessionId = COOKIES[0].split(';')[0].split('=')[1]
    const getMealByIdResponse = await request(app.server)
      .get(`/meal/${mealId}`)
      .set('Cookie', COOKIES)
      .expect(200)

    expect(getMealByIdResponse.body).toEqual(
      expect.objectContaining({
        id: mealId,
        session_id: sessionId,
        title: 'Janta',
        description: 'Arroz, feijão, bife e salada',
        dateTime: '2024-01-10T21:22:33',
        onDiet: 0,
      }),
    )
  })

  it('should be able to edit a meal', async () => {
    const sessionId = COOKIES[0].split(';')[0].split('=')[1]
    await request(app.server)
      .patch(`/meal/${mealId}`)
      .set('Cookie', COOKIES)
      .send({
        title: 'Almoço',
        description: 'Macarrão',
        dateTime: '2024-01-10T12:22:33',
        onDiet: true,
      })
      .expect(200)

    const getMealByIdResponse = await request(app.server)
      .get(`/meal/${mealId}`)
      .set('Cookie', COOKIES)
      .expect(200)

    expect(getMealByIdResponse.body).toEqual(
      expect.objectContaining({
        id: mealId,
        session_id: sessionId,
        title: 'Almoço',
        description: 'Macarrão',
        dateTime: '2024-01-10T12:22:33',
        onDiet: 1,
      }),
    )
  })

  it('should be able to delete a meal', async () => {
    await request(app.server)
      .delete(`/meal/${mealId}`)
      .set('Cookie', COOKIES)
      .expect(204)

    const getMealByIdResponse = await request(app.server)
      .get(`/meal/${mealId}`)
      .set('Cookie', COOKIES)
      .expect(200)

    expect(getMealByIdResponse.body).toEqual({})
  })

  it('should be able to get the user metrics', async () => {
    const mealsToCreate = [
      {
        title: 'Almoço',
        description: 'Arroz, feijão, frango e salada',
        dateTime: '2024-01-10T12:30:00',
        onDiet: true,
      },
      {
        title: 'Lanche da Tarde',
        description: 'Frutas e iogurte',
        dateTime: '2024-01-10T15:00:00',
        onDiet: true,
      },
      {
        title: 'Petisco no boteco',
        description: 'Amendoim e cerveja',
        dateTime: '2024-01-10T18:00:00',
        onDiet: false,
      },
      {
        title: 'Jantar',
        description: 'Pizza de atum',
        dateTime: '2024-01-10T22:00:00',
        onDiet: false,
      },
      {
        title: 'Almoço',
        description: 'Arroz, feijão, frango e salada',
        dateTime: '2024-01-11T12:30:00',
        onDiet: true,
      },
      {
        title: 'Lanche da Tarde',
        description: 'Frutas e iogurte',
        dateTime: '2024-01-11T15:00:00',
        onDiet: true,
      },
      {
        title: 'Petisco com amigas',
        description: 'Cesar Salad',
        dateTime: '2024-01-11T18:00:00',
        onDiet: true,
      },
      {
        title: 'Ceia',
        description: 'Yogurte com lixia',
        dateTime: '2024-01-11T22:00:00',
        onDiet: true,
      },
    ]

    for (const meal of mealsToCreate) {
      await request(app.server)
        .post('/meal')
        .set('Cookie', COOKIES)
        .send(meal)
        .expect(201)
    }

    const sessionId = COOKIES[0].split(';')[0].split('=')[1]
    const listMealsResponse = await request(app.server)
      .get('/meal')
      .set('Cookie', COOKIES)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title: 'Almoço',
          description: 'Arroz, feijão, frango e salada',
          dateTime: '2024-01-10T12:30:00',
          onDiet: 1,
          session_id: sessionId,
        }),
      ]),
    )

    const getMetricsResponse = await request(app.server)
      .get('/meal/metrics')
      .set('Cookie', COOKIES)
      .expect(200)

    expect(getMetricsResponse.body).toEqual(
      expect.objectContaining({
        total: mealsToCreate.length,
        totalMealsOn: 6,
        totalMealsOff: 2,
        bestOnDietSequence: 4,
      }),
    )
  })
})
