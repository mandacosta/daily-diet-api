import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import './setUp'

describe('User Routes', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/user')
      .send({
        name: 'John Doe',
        email: 'johndoe93@gmail.com',
      })
      .expect(201)
  })

  it('should not be able to create a another user with an email already being used', async () => {
    const doubleUser = await request(app.server)
      .post('/user')
      .send({
        name: 'John Doe',
        email: 'johndoe93@gmail.com',
      })
      .expect(200)

    expect(doubleUser.body).toEqual(
      expect.objectContaining({
        message: 'User logged in',
      }),
    )
  })
})
