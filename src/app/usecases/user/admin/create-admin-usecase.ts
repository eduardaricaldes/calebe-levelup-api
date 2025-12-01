import UserRepository, { CreateUserDTO } from "@/domain/repositories/user-repository";
import { CreateUserRequestDTO } from "@/app/dto/create-user-requestDTO";
import { UserRole, UserStatus } from "@/domain/entities/user";
import { CreateUserResponseDTO } from "@/app/dto/create-user-responseDTO";
import PasswordHasher from "@/domain/services/password-hasher";

export default class CreateAdminUseCase {
  
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}
  
  async execute(createUserRequestDTO: CreateUserRequestDTO): Promise<CreateUserResponseDTO> {
    const user = await this.userRepository.create(await this.createUser(createUserRequestDTO));

    return {
      externalId: user.externalId,
      name: user.name,
      email: user.email,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async createUser(createUserRequestDTO: CreateUserRequestDTO): Promise<CreateUserDTO> {
    const passwordHash = await this.passwordHasher.hash(createUserRequestDTO.password);

    return {
      name: createUserRequestDTO.name,
      email: createUserRequestDTO.email,
      password: passwordHash,
      role: UserRole.ADMIN
      ,
      status: UserStatus.WAITING_APPROVAL,
    }
  }
}