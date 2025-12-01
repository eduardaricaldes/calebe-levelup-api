import GetUserByExternalIdUseCase from "@/app/usecases/user/admin/get-user-by-external-id-usecase";
import { Request, Response } from "express";

export class GetUserByExternalIdController {
  constructor(private readonly getUserByExternalIdUseCase: GetUserByExternalIdUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { externalId } = request.params;

      if (!externalId) {
        return response.status(400).json({ message: 'External ID is required' });
      }

      const user = await this.getUserByExternalIdUseCase.execute(externalId);

      return response.status(200).json(user);
    } catch (error: any) {
      if (error.message === 'User not found') {
        return response.status(404).json({ message: error.message });
      }

      return response.status(500).json({ message: error.message });
    }
  }
}
