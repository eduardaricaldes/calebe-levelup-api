import { Kysely, Selectable } from 'kysely';
import Challenge from "@/domain/entities/challenge";
import ChallengeRepository, { CreateChallengeDTO } from "@/domain/repositories/challenge-repository";
import { DB as DatabaseSchema } from '../types/types';
import { Challenge as ChallengeDB } from '../types/types';

export default class ChallengeRepositoryKysely implements ChallengeRepository {
  constructor(private readonly db: Kysely<DatabaseSchema>) {}

  async create(data: CreateChallengeDTO): Promise<Challenge> {
    return await this.db.transaction().execute(async (trx) => {
      const challenge = await trx
        .insertInto('challenge')
        .values({
          name: data.name,
          date: data.date,
          description: data.description || null,
          category_id: data.categoryId,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      return this.mapToEntity(challenge);
    });
  }

  async findById(id: number): Promise<Challenge | null> {
    const challenge = await this.db
      .selectFrom('challenge')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return challenge ? this.mapToEntity(challenge) : null;
  }

  async findAll(): Promise<Challenge[]> {
    const challenges = await this.db
      .selectFrom('challenge')
      .selectAll()
      .orderBy('date', 'desc')
      .execute();

    return challenges.map(challenge => this.mapToEntity(challenge));
  }

  async findByFilter(filter: Partial<CreateChallengeDTO>): Promise<Challenge[]> {
    let query = this.db.selectFrom('challenge').selectAll();

    if (filter.name) {
      query = query.where('name', 'ilike', `%${filter.name}%`);
    }

    if (filter.categoryId) {
      query = query.where('category_id', '=', filter.categoryId);
    }

    if (filter.date) {
      query = query.where('date', '=', filter.date);
    }

    const challenges = await query.orderBy('date', 'desc').execute();

    return challenges.map(challenge => this.mapToEntity(challenge));
  }

  async findByCategoryId(categoryId: number): Promise<Challenge[]> {
    const challenges = await this.db
      .selectFrom('challenge')
      .selectAll()
      .where('category_id', '=', categoryId)
      .orderBy('date', 'desc')
      .execute();

    return challenges.map(challenge => this.mapToEntity(challenge));
  }

  async findChallengesByUserID(userId: number): Promise<Challenge[]> {
    const challenges = await this.db
      .selectFrom('challenge')
      .innerJoin('user_activities', 'user_activities.challenge_id', 'challenge.id')
      .selectAll('challenge')
      .where('user_activities.user_id', '=', userId)
      .orderBy('challenge.date', 'desc')
      .execute();

    return challenges.map(challenge => this.mapToEntity(challenge));
  }

  async update(challenge: Challenge): Promise<Challenge> {
    return await this.db.transaction().execute(async (trx) => {
      const updatedChallenge = await trx
        .updateTable('challenge')
        .set({
          name: challenge.name,
          date: challenge.date,
          description: challenge.description,
          category_id: challenge.categoryId,
          updated_at: challenge.updatedAt,
        })
        .where('id', '=', challenge.id!)
        .returningAll()
        .executeTakeFirstOrThrow();

      return this.mapToEntity(updatedChallenge);
    });
  }

  async delete(id: number): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom('challenge')
        .where('id', '=', id)
        .execute();
    });
  }

  private mapToEntity(challenge: Selectable<ChallengeDB>): Challenge {
    const entity = new Challenge(
      challenge.name,
      challenge.date,
      challenge.description,
      challenge.category_id,
      new Date(challenge.created_at),
      new Date(challenge.updated_at)
    );
    entity.id = challenge.id;
    return entity;
  }
}
