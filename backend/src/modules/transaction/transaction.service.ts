import { TransactionRepository } from './transaction.repository';
import { AppError } from '../../utils/errors';
import { TransactionType } from '@prisma/client';

export class TransactionService {
  private repository = new TransactionRepository();

  async createTransaction(
    orgId: string,
    data: {
      type: TransactionType;
      amount: number;
      category: string;
      description?: string;
      createdAt?: string;
    }
  ) {
    return this.repository.create({
      ...data,
      orgId,
    });
  }



  async updateTransaction(
    id: string,
    orgId: string,
    data: Partial<{
      type: TransactionType;
      amount: number;
      category: string;
      description: string;
      createdAt: string;
    }>
  ) {
    const transaction = await this.repository.update(id, orgId, data);

    if (!transaction) {
      throw new AppError(404, 'Transaction not found');
    }

    return transaction;
  }

  async deleteTransaction(id: string, orgId: string) {
    const transaction = await this.repository.delete(id, orgId);

    if (!transaction) {
      throw new AppError(404, 'Transaction not found');
    }

    return transaction;
  }

  async getTransactionById(id: string, orgId: string) {
    const transaction = await this.repository.findById(id, orgId);

    if (!transaction) {
      throw new AppError(404, 'Transaction not found');
    }

    return transaction;
  }

  async listTransactions(params: {
    orgId: string;
    cursor?: string;
    limit?: number;
    type?: TransactionType;
    category?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: 'createdAt' | 'amount';
    sortOrder?: 'asc' | 'desc';
  }) {
    const limit = Number(params.limit) || 10;

    const sortBy = params.sortBy === 'amount' ? 'amount' : 'createdAt';
    const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';

    const result = await this.repository.findMany({
      orgId: params.orgId,
      cursor: params.cursor,
      take: limit,
      type: params.type,
      category: params.category,
      startDate: params.startDate ? new Date(params.startDate) : undefined,
      endDate: params.endDate ? new Date(params.endDate) : undefined,
      sortBy,
      sortOrder,
    });

    return {
      data: result.items,
      meta: {
        total: result.total,
        limit,
        nextCursor: result.nextCursor,
        hasMore: result.nextCursor !== null,
      },
    };
  }

  async exportTransactionsCsvStream(orgId: string, writableStream: NodeJS.WritableStream) {
    const writable = writableStream as NodeJS.WritableStream & { destroyed?: boolean; writableEnded?: boolean };
    let aborted = false;
    writable.on('close', () => {
      aborted = true;
    });

    const writeRow = async (row: string) => {
      if (aborted) return;
      if (!writable.write(row)) {
        await new Promise<void>((resolve) => writable.once('drain', () => resolve()));
      }
    };

    await writeRow('ID,Date,Type,Category,Amount,Description\n');

    let cursor: string | undefined = undefined;
    const batchSize = 1000;
    const { prisma } = require('../../db/prisma');

    while (!aborted) {
      const batch: any[] = await prisma.transaction.findMany({
        where: { orgId },
        take: batchSize,
        skip: cursor ? 1 : 0,
        ...(cursor ? { cursor: { id: cursor } } : {}),
        orderBy: { createdAt: 'desc' }
      });

      if (batch.length === 0) break;

      for (const t of batch) {
        if (aborted) break;
        const id = t.id;
        const date = t.createdAt.toISOString();
        const category = `"${t.category.replace(/"/g, '""')}"`;
        const amount = t.amount;
        const desc = t.description ? `"${t.description.replace(/"/g, '""')}"` : '""';
        await writeRow(`${id},${date},${t.type},${category},${amount},${desc}\n`);
      }

      if (aborted) break;
      cursor = batch[batch.length - 1].id;
    }

    if (!writable.writableEnded && !writable.destroyed) {
      writable.end();
    }
  }
}