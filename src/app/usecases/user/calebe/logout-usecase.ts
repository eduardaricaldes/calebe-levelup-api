import RefreshTokenRepository from "@/domain/repositories/refresh-token-repository";

export interface LogoutRequest {
  userId: number;
}

export default class LogoutUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(request: LogoutRequest): Promise<void> {
    // Revogar todos os refresh tokens do usuário
    await this.refreshTokenRepository.revokeAllByUserId(request.userId);
  }
}
