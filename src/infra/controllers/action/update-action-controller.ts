import UpdateActionUseCase from "@/app/usecases/action/update-action-usecase";
import { Request, Response } from "express";

export class UpdateActionController {
  constructor(private readonly updateActionUseCase: UpdateActionUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;
      const { name, date, description, categoryId } = request.body;

      if (!id) {
        return response.status(400).json({ message: 'Action ID is required' });
      }

      const updateData: any = {};

      if (name) updateData.name = name;
      if (date) updateData.date = new Date(date);
      if (description !== undefined) updateData.description = description;
      if (categoryId) updateData.categoryId = parseInt(categoryId);

      await this.updateActionUseCase.execute(id, updateData);

      return response.status(200).json({ message: 'Action updated successfully' });
    } catch (error: any) {
      if (error.message === 'Action not found') {
        return response.status(404).json({ message: error.message });
      }

      return response.status(500).json({ message: error.message });
    }
  }
}
