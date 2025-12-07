import ActionRepository from "@/domain/repositories/action-repository";
import { ListActionsResponseDTO } from "@/app/dto/list-actions-responseDTO";

export default class GetActionsByUserUseCase {
  
  constructor(
    private readonly actionRepository: ActionRepository,
  ) {}
  
  async execute(userId: number): Promise<ListActionsResponseDTO> {
    const actions = await this.actionRepository.findActionsByUserID(userId);

    if (!actions || actions.length === 0) {
      return { actions: [] };
    }

    return {
      actions: actions.map(action => ({
        id: action.id!,
        name: action.name,
        date: action.date,
        description: action.description,
        categoryId: action.categoryId,
        createdAt: action.created_at,
        updatedAt: action.updated_at,
      })),
    };
  }
}
