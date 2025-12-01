import UserRepository from "@/domain/repositories/user-repository";

export default class DeleteUserUseCase {
  
  constructor(
    private readonly userRepository: UserRepository,
  ) {}
  
  async execute(externalId: string): Promise<void> {
    const user = await this.userRepository.findByExternalId(externalId);

    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.deleteByExternalId(externalId);
  }
}
