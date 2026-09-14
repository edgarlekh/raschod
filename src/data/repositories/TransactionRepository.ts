// src/data/repositories/TransactionRepository.ts
export interface TransactionRecord {
  id: string;
  type: 'income' | 'expense';
  amountMinor: number;
  currency: string;
  categoryId: string;
  note: string | null;
  createdAt: string;
  frictionLevel: number;
  wasSkipped: boolean;
}

export interface CreateTransactionInput {
  type: 'income' | 'expense';
  amountMinor: number;
  currency: string;
  categoryId: string;
  note?: string;
  frictionLevel: number;
  wasSkipped: boolean;
}

export interface TransactionFilter {
  categoryId?: string;
  type?: 'income' | 'expense';
  fromDate?: string;
  toDate?: string;
}

export interface TransactionRepository {
  create(input: CreateTransactionInput): Promise<TransactionRecord>;
  list(filter?: TransactionFilter): Promise<TransactionRecord[]>;
  getById(id: string): Promise<TransactionRecord | null>;
  delete(id: string): Promise<void>;
}
