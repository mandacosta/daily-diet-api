import { afterAll, beforeAll } from 'vitest'
import { execSync } from 'node:child_process'

beforeAll(async () => {
  execSync('npm run knex -- migrate:rollback --all') // Destrói as tabelas
  execSync('npm run knex -- migrate:latest') // Cria as tabelas
})

afterAll(async () => {
  execSync('npm run knex -- migrate:rollback --all') // Destrói as tabelas
})
