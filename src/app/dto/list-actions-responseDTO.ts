export interface ActionItemDTO {
  id: number;
  name: string;
  date: Date;
  description: string | null;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListActionsResponseDTO {
  actions: ActionItemDTO[];
}
