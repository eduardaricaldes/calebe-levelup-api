import { Kysely } from 'kysely';
import RefreshTokenRepository, { RefreshToken, RefreshTokenData } from "@/domain/repositories/refresh-token-repository";
import { DB as DatabaseSchema } from '../types/types';
import { RefreshToken as RefreshTokenDB } from '../types/types';

export class RefreshTokenRepositoryKysely implements RefreshTokenRepository {
  constructor(private readonly db: Kysely<DatabaseSchema>) {}

  async save(data: RefreshTokenData): Promise<RefreshToken> {
    const savedToken = await this.db
      .insertInto('refresh_tokens')
      .values({
        token: data.token,
        user_id: data.userId,
        expires_at: data.expiresAt,
        created_at: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.mapToEntity(savedToken);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = await this.db
      .selectFrom('refresh_tokens')
      .selectAll()
      .where('token', '=', token)
      .where('revoked_at', 'is', null)
      .where('expires_at', '>', new Date())
      .executeTakeFirst();

    return refreshToken ? this.mapToEntity(refreshToken) : null;
  }

  async revokeByToken(token: string): Promise<void> {
    await this.db
      .updateTable('refresh_tokens')
      .set({ revoked_at: new Date() })
      .where('token', '=', token)
      .execute();
  }

  async revokeAllByUserId(userId: number): Promise<void> {
    await this.db
      .updateTable('refresh_tokens')
      .set({ revoked_at: new Date() })
      .where('user_id', '=', userId)
      .where('revoked_at', 'is', null)
      .execute();
  }

  async deleteExpired(): Promise<void> {
    await this.db
      .deleteFrom('refresh_tokens')
      .where('expires_at', '<', new Date())
      .execute();
  }

  private mapToEntity(token: RefreshTokenDB): RefreshToken {
    return {
      id: token.id,
      token: token.token,
      userId: token.user_id,
      expiresAt: token.expires_at,
      createdAt: token.created_at,
      revokedAt: token.revoked_at || null,
    };
  }
}
