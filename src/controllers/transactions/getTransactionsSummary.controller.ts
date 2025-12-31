import type { FastifyReply, FastifyRequest } from "fastify";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import prisma from "../../config/prisma";
import type { CategorySummary } from "../category.type";
import { TransactionType } from "@prisma/client";
import type { TransactionSummary } from "../../types/transactions.types";
import type { GetTransactionsQuery } from "../../schemas/transaction.schema";

dayjs.extend(utc);

export const getTransactionsSummary = async (
  request: FastifyRequest<{ Querystring: GetTransactionsQuery }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    reply.status(401).send({ error: "Usuário não autenticado" });
    return;
  }

  const { month, year } = request.query;

  if (!month || !year) {
    reply.status(400).send({ error: "Mês e Ano são Obrigatórios" });
    return;
  }

  const startDate = dayjs
    .utc(`${year}-${month}-01`)
    .startOf("month")
    .toDate();

  const endDate = dayjs
    .utc(startDate)
    .endOf("month")
    .toDate();

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    let totalExpenses = 0;
    let totalIncomes = 0;

    const groupedExpenses = new Map<string, CategorySummary>();

    for (const transaction of transactions) {
      if (transaction.type === TransactionType.expense) {
        const existing = groupedExpenses.get(transaction.categoryId) ?? {
          categoryId: transaction.categoryId,
          categoryName: transaction.category.name,
          categoryColor: transaction.category.color,
          amount: 0,
          percentage: 0,
        };

        existing.amount += transaction.amount;
        groupedExpenses.set(transaction.categoryId, existing);

        totalExpenses += transaction.amount;
      } else {
        totalIncomes += transaction.amount;
      }
    }

    const expenseCategory =
      totalExpenses > 0
        ? Array.from(groupedExpenses.values())
            .map((entry) => ({
              ...entry,
              percentage: Number(
                ((entry.amount / totalExpenses) * 100).toFixed(2),
              ),
            }))
            .sort((a, b) => b.amount - a.amount)
        : [];

    const summary: TransactionSummary = {
      totalExpenses: Number(totalExpenses.toFixed(2)),
      totalIncomes: Number(totalIncomes.toFixed(2)),
      balance: Number((totalIncomes - totalExpenses).toFixed(2)),
      expenseCategory,
    };

    reply.send(summary);
  } catch (err) {
    request.log.error(
      { err },
      "Erro ao trazer transações"
    );

    reply.status(500).send({ error: "Erro do servidor" });
  }
};
