// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    userDailyDiet: {
      id: string
      session_id: string
      email: string
      name: string
      created_at: string
    }
  }
}
