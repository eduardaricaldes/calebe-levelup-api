import ImageRepository from "@/domain/repositories/image-repository";
import FileStorage from "@/domain/services/file-storage";
import Image from "@/domain/entities/image";

interface UploadImageInput {
  file: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
  userId: number;
}

export default class UploadImageUseCase {
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly fileStorage: FileStorage,
  ) {}

  async execute(input: UploadImageInput): Promise<Image> {
    // Validar tamanho do arquivo
    if (input.size > this.maxFileSize) {
      throw new Error("File size exceeds maximum allowed (5MB)");
    }

    // Validar tipo MIME
    if (!this.allowedMimeTypes.includes(input.mimeType)) {
      throw new Error("Invalid file type. Only images are allowed (jpeg, jpg, png, gif, webp)");
    }

    // Validar que o arquivo não está vazio
    if (input.size === 0 || input.file.length === 0) {
      throw new Error("File is empty");
    }

    // Salvar arquivo no disco
    const { fileName, url } = await this.fileStorage.save(input.file, input.originalName);

    // Salvar registro no banco de dados
    const image = await this.imageRepository.create({
      originalName: input.originalName,
      fileName,
      mimeType: input.mimeType,
      size: input.size,
      url,
      userId: input.userId,
    });

    return image;
  }
}
