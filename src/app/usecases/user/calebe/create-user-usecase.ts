import UserRepository, { CreateUserDTO } from "@/domain/repositories/user-repository";
import { CreateUserRequestDTO } from "@/app/dto/create-user-requestDTO";
import User, { UserStatus } from "@/domain/entities/user";

export default class CreateUserUseCase {
  
  constructor(private readonly userRepository: UserRepository) {}
  
  async execute(createUserRequestDTO: CreateUserRequestDTO): Promise<User> {
    const user = await this.userRepository.create(this.createUser(createUserRequestDTO));

    ///envia email de confirmação
    //encryptar password
    return user;
  }

  private createUser(createUserRequestDTO: CreateUserRequestDTO): CreateUserDTO {
    return {
      name: createUserRequestDTO.name,
      email: createUserRequestDTO.email,
      password: createUserRequestDTO.password,
      role: 'USER',
      status: UserStatus.WAITING_APPROVAL,
    }
  }
}