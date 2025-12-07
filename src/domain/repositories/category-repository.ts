import Category from "@/domain/entities/category";

export interface CreateCategoryDTO {
  name: string;
  points: number;
  description?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  points?: number;
  description?: string;
}

export default interface CategoryRepository {
  create(data: CreateCategoryDTO): Promise<Category>;
  findById(id: number): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  update(category: Category): Promise<Category>;
  delete(id: number): Promise<void>;
}
