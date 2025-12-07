export interface GetCategoryResponseDTO {
  id: number;
  name: string;
  points: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
