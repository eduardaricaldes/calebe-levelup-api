import ListUsersUseCase from "@/app/usecases/user/admin/list-users-usecase";
import { Request, Response } from "express";

export class ListUsersController {
  constructor(private readonly listUsersUseCase: ListUsersUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { page, limit, status, role, search } = request.query;

      const result = await this.listUsersUseCase.execute({
        page: page ? parseInt(page as string): 1,
        limit: limit ? parseInt(limit as string): 10,
        status: status as string,
        role: role as string,
        search: search as string,
      });

      return response.status(200).json(result);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }
}
