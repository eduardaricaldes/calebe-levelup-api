import UserRepository from "@/domain/repositories/user-repository";
import { UpdateUserStatusRequestDTO } from "@/app/dto/update-user-status-requestDTO";
import { UserStatus } from "@/domain/entities/user";

export default class UpdateUserStatusUseCase {
  
  constructor(
    private readonly userRepository: UserRepository,
  ) {}
  
  async execute(updateUserStatusRequestDTO: UpdateUserStatusRequestDTO): Promise<void> {
    const user = await this.userRepository.findByExternalId(updateUserStatusRequestDTO.externalId);

    if (!user) {
      throw new Error('User not found');
    }

    // Validar status
    const validStatuses = Object.values(UserStatus);
    if (!validStatuses.includes(updateUserStatusRequestDTO.status as UserStatus)) {
      throw new Error('Invalid status');
    }

    user.status = updateUserStatusRequestDTO.status as UserStatus;
    user.updatedAt = new Date();

    await this.userRepository.update(user);
  }
}
