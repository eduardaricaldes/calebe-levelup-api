import UserRepository from "@/domain/repositories/user-repository";
import { GetUserResponseDTO } from "@/app/dto/get-user-responseDTO";

export default class GetUserByExternalIdUseCase {
  
  constructor(
    private readonly userRepository: UserRepository,
  ) {}
  
  async execute(externalId: string): Promise<GetUserResponseDTO> {
    const user = await this.userRepository.findByExternalId(externalId);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      externalId: user.externalId,
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
