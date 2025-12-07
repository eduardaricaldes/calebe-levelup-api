import DeleteCategoryUseCase from "@/app/usecases/category/delete-category-usecase";
import { Request, Response } from "express";

export class DeleteCategoryController {
  constructor(private readonly deleteCategoryUseCase: DeleteCategoryUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;

      if (!id) {
        return response.status(400).json({ message: 'Category ID is required' });
      }

      await this.deleteCategoryUseCase.execute(parseInt(id));

      return response.status(200).json({ message: 'Category deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Category not found') {
        return response.status(404).json({ message: error.message });
      }

      return response.status(500).json({ message: error.message });
    }
  }
}
