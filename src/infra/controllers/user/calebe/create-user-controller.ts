import CreateUserUseCase from "@/app/usecases/user/calebe/create-user-usecase";
import { Request, Response } from "express";

export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password } = request.body;

      const user = await this.createUserUseCase.execute({ name, email, password });

      return response.status(201).json(user);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }
}