import GetActionsByUserUseCase from "@/app/usecases/action/get-actions-by-user-usecase";
import { Request, Response } from "express";

export class GetActionsByUserController {
  constructor(private readonly getActionsByUserUseCase: GetActionsByUserUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { userId } = request.params;

      if (!userId) {
        return response.status(400).json({ message: 'User ID is required' });
      }

      const result = await this.getActionsByUserUseCase.execute(parseInt(userId));

      return response.status(200).json(result);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }
}
