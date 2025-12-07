import UpdateCategoryUseCase from "@/app/usecases/category/update-category-usecase";
import { Request, Response } from "express";

export class UpdateCategoryController {
  constructor(private readonly updateCategoryUseCase: UpdateCategoryUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;
      const { name, points, description } = request.body;

      if (!id) {
        return response.status(400).json({ message: 'Category ID is required' });
      }

      const updateData: any = {};

      if (name) updateData.name = name;
      if (points !== undefined) updateData.points = parseInt(points);
      if (description !== undefined) updateData.description = description;

      await this.updateCategoryUseCase.execute(parseInt(id), updateData);

      return response.status(200).json({ message: 'Category updated successfully' });
    } catch (error: any) {
      if (error.message === 'Category not found') {
        return response.status(404).json({ message: error.message });
      }

      if (error.message === 'Category with this name already exists') {
        return response.status(400).json({ message: error.message });
      }

      return response.status(500).json({ message: error.message });
    }
  }
}
