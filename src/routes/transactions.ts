import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";

export async function transactionsRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const transactions = await knex("transactions").select("*");

    return reply.status(200).send({
      transactions,
    });
  });

  app.get("/:id", async (request, reply) => {
    const getTrasactionSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getTrasactionSchema.parse(request.params);
    const transaction = await knex("transactions").where("id", id).first();

    return reply.status(200).send({ transaction });
  });

  app.get("/sumary", async (request, reply) => {
    const sumary = await knex("transactions")
      .sum("amount", { as: "amount" })
      .first();

    return reply.status(200).send({ sumary });
  });

  app.post("/", async (request, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = bodySchema.parse(request.body);

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();
      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
