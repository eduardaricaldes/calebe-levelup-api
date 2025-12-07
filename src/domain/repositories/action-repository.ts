import Action from "@/domain/entities/action";

export interface ActionDTO {
  name: string;
  date: Date;
  description?: string;
  categoryId?: number;
}

export default interface ActionRepository {
  create(action: ActionDTO): Promise<void>;
  findById(id: number): Promise<Action | null>;
  update(action: Action): Promise<void>;
  delete(id: number): Promise<void>;
  findAll(): Promise<Action[] | null>;
  findByFilter(filter: Partial<ActionDTO>): Promise<Action[] | null>;
  findByCategoryId(categoryId: number): Promise<Action[] | null>;
  findActionByUserID(userId: number): Promise<Action | null>;
  findActionsByUserID(userId: number): Promise<Action[] | null>;
}