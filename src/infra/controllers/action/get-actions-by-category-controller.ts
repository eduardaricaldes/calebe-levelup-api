import GetActionsByCategoryUseCase from "@/app/usecases/action/get-actions-by-category-usecase";
import { Request, Response } from "express";

export class GetActionsByCategoryController {
  constructor(private readonly getActionsByCategoryUseCase: GetActionsByCategoryUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { categoryId } = request.params;

      if (!categoryId) {
        return response.status(400).json({ message: 'Category ID is required' });
      }

      const result = await this.getActionsByCategoryUseCase.execute(categoryId);

      return response.status(200).json(result);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }
}
