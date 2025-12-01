import UpdateUserStatusUseCase from "@/app/usecases/user/admin/update-user-status-usecase";
import { Request, Response } from "express";

export class UpdateUserStatusController {
  constructor(private readonly updateUserStatusUseCase: UpdateUserStatusUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { externalId } = request.params;
      const { status } = request.body;

      if (!externalId) {
        return response.status(400).json({ message: 'External ID is required' });
      }

      if (!status) {
        return response.status(400).json({ message: 'Status is required' });
      }

      await this.updateUserStatusUseCase.execute({ externalId, status });

      return response.status(200).json({ message: 'User status updated successfully' });
    } catch (error: any) {
      if (error.message === 'User not found') {
        return response.status(404).json({ message: error.message });
      }

      if (error.message === 'Invalid status') {
        return response.status(400).json({ message: error.message });
      }

      return response.status(500).json({ message: error.message });
    }
  }
}
