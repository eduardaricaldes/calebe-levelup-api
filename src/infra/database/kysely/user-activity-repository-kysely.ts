import { Kysely, Selectable } from 'kysely';
import UserActivity, { UserActivityStatus } from "@/domain/entities/user-activity";
import UserActivityRepository, { CreateUserActivityDTO, UpdateUserActivityStatusDTO } from "@/domain/repositories/user-activity-repository";
import { DB as DatabaseSchema } from '../types/types';
import { UserActivity as UserActivityDB } from '../types/types';
import { UserActivityStatus as UserActivityStatusDB } from '../types/enums';

export default class UserActivityRepositoryKysely implements UserActivityRepository {
  constructor(private readonly db: Kysely<DatabaseSchema>) {}

  async create(data: CreateUserActivityDTO): Promise<UserActivity> {
    return await this.db.transaction().execute(async (trx) => {
      const userActivity = await trx
        .insertInto('user_activities')
        .values({
          user_id: data.userId,
          action_id: data.actionId || null,
          challenge_id: data.challengeId || null,
          photo_url: data.photoUrl || null,
          status: UserActivityStatusDB.PENDING,
          approver_id: null,
          approved_at: null,
          repproved_description: null,
          date: data.date,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      return this.mapToEntity(userActivity);
    });
  }

  async findById(id: number): Promise<UserActivity | null> {
    const userActivity = await this.db
      .selectFrom('user_activities')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return userActivity ? this.mapToEntity(userActivity) : null;
  }

  async findAll(): Promise<UserActivity[]> {
    const userActivities = await this.db
      .selectFrom('user_activities')
      .selectAll()
      .orderBy('date', 'desc')
      .execute();

    return userActivities.map(userActivity => this.mapToEntity(userActivity));
  }

  async findByUserId(userId: number): Promise<UserActivity[]> {
    const userActivities = await this.db
      .selectFrom('user_activities')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('date', 'desc')
      .execute();

    return userActivities.map(userActivity => this.mapToEntity(userActivity));
  }

  async findByStatus(status: UserActivityStatus): Promise<UserActivity[]> {
    const dbStatus = this.mapStatusToDb(status);
    
    const userActivities = await this.db
      .selectFrom('user_activities')
      .selectAll()
      .where('status', '=', dbStatus)
      .orderBy('date', 'desc')
      .execute();

    return userActivities.map(userActivity => this.mapToEntity(userActivity));
  }

  async findPendingActivities(): Promise<UserActivity[]> {
    return this.findByStatus(UserActivityStatus.PENDING);
  }

  async updateStatus(data: UpdateUserActivityStatusDTO): Promise<UserActivity> {
    return await this.db.transaction().execute(async (trx) => {
      const dbStatus = this.mapStatusToDb(data.status);
      
      const updateData: any = {
        status: dbStatus,
        approver_id: data.approverId,
        approved_at: new Date(),
        updated_at: new Date(),
      };

      if (data.status === UserActivityStatus.REJECTED && data.repprovedDescription) {
        updateData.repproved_description = data.repprovedDescription;
      }

      const userActivity = await trx
        .updateTable('user_activities')
        .set(updateData)
        .where('id', '=', data.id)
        .returningAll()
        .executeTakeFirstOrThrow();

      return this.mapToEntity(userActivity);
    });
  }

  async update(userActivity: UserActivity): Promise<UserActivity> {
    return await this.db.transaction().execute(async (trx) => {
      const dbStatus = this.mapStatusToDb(userActivity.status);
      
      const updatedUserActivity = await trx
        .updateTable('user_activities')
        .set({
          user_id: userActivity.userId,
          action_id: userActivity.actionId,
          challenge_id: userActivity.challengeId,
          photo_url: userActivity.photoUrl,
          status: dbStatus,
          approver_id: userActivity.approverId,
          approved_at: userActivity.approvedAt,
          repproved_description: userActivity.repprovedDescription,
          date: userActivity.date,
          updated_at: userActivity.updatedAt,
        })
        .where('id', '=', userActivity.id!)
        .returningAll()
        .executeTakeFirstOrThrow();

      return this.mapToEntity(updatedUserActivity);
    });
  }

  async delete(id: number): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom('user_activities')
        .where('id', '=', id)
        .execute();
    });
  }

  private mapToEntity(userActivity: Selectable<UserActivityDB>): UserActivity {
    const entity = new UserActivity(
      userActivity.user_id,
      userActivity.action_id,
      userActivity.challenge_id,
      userActivity.photo_url,
      new Date(userActivity.date),
      new Date(userActivity.created_at),
      new Date(userActivity.updated_at)
    );
    
    entity.id = userActivity.id;
    entity.status = this.mapStatusFromDb(userActivity.status);
    entity.approverId = userActivity.approver_id;
    entity.approvedAt = userActivity.approved_at ? new Date(userActivity.approved_at) : null;
    entity.repprovedDescription = userActivity.repproved_description;
    
    return entity;
  }

  private mapStatusToDb(status: UserActivityStatus): UserActivityStatusDB {
    switch (status) {
      case UserActivityStatus.PENDING:
        return UserActivityStatusDB.PENDING;
      case UserActivityStatus.APPROVED:
        return UserActivityStatusDB.APPROVED;
      case UserActivityStatus.REJECTED:
        return UserActivityStatusDB.REJECTED;
      default:
        return UserActivityStatusDB.PENDING;
    }
  }

  private mapStatusFromDb(status: UserActivityStatusDB): UserActivityStatus {
    switch (status) {
      case UserActivityStatusDB.PENDING:
        return UserActivityStatus.PENDING;
      case UserActivityStatusDB.APPROVED:
        return UserActivityStatus.APPROVED;
      case UserActivityStatusDB.REJECTED:
        return UserActivityStatus.REJECTED;
      default:
        return UserActivityStatus.PENDING;
    }
  }
}
