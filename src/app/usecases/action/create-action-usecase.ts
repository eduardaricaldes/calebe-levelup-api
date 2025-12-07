import ActionRepository from "@/domain/repositories/action-repository";
import { CreateActionRequestDTO } from "@/app/dto/create-action-requestDTO";
import { CreateActionResponseDTO } from "@/app/dto/create-action-responseDTO";

export default class CreateActionUseCase {
  
  constructor(
    private readonly actionRepository: ActionRepository,
  ) {}
  
  async execute(createActionRequestDTO: CreateActionRequestDTO): Promise<CreateActionResponseDTO> {
    await this.actionRepository.create({
      name: createActionRequestDTO.name,
      date: createActionRequestDTO.date,
      description: createActionRequestDTO.description,
      categoryId: createActionRequestDTO.categoryId,
    });

    return {
      message: 'Action created successfully',
    };
  }
}
