import CategoryRepository from "@/domain/repositories/category-repository";
import { CreateCategoryRequestDTO } from "@/app/dto/create-category-requestDTO";
import { CreateCategoryResponseDTO } from "@/app/dto/create-category-responseDTO";

export default class CreateCategoryUseCase {
  
  constructor(
    private readonly categoryRepository: CategoryRepository,
  ) {}
  
  async execute(createCategoryRequestDTO: CreateCategoryRequestDTO): Promise<CreateCategoryResponseDTO> {
    const existingCategory = await this.categoryRepository.findByName(createCategoryRequestDTO.name);

    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    const category = await this.categoryRepository.create({
      name: createCategoryRequestDTO.name,
      points: createCategoryRequestDTO.points,
      description: createCategoryRequestDTO.description,
    });

    return {
      id: category.id!,
      name: category.name,
      points: category.points,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
