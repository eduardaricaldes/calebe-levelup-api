import UserRepository from "@/domain/repositories/user-repository";
import User from "@/domain/entities/user";

export default class GetUserByExternalIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(externalId: string): Promise<User | null> {
    const user = await this.userRepository.findByExternalId(externalId);
    return user;
  }
}
