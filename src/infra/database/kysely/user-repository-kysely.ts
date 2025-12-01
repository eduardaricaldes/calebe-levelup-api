import { Kysely, Selectable } from 'kysely';
import User, { UserRole, UserStatus } from "@/domain/entities/user";
import UserRepository, { CreateUserDTO, ListUsersFilters, PaginatedResult } from "@/domain/repositories/user-repository";
import { DB as DatabaseSchema } from '../types/types';
import { User as UserDB } from '../types/types';
import { randomUUID } from 'crypto';

export class UserRepositoryKysely implements UserRepository {
  constructor(private readonly db: Kysely<DatabaseSchema>) {}

  async findById(id: number): Promise<User | null> {
    const user = await this.db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return user ? this.mapToEntity(user) : null;
  }

  async findByExternalId(externalId: string): Promise<User | null> {
    const user = await this.db
      .selectFrom('users')
      .selectAll()
      .where('external_id', '=', externalId)
      .executeTakeFirst();

    return user ? this.mapToEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    return user ? this.mapToEntity(user) : null;
  }

  async create(data: CreateUserDTO): Promise<User> {
    return await this.db.transaction().execute(async (trx) => {
      const externalId = randomUUID();

      const user = await trx
        .insertInto('users')
        .values({
          external_id: externalId,
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role as any,
          status: data.status as any,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      return this.mapToEntity(user);
    });
  }

  async update(user: User): Promise<User> {
    return await this.db.transaction().execute(async (trx) => {
      const updatedUser = await trx
        .updateTable('users')
        .set({
          name: user.name,
          email: user.email,
          password: user.password,
          status: user.status as any,
          role: user.role as any,
          updated_at: user.updatedAt,
        })
        .where('external_id', '=', user.externalId)
        .returningAll()
        .executeTakeFirstOrThrow();

      return this.mapToEntity(updatedUser);
    });
  }

  async delete(id: number): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom('users')
        .where('id', '=', id)
        .execute();
    });
  }

  async deleteByExternalId(externalId: string): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom('users')
        .where('external_id', '=', externalId)
        .execute();
    });
  }

  async confirmUser(id: number): Promise<User> {
    const user = await this.db
      .updateTable('users')
      .set({
        status: UserStatus.ACTIVE as any,
        updated_at: new Date(),
      })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.mapToEntity(user);
  }

  async list(page: number, limit: number, filters?: ListUsersFilters): Promise<PaginatedResult<User>> {
    let query = this.db.selectFrom('users').selectAll();


    if (filters?.status) {
      query = query.where('status', '=', filters.status as any);
    }

    if (filters?.role) {
      query = query.where('role', '=', filters.role as any);
    }

    if (filters?.search) {
      query = query.where((eb) =>
        eb.or([
          eb('name', 'ilike', `%${filters.search}%`),
          eb('email', 'ilike', `%${filters.search}%`),
        ])
      );
    }


    const countQuery = query;
    const totalResult = await this.db
      .selectFrom(countQuery.as('subquery'))
      .select((eb) => eb.fn.countAll().as('count'))
      .executeTakeFirst();

    const total = Number(totalResult?.count || 0);


    const offset = (page - 1) * limit;
    const users = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset)
      .execute();

    return {
      data: users.map(user => this.mapToEntity(user)),
      total,
      page,
      limit,
    };
  }

  private mapToEntity(user: Selectable<UserDB>): User {
    const entity = new User(
      user.external_id || '',
      user.name,
      user.email,
      user.password,
      user.role as UserRole,
      user.status as UserStatus,
      new Date(user.created_at),
      new Date(user.updated_at)
    );
    entity.id = user.id;
    return entity;
  }
}