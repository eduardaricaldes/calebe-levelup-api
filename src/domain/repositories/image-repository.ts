import Image from "@/domain/entities/image";

export interface CreateImageDTO {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  userId: number;
}

export default interface ImageRepository {
  create(data: CreateImageDTO): Promise<Image>;
  findById(id: number): Promise<Image | null>;
  findByFileName(fileName: string): Promise<Image | null>;
  findByUserId(userId: number): Promise<Image[]>;
  delete(id: number): Promise<void>;
}
