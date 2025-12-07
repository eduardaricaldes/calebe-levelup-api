export interface CategoryItemDTO {
  id: number;
  name: string;
  points: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListCategoriesResponseDTO {
  categories: CategoryItemDTO[];
}
