import Action from "@/domain/entities/action";
import { Kysely, Selectable } from "kysely";
import { DB as DatabaseSchema } from '../types/types';
import ActionRepository, { ActionDTO } from "@/domain/repositories/action-repository";
import { Action as ActionDB } from '../types/types';

export default class ActionRepositoryKysely implements ActionRepository {
  constructor(private readonly db: Kysely<DatabaseSchema>) {}

  async create(action: ActionDTO): Promise<void> {
    if (!action.categoryId) {
      throw new Error('Category ID is required');
    }

    await this.db.transaction().execute(async (trx) => {
      await trx
        .insertInto('action')
        .values({
          name: action.name,
          date: action.date,
          description: action.description || null,
          category_id: action.categoryId!,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .execute();
    });
  }

  async findById(id: string): Promise<Action | null> {
    const action = await this.db
      .selectFrom('action')
      .selectAll()
      .where('id', '=', parseInt(id))
      .executeTakeFirst();

    if (!action) {
      return null;
    }

    return {
      id: action.id,
      name: action.name,
      date: action.date,
      description: action.description || "",
      categoryId: action.category_id,
      created_at: action.created_at,
      updated_at: action.updated_at,
    };
  }

  async update(action: Action): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      await trx
        .updateTable('action')
        .set({
          name: action.name,
          date: action.date,
          description: action.description || null,
          category_id: action.categoryId,
          updated_at: new Date(),
        })
        .where('id', '=', action.id)
        .execute();
    });
  }

  async delete(id: number): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom('action')
        .where('id', '=', id)
        .execute();
    });
  }

  async findAll(): Promise<Action[] | null> {
    const actions = await this.db
      .selectFrom('action')
      .selectAll()
      .orderBy('created_at', 'desc')
      .execute();
    
      if (actions.length === 0) {
      return null;
    }

    return actions.map(action => ({
      id: action.id,
      name: action.name,
      date: action.date,
      description: action.description || "",
      categoryId: action.category_id,
      created_at: action.created_at,
      updated_at: action.updated_at,
    }));
  }

  async findByFilter(filter: Partial<ActionDTO>): Promise<Action[] | null> {
    let query = this.db.selectFrom('action').selectAll();

    if (filter.name) {
      query = query.where('name', 'ilike', `%${filter.name}%`);
    }

    if (filter.categoryId) {
      query = query.where('category_id', '=', filter.categoryId);
    }

    if (filter.date) {
      query = query.where('date', '=', filter.date);
    }

    const actions = await query.execute();

    if (actions.length === 0) {
      return null;
    }

    return actions.map(action => this.mapToEntity(action));
  }

  async findByCategoryId(categoryId: string): Promise<Action[] | null> {
    const actions = await this.db
      .selectFrom('action')
      .selectAll()
      .where('category_id', '=', parseInt(categoryId))
      .orderBy('date', 'desc')
      .execute();

    if (actions.length === 0) {
      return null;
    }

    return actions.map(action => this.mapToEntity(action));
  }

  async findActionByUserID(userId: number): Promise<Action | null> {
    const action = await this.db
      .selectFrom('action')
      .innerJoin('user_activities', 'user_activities.action_id', 'action.id')
      .selectAll('action')
      .where('user_activities.user_id', '=', userId)
      .executeTakeFirst();

    if (!action) {
      return null;
    }

    return this.mapToEntity(action);
  }

  async findActionsByUserID(userId: number): Promise<Action[] | null> {
    const actions = await this.db
      .selectFrom('action')
      .innerJoin('user_activities', 'user_activities.action_id', 'action.id')
      .selectAll('action')
      .where('user_activities.user_id', '=', userId)
      .orderBy('action.date', 'desc')
      .execute();

    if (actions.length === 0) {
      return null;
    }

    return actions.map(action => this.mapToEntity(action));
  }

  private mapToEntity(action: Selectable<ActionDB>): Action {
    const entity = new Action(
      action.name,
      action.date,
      action.description,
      action.category_id,
      new Date(action.created_at),
      new Date(action.updated_at)
    );
    entity.id = action.id;
    return entity;
  }
}