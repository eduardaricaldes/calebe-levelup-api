import CategoryRepository from "@/domain/repositories/category-repository";
import { UpdateCategoryRequestDTO } from "@/app/dto/update-category-requestDTO";

export default class UpdateCategoryUseCase {
  
  constructor(
    private readonly categoryRepository: CategoryRepository,
  ) {}
  
  async execute(id: number, updateCategoryRequestDTO: UpdateCategoryRequestDTO): Promise<void> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new Error('Category not found');
    }

    if (updateCategoryRequestDTO.name) {
      const existingCategory = await this.categoryRepository.findByName(updateCategoryRequestDTO.name);
      
      if (existingCategory && existingCategory.id !== id) {
        throw new Error('Category with this name already exists');
      }
      
      category.name = updateCategoryRequestDTO.name;
    }

    if (updateCategoryRequestDTO.points !== undefined) {
      category.points = updateCategoryRequestDTO.points;
    }

    if (updateCategoryRequestDTO.description !== undefined) {
      category.description = updateCategoryRequestDTO.description || null;
    }

    category.updatedAt = new Date();

    await this.categoryRepository.update(category);
  }
}
