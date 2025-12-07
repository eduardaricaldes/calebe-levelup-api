import ActionRepository from "@/domain/repositories/action-repository";

export default class DeleteActionUseCase {
  
  constructor(
    private readonly actionRepository: ActionRepository,
  ) {}
  
  async execute(id: number): Promise<void> {
    const action = await this.actionRepository.findById(id.toString());

    if (!action) {
      throw new Error('Action not found');
    }

    await this.actionRepository.delete(id);
  }
}
