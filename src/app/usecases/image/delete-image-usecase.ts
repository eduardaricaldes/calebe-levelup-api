import ImageRepository from "@/domain/repositories/image-repository";
import FileStorage from "@/domain/services/file-storage";

export default class DeleteImageUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly fileStorage: FileStorage,
  ) {}

  async execute(id: number, requestingUserId: number, isAdmin: boolean): Promise<void> {
    const image = await this.imageRepository.findById(id);

    if (!image) {
      throw new Error("Image not found");
    }

    // Apenas admin ou o dono da imagem podem deletar
    if (!isAdmin && image.userId !== requestingUserId) {
      throw new Error("You don't have permission to delete this image");
    }

    // Deletar arquivo do disco
    await this.fileStorage.delete(image.fileName);

    // Deletar registro do banco
    await this.imageRepository.delete(id);
  }
}
