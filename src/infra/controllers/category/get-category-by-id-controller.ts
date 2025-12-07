import GetCategoryByIdUseCase from "@/app/usecases/category/get-category-by-id-usecase";
import { Request, Response } from "express";

export class GetCategoryByIdController {
  constructor(private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;

      if (!id) {
        return response.status(400).json({ message: 'Category ID is required' });
      }

      const category = await this.getCategoryByIdUseCase.execute(parseInt(id));

      return response.status(200).json(category);
    } catch (error: any) {
      if (error.message === 'Category not found') {
        return response.status(404).json({ message: error.message });
      }

      return response.status(500).json({ message: error.message });
    }
  }
}
