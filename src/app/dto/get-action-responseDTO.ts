export interface GetActionResponseDTO {
  id: number;
  name: string;
  date: Date;
  description: string | null;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
}
