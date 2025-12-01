import UserRepository from "@/domain/repositories/user-repository";
import { UpdateUserRequestDTO } from "@/app/dto/update-user-requestDTO";
import { UpdateUserResponseDTO } from "@/app/dto/update-user-responseDTO";

export default class UpdateUserUseCase {
  
  constructor(
    private readonly userRepository: UserRepository,
  ) {}
  
  async execute(externalId: string, updateUserRequestDTO: UpdateUserRequestDTO): Promise<UpdateUserResponseDTO> {
    const user = await this.userRepository.findByExternalId(externalId);

    if (!user) {
      throw new Error('User not found');
    }

    if (updateUserRequestDTO.name) {
      user.name = updateUserRequestDTO.name;
    }

    if (updateUserRequestDTO.email) {
      const emailExists = await this.userRepository.findByEmail(updateUserRequestDTO.email);
      
      if (emailExists && emailExists.externalId !== externalId) {
        throw new Error('Email already in use');
      }
      
      user.email = updateUserRequestDTO.email;
    }

    user.updatedAt = new Date();

    const updatedUser = await this.userRepository.update(user);

    return {
      externalId: updatedUser.externalId,
      name: updatedUser.name,
      email: updatedUser.email,
      status: updatedUser.status,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
