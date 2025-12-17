import LogoutUseCase from "@/app/usecases/user/calebe/logout-usecase";
import { Request, Response } from "express";

export class LogoutController {
  constructor(private readonly logoutUseCase: LogoutUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      // O userId vem do middleware de autenticação
      const userId = request.user?.id;

      if (!userId) {
        return response.status(401).json({ message: 'Unauthorized' });
      }

      await this.logoutUseCase.execute({ userId });

      return response.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }
}
