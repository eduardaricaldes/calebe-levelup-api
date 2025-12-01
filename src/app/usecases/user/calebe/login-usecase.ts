import UserRepository from "@/domain/repositories/user-repository";
import PasswordHasher from "@/domain/services/password-hasher";
import TokenGenerator from "@/domain/services/token-generator";
import { LoginRequestDTO } from "@/app/dto/login-requestDTO";
import { LoginResponseDTO } from "@/app/dto/login-responseDTO";
import { UserStatus } from "@/domain/entities/user";

export default class LoginUseCase {
  
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: TokenGenerator,
  ) {}
  
  async execute(loginRequestDTO: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this.userRepository.findByEmail(loginRequestDTO.email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await this.passwordHasher.compare(
      loginRequestDTO.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new Error('User is inactive');
    }

    if (user.status === UserStatus.WAITING_APPROVAL) {
      throw new Error('User is waiting for approval');
    }

    const token = await this.tokenGenerator.generate({
      sub: user.externalId,
      email: user.email,
    });

    return {
      token,
      user: {
        externalId: user.externalId,
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role,
      },
    };
  }
}
