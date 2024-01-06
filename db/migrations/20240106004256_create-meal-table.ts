import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('mealsDailyDiet', (table) => {
    table.uuid('id').primary()
    table.uuid('session_id').index()
    table.text('title').notNullable()
    table.text('description').notNullable()
    table.dateTime('dateTime').notNullable()
    table.boolean('onDiet').notNullable().defaultTo(true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('mealsDailyDiet')
}
