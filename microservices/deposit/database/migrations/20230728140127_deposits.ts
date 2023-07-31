/* eslint-disable prettier/prettier */
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.raw(`
    CREATE TABLE "deposits" (
      "id" UUID,
      "userId" UUID,
      "source" VARCHAR(255),
      "sourceDescription" VARCHAR(255),
      "sourceTransactionId" VARCHAR(255),
      "amount" INTEGER,
      "createdAt" TIMESTAMPTZ,
      CONSTRAINT "deposits_pkey" PRIMARY KEY ("id")
    )
  `).raw(`
    ALTER TABLE "deposits" ADD CONSTRAINT "deposits_id_unique" UNIQUE ("id")
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('deposits');
}
