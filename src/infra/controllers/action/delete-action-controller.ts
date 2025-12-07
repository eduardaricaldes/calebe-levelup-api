import DeleteActionUseCase from "@/app/usecases/action/delete-action-usecase";
import { Request, Response } from "express";

export class DeleteActionController {
  constructor(private readonly deleteActionUseCase: DeleteActionUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;

      if (!id) {
        return response.status(400).json({ message: 'Action ID is required' });
      }

      await this.deleteActionUseCase.execute(parseInt(id));

      return response.status(200).json({ message: 'Action deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Action not found') {
        return response.status(404).json({ message: error.message });
      }

      return response.status(500).json({ message: error.message });
    }
  }
}
