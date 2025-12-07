import ActionRepository from "@/domain/repositories/action-repository";
import { UpdateActionRequestDTO } from "@/app/dto/update-action-requestDTO";

export default class UpdateActionUseCase {
  constructor(
    private readonly actionRepository: ActionRepository,
  ) {}
  
  async execute(id: string, updateActionRequestDTO: UpdateActionRequestDTO): Promise<void> {
    const action = await this.actionRepository.findById(id);

    if (!action) {
      throw new Error('Action not found');
    }

    if (updateActionRequestDTO.name) {
      action.name = updateActionRequestDTO.name;
    }

    if (updateActionRequestDTO.date) {
      action.date = updateActionRequestDTO.date;
    }

    if (updateActionRequestDTO.description !== undefined) {
      action.description = updateActionRequestDTO.description || null;
    }

    if (updateActionRequestDTO.categoryId) {
      action.categoryId = updateActionRequestDTO.categoryId;
    }

    action.updated_at = new Date();

    await this.actionRepository.update(action);
  }
}
