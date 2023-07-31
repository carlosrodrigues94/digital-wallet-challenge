/* eslint-disable prettier/prettier */
require('ts-node/register');
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.raw(`
    CREATE TABLE "statements" (
      "id" UUID,
      "userId" UUID,
      "amount" INTEGER,
      "createdAt" TIMESTAMPTZ,
      "updatedAt" TIMESTAMPTZ,
      CONSTRAINT "statements_pkey" PRIMARY KEY ("id")
    )
  `).raw(`
    ALTER TABLE "statements" ADD CONSTRAINT "statements_id_unique" UNIQUE ("id")
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('statements');
}
