import CreateAdminUseCase from "@/app/usecases/user/admin/create-admin-usecase";
import { Request, Response } from "express";

export class CreateAdminController {
  constructor(private readonly createAdminUseCase: CreateAdminUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password } = request.body;

      if (!name || !email || !password) {
        return response.status(400).json({ message: 'Name, email and password are required' });
      }

      const user = await this.createAdminUseCase.execute({ name, email, password });

      return response.status(201).json(user);
    } catch (error: any) {
      if (error.message === 'Email already in use') {
        return response.status(400).json({ message: error.message });
      }

      return response.status(500).json({ message: error.message });
    }
  }
}
