import DeleteUserUseCase from "@/app/usecases/user/admin/delete-user-usecase";
import { Request, Response } from "express";

export class DeleteUserController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { externalId } = request.params;

      if (!externalId) {
        return response.status(400).json({ message: 'External ID is required' });
      }

      await this.deleteUserUseCase.execute(externalId);

      return response.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
      if (error.message === 'User not found') {
        return response.status(404).json({ message: error.message });
      }

      return response.status(500).json({ message: error.message });
    }
  }
}
