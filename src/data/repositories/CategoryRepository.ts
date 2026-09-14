// src/data/repositories/CategoryRepository.ts
export interface CategoryRecord {
  id: string;
  name: string;
  icon: string;
  color: string;
  isCustom: boolean;
}

export interface CreateCategoryInput {
  name: string;
  icon: string;
  color: string;
}

export interface CategoryRepository {
  listAll(): Promise<CategoryRecord[]>;
  create(input: CreateCategoryInput): Promise<CategoryRecord>;
  delete(id: string): Promise<void>;
  seedDefaultsIfEmpty(): Promise<void>;
}
