import CategoryRepository from "@/domain/repositories/category-repository";
import { ListCategoriesResponseDTO } from "@/app/dto/list-categories-responseDTO";

export default class ListCategoriesUseCase {
  
  constructor(
    private readonly categoryRepository: CategoryRepository,
  ) {}
  
  async execute(): Promise<ListCategoriesResponseDTO> {
    const categories = await this.categoryRepository.findAll();

    return {
      categories: categories.map(category => ({
        id: category.id!,
        name: category.name,
        points: category.points,
        description: category.description,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      })),
    };
  }
}
