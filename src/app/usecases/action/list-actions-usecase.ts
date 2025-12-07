import ActionRepository from "@/domain/repositories/action-repository";
import { ListActionsRequestDTO } from "@/app/dto/list-actions-requestDTO";
import { ListActionsResponseDTO } from "@/app/dto/list-actions-responseDTO";

export default class ListActionsUseCase {
  
  constructor(
    private readonly actionRepository: ActionRepository,
  ) {}
  
  async execute(listActionsRequestDTO?: ListActionsRequestDTO): Promise<ListActionsResponseDTO> {
    let actions;

    if (listActionsRequestDTO && Object.keys(listActionsRequestDTO).length > 0) {
      actions = await this.actionRepository.findByFilter(listActionsRequestDTO);
    } else {
      actions = await this.actionRepository.findAll();
    }

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
