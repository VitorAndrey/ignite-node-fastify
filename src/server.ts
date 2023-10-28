import fastify from "fastify";
import crypto from "node:crypto";
import { knex } from "./database";
import { env } from "./env";

const app = fastify();

app.get("/transactions", async () => {
  const transaction = await knex("transactions")
  .where("amount", 200)
  .select("*")
  
  return transaction;
})

app.post("/transactions", async () => {
  const transaction = await knex("transactions").insert({
    id: crypto.randomUUID(),
    title: "Transação de teste 2",
    amount: 2000,
  }).returning("*");

  return transaction;
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("HTTP Server Running!");
  });
