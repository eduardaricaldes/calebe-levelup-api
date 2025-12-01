import UserRepository from "@/domain/repositories/user-repository";
import { MeResponseDTO } from "@/app/dto/me-responseDTO";

export default class MeUseCase {
  
  constructor(
    private readonly userRepository: UserRepository,
  ) {}
  
  async execute(externalId: string): Promise<MeResponseDTO> {
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
