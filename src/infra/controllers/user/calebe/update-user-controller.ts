import UpdateUserUseCase from "@/app/usecases/user/calebe/update-user-usecase";
import { Request, Response } from "express";

export type UpdateUserControllerRequest = Request & { user?: { externalId: string } };

export class UpdateUserController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}  

  async handle(request: UpdateUserControllerRequest, response: Response): Promise<Response> {
    try {
      const externalId = request.user?.externalId;

      if (!externalId) {
        return response.status(401).json({ message: 'Unauthorized' });
      }

      const { name, email } = request.body;

      const user = await this.updateUserUseCase.execute(externalId, { name, email });

      return response.status(200).json(user);
    } catch (error: any) {
      if (error.message === 'User not found') {
        return response.status(404).json({ message: error.message });
      }

      if (error.message === 'Email already in use') {
        return response.status(400).json({ message: error.message });
      }

      return response.status(500).json({ message: error.message });
    }
  }
}
