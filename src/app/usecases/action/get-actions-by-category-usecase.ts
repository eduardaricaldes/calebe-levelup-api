import ActionRepository from "@/domain/repositories/action-repository";
import { ListActionsResponseDTO } from "@/app/dto/list-actions-responseDTO";

export default class GetActionsByCategoryUseCase {
  
  constructor(
    private readonly actionRepository: ActionRepository,
  ) {}
  
  async execute(categoryId: string): Promise<ListActionsResponseDTO> {
    const actions = await this.actionRepository.findByCategoryId(categoryId);

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
