import { Knex, knex as setUpKnex } from 'knex'

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './db/app.db',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setUpKnex(config)
