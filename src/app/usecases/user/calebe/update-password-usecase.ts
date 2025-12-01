import UserRepository from "@/domain/repositories/user-repository";
import PasswordHasher from "@/domain/services/password-hasher";
import { UpdatePasswordRequestDTO } from "@/app/dto/update-password-requestDTO";

export default class UpdatePasswordUseCase {
  
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}
  
  async execute(updatePasswordRequestDTO: UpdatePasswordRequestDTO): Promise<void> {
    const user = await this.userRepository.findByExternalId(updatePasswordRequestDTO.externalId);

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await this.passwordHasher.compare(
      updatePasswordRequestDTO.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    if (updatePasswordRequestDTO.newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long');
    }

    const newPasswordHash = await this.passwordHasher.hash(updatePasswordRequestDTO.newPassword);
    
    user.password = newPasswordHash;
    user.updatedAt = new Date();

    await this.userRepository.update(user);
  }
}
