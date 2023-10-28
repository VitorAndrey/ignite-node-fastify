import "dotenv/config"
import { knex as setupKnex, Knex } from "knex";

export const knexConf: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: process.env.DATABASE_URL || "",
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
};

export const knex = setupKnex(knexConf);
