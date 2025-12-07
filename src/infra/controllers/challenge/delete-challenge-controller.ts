import { Request, Response } from "express";
import DeleteChallengeUseCase from "@/app/usecases/challenge/delete-challenge-usecase";

export default class DeleteChallengeController {
  constructor(private readonly deleteChallengeUseCase: DeleteChallengeUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          error: "Challenge ID is required",
        });
      }

      await this.deleteChallengeUseCase.execute(Number(id));

      return res.status(200).json({
        message: "Challenge deleted successfully",
      });
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
