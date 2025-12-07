import { Kysely, Selectable } from 'kysely';
import Category from "@/domain/entities/category";
import CategoryRepository, { CreateCategoryDTO } from "@/domain/repositories/category-repository";
import { DB as DatabaseSchema } from '../types/types';
import { Category as CategoryDB } from '../types/types';

export default class CategoryRepositoryKysely implements CategoryRepository {
  constructor(private readonly db: Kysely<DatabaseSchema>) {}

  async create(data: CreateCategoryDTO): Promise<Category> {
    return await this.db.transaction().execute(async (trx) => {
      const category = await trx
        .insertInto('category')
        .values({
          name: data.name,
          points: data.points,
          description: data.description || null,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      return this.mapToEntity(category);
    });
  }

  async findById(id: number): Promise<Category | null> {
    const category = await this.db
      .selectFrom('category')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return category ? this.mapToEntity(category) : null;
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this.db
      .selectFrom('category')
      .selectAll()
      .where('name', 'ilike', name)
      .executeTakeFirst();

    return category ? this.mapToEntity(category) : null;
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.db
      .selectFrom('category')
      .selectAll()
      .orderBy('name', 'asc')
      .execute();

    return categories.map(category => this.mapToEntity(category));
  }

  async update(category: Category): Promise<Category> {
    return await this.db.transaction().execute(async (trx) => {
      const updatedCategory = await trx
        .updateTable('category')
        .set({
          name: category.name,
          points: category.points,
          description: category.description,
          updated_at: category.updatedAt,
        })
        .where('id', '=', category.id!)
        .returningAll()
        .executeTakeFirstOrThrow();

      return this.mapToEntity(updatedCategory);
    });
  }

  async delete(id: number): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom('category')
        .where('id', '=', id)
        .execute();
    });
  }

  private mapToEntity(category: Selectable<CategoryDB>): Category {
    const entity = new Category(
      category.name,
      category.points,
      category.description,
      new Date(category.created_at),
      new Date(category.updated_at)
    );
    entity.id = category.id;
    return entity;
  }
}
