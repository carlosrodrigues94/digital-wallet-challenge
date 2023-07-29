/* eslint-disable prettier/prettier */
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.raw(`
    CREATE TABLE "withdraws" (
      "id" UUID,
      "userId" UUID,
      "source" VARCHAR(255),
      "sourceTransactionId" VARCHAR(255),
      "amount" INTEGER,
      "createdAt" TIMESTAMPTZ,
      CONSTRAINT "withdraws_pkey" PRIMARY KEY ("id")
    )
  `).raw(`
    ALTER TABLE "withdraws" ADD CONSTRAINT "withdraws_id_unique" UNIQUE ("id")
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('withdraws');
}
