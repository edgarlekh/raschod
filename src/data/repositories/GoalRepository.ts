// src/data/repositories/GoalRepository.ts
export interface GoalRecord {
  id: string;
  name: string;
  targetAmountMinor: number;
  currentAmountMinor: number;
  currency: string;
  deadline: string | null;
  isPrimary: boolean;
  createdAt: string;
}

export interface CreateGoalInput {
  name: string;
  targetAmountMinor: number;
  currency: string;
  deadline?: string;
  isPrimary?: boolean;
}

export interface GoalRepository {
  create(input: CreateGoalInput): Promise<GoalRecord>;
  listAll(): Promise<GoalRecord[]>;
  getPrimary(): Promise<GoalRecord | null>;
  addSavings(id: string, amountMinor: number): Promise<GoalRecord>;
  delete(id: string): Promise<void>;
}
