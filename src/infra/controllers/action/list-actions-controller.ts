import ListActionsUseCase from "@/app/usecases/action/list-actions-usecase";
import { Request, Response } from "express";

export class ListActionsController {
  constructor(private readonly listActionsUseCase: ListActionsUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { categoryId, name, date } = request.query;

      const filters: any = {};

      if (categoryId) {
        filters.categoryId = parseInt(categoryId as string);
      }

      if (name) {
        filters.name = name as string;
      }

      if (date) {
        filters.date = new Date(date as string);
      }

      const result = await this.listActionsUseCase.execute(
        Object.keys(filters).length > 0 ? filters : undefined
      );

      return response.status(200).json(result);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }
}
