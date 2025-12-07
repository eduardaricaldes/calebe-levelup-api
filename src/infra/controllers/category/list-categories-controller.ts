import ListCategoriesUseCase from "@/app/usecases/category/list-categories-usecase";
import { Request, Response } from "express";

export class ListCategoriesController {
  constructor(private readonly listCategoriesUseCase: ListCategoriesUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const result = await this.listCategoriesUseCase.execute();

      return response.status(200).json(result);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }
}
