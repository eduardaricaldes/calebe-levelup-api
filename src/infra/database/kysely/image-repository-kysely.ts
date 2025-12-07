import { Kysely, Selectable } from 'kysely';
import Image from "@/domain/entities/image";
import ImageRepository, { CreateImageDTO } from "@/domain/repositories/image-repository";
import { DB as DatabaseSchema } from '../types/types';
import { Image as ImageDB } from '../types/types';

export default class ImageRepositoryKysely implements ImageRepository {
  constructor(private readonly db: Kysely<DatabaseSchema>) {}

  async create(data: CreateImageDTO): Promise<Image> {
    return await this.db.transaction().execute(async (trx) => {
      const image = await trx
        .insertInto('images')
        .values({
          original_name: data.originalName,
          file_name: data.fileName,
          mime_type: data.mimeType,
          size: data.size,
          url: data.url,
          user_id: data.userId,
          created_at: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      return this.mapToEntity(image);
    });
  }

  async findById(id: number): Promise<Image | null> {
    const image = await this.db
      .selectFrom('images')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return image ? this.mapToEntity(image) : null;
  }

  async findByFileName(fileName: string): Promise<Image | null> {
    const image = await this.db
      .selectFrom('images')
      .selectAll()
      .where('file_name', '=', fileName)
      .executeTakeFirst();

    return image ? this.mapToEntity(image) : null;
  }

  async findByUserId(userId: number): Promise<Image[]> {
    const images = await this.db
      .selectFrom('images')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('created_at', 'desc')
      .execute();

    return images.map(image => this.mapToEntity(image));
  }

  async delete(id: number): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom('images')
        .where('id', '=', id)
        .execute();
    });
  }

  private mapToEntity(image: Selectable<ImageDB>): Image {
    const entity = new Image(
      image.original_name,
      image.file_name,
      image.mime_type,
      image.size,
      image.url,
      image.user_id,
      new Date(image.created_at)
    );
    entity.id = image.id;
    return entity;
  }
}
