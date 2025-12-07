import ImageRepository from "@/domain/repositories/image-repository";
import Image from "@/domain/entities/image";

export default class GetImageByIdUseCase {
  constructor(private readonly imageRepository: ImageRepository) {}

  async execute(id: number, requestingUserId: number, isAdmin: boolean): Promise<Image> {
    const image = await this.imageRepository.findById(id);

    if (!image) {
      throw new Error("Image not found");
    }

    // Apenas admin ou o dono da imagem podem visualizar detalhes completos
    if (!isAdmin && image.userId !== requestingUserId) {
      throw new Error("You don't have permission to access this image");
    }

    return image;
  }
}
