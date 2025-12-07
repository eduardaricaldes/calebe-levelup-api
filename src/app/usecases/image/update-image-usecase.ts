import ImageRepository from "@/domain/repositories/image-repository";
import FileStorage from "@/domain/services/file-storage";
import Image from "@/domain/entities/image";

interface UpdateImageInput {
  id: number;
  file: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
  requestingUserId: number;
  isAdmin: boolean;
}

export default class UpdateImageUseCase {
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

  async execute(input: UpdateImageInput): Promise<Image> {
    const existingImage = await this.imageRepository.findById(input.id);

    if (!existingImage) {
      throw new Error("Image not found");
    }

    // Apenas admin ou o dono da imagem podem atualizar
    if (!input.isAdmin && existingImage.userId !== input.requestingUserId) {
      throw new Error("You don't have permission to update this image");
    }

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

    // Deletar arquivo antigo
    await this.fileStorage.delete(existingImage.fileName);

    // Salvar novo arquivo
    const { fileName, url } = await this.fileStorage.save(input.file, input.originalName);

    // Atualizar registro no banco
    const updatedImage = await this.imageRepository.create({
      originalName: input.originalName,
      fileName,
      mimeType: input.mimeType,
      size: input.size,
      url,
      userId: existingImage.userId, // Mantém o userId original
    });

    // Deletar registro antigo
    await this.imageRepository.delete(input.id);

    return updatedImage;
  }
}
