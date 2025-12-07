import CategoryRepository from "@/domain/repositories/category-repository";
import { GetCategoryResponseDTO } from "@/app/dto/get-category-responseDTO";

export default class GetCategoryByIdUseCase {
  
  constructor(
    private readonly categoryRepository: CategoryRepository,
  ) {}
  
  async execute(id: number): Promise<GetCategoryResponseDTO> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new Error('Category not found');
    }

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
