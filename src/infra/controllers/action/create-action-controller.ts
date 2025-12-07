import CreateActionUseCase from "@/app/usecases/action/create-action-usecase";
import { Request, Response } from "express";

export class CreateActionController {
  constructor(private readonly createActionUseCase: CreateActionUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { name, date, description, categoryId } = request.body;

      if (!name || !date || !categoryId) {
        return response.status(400).json({ message: 'Name, date and categoryId are required' });
      }

      const result = await this.createActionUseCase.execute({
        name,
        date: new Date(date),
        description,
        categoryId: parseInt(categoryId),
      });

      return response.status(201).json(result);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }
}
