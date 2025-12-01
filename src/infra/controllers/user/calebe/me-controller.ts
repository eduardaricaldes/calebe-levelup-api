import MeUseCase from "@/app/usecases/user/calebe/me-usecase";
import { Request, Response } from "express";

export type MeControllerRequest = Request & { user?: { externalId: string } };

export class MeController {
  constructor(private readonly meUseCase: MeUseCase) {}  

  async handle(request: MeControllerRequest, response: Response): Promise<Response> {
    try {
      const externalId = request.user?.externalId;

      if (!externalId) {
        return response.status(401).json({ message: 'Unauthorized' });
      }

      const user = await this.meUseCase.execute(externalId);

      return response.status(200).json(user);
    } catch (error: any) {
      if (error.message === 'User not found') {
        return response.status(404).json({ message: error.message });
      }

      return response.status(500).json({ message: error.message });
    }
  }
}
