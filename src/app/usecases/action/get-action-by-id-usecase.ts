import ActionRepository from "@/domain/repositories/action-repository";
import { GetActionResponseDTO } from "@/app/dto/get-action-responseDTO";

export default class GetActionByIdUseCase {
  
  constructor(
    private readonly actionRepository: ActionRepository,
  ) {}
  
  async execute(id: string): Promise<GetActionResponseDTO> {
    const action = await this.actionRepository.findById(id);

    if (!action) {
      throw new Error('Action not found');
    }

    return {
      id: action.id!,
      name: action.name,
      date: action.date,
      description: action.description,
      categoryId: action.categoryId,
      createdAt: action.created_at,
      updatedAt: action.updated_at,
    };
  }
}
