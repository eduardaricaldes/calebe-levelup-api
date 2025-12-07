import { Request, Response } from "express";
import UpdateChallengeUseCase from "@/app/usecases/challenge/update-challenge-usecase";

export default class UpdateChallengeController {
  constructor(private readonly updateChallengeUseCase: UpdateChallengeUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, date, description, categoryId } = req.body;

      if (!id) {
        return res.status(400).json({
          error: "Challenge ID is required",
        });
      }

      const challenge = await this.updateChallengeUseCase.execute(
        Number(id),
        name,
        date ? new Date(date) : undefined,
        description,
        categoryId
      );

      return res.status(200).json(challenge);
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
