import UpdatePasswordUseCase from "@/app/usecases/user/calebe/update-password-usecase";
import { Request, Response } from "express";

export type UpdatePasswordControllerRequest = Request & { user?: { externalId: string } };

export class UpdatePasswordController {
  constructor(private readonly updatePasswordUseCase: UpdatePasswordUseCase) {}  

  async handle(request: UpdatePasswordControllerRequest, response: Response): Promise<Response> {
    try {
      const externalId = request.user?.externalId;

      if (!externalId) {
        return response.status(401).json({ message: 'Unauthorized' });
      }

      const { currentPassword, newPassword } = request.body;

      if (!currentPassword || !newPassword) {
        return response.status(400).json({ message: 'Current password and new password are required' });
      }

      await this.updatePasswordUseCase.execute({
        externalId,
        currentPassword,
        newPassword,
      });

      return response.status(200).json({ message: 'Password updated successfully' });
    } catch (error: any) {
      if (error.message === 'User not found') {
        return response.status(404).json({ message: error.message });
      }

      if (error.message === 'Current password is incorrect') {
        return response.status(400).json({ message: error.message });
      }

      if (error.message === 'New password must be at least 6 characters long') {
        return response.status(400).json({ message: error.message });
      }

      return response.status(500).json({ message: error.message });
    }
  }
}
