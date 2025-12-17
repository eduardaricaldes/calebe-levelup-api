import RefreshTokenRepository from "@/domain/repositories/refresh-token-repository";
import UserRepository from "@/domain/repositories/user-repository";
import TokenGenerator from "@/domain/services/token-generator";

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export default class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    // Verificar se o refresh token existe e é válido
    const storedToken = await this.refreshTokenRepository.findByToken(request.refreshToken);

    if (!storedToken) {
      throw new Error('Invalid or expired refresh token');
    }

    // Verificar se o refresh token já foi revogado
    if (storedToken.revokedAt) {
      // Token reuse detection - possível ataque
      // Revogar todos os tokens do usuário
      await this.refreshTokenRepository.revokeAllByUserId(storedToken.userId);
      throw new Error('Refresh token has been revoked. All sessions invalidated.');
    }

    // Verificar se o token expirou
    if (storedToken.expiresAt < new Date()) {
      throw new Error('Refresh token has expired');
    }

    // Buscar o usuário
    const user = await this.userRepository.findById(storedToken.userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Revogar o refresh token antigo (rotação de tokens)
    await this.refreshTokenRepository.revokeByToken(request.refreshToken);

    // Gerar novo access token
    const newAccessToken = await this.tokenGenerator.generate({
      sub: user.externalId,
      email: user.email,
    });

    // Gerar novo refresh token
    const newRefreshToken = await this.tokenGenerator.generateRefreshToken();
    const expiresAt = this.tokenGenerator.getRefreshTokenExpirationDate();

    // Salvar novo refresh token no banco
    await this.refreshTokenRepository.save({
      token: newRefreshToken,
      userId: user.id,
      expiresAt,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
