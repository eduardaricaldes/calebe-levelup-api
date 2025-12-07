export interface CreateActionRequestDTO {
  name: string;
  date: Date;
  description?: string;
  categoryId: number;
}
