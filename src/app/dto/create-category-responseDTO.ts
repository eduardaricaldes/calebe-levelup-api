export interface CreateCategoryResponseDTO {
  id: number;
  name: string;
  points: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
