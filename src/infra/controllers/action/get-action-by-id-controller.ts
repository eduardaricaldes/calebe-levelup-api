import GetActionByIdUseCase from "@/app/usecases/action/get-action-by-id-usecase";
import { Request, Response } from "express";

export class GetActionByIdController {
  constructor(private readonly getActionByIdUseCase: GetActionByIdUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;

      if (!id) {
        return response.status(400).json({ message: 'Action ID is required' });
      }

      const action = await this.getActionByIdUseCase.execute(id);

      return response.status(200).json(action);
    } catch (error: any) {
      if (error.message === 'Action not found') {
        return response.status(404).json({ message: error.message });
      }

      return response.status(500).json({ message: error.message });
    }
  }
}
