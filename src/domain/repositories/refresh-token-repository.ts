export interface RefreshTokenData {
  token: string;
  userId: number;
  expiresAt: Date;
}

export interface RefreshToken {
  id: number;
  token: string;
  userId: number;
  expiresAt: Date;
  createdAt: Date;
  revokedAt: Date | null;
}

export default interface RefreshTokenRepository {
  save(data: RefreshTokenData): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  revokeByToken(token: string): Promise<void>;
  revokeAllByUserId(userId: number): Promise<void>;
  deleteExpired(): Promise<void>;
}
