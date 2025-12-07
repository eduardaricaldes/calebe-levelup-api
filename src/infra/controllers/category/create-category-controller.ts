import CreateCategoryUseCase from "@/app/usecases/category/create-category-usecase";
import { Request, Response } from "express";

export class CreateCategoryController {
  constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { name, points, description } = request.body;

      if (!name || points === undefined) {
        return response.status(400).json({ message: 'Name and points are required' });
      }

      const category = await this.createCategoryUseCase.execute({
        name,
        points: parseInt(points),
        description,
      });

      return response.status(201).json(category);
    } catch (error: any) {
      if (error.message === 'Category with this name already exists') {
        return response.status(400).json({ message: error.message });
      }

      return response.status(500).json({ message: error.message });
    }
  }
}
